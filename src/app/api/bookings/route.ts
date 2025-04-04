import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from '@prisma/client';

// GET /api/bookings - Récupérer les réservations de l'utilisateur connecté
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        car: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Créer une nouvelle réservation
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier que l'utilisateur existe dans la base de données
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé dans la base de données" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { carId, startDate, endDate, totalPrice, whatsappNumber } = body;

    // Validation des données
    if (!carId || !startDate || !endDate || !totalPrice) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    // Vérifier si la voiture est disponible
    const car = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return NextResponse.json(
        { error: "Voiture non trouvée" },
        { status: 404 }
      );
    }

    if (car.status !== 'available') {
      return NextResponse.json(
        { error: "Voiture non disponible" },
        { status: 400 }
      );
    }

    // Vérifier les conflits de réservation
    const existingBooking = await prisma.booking.findFirst({
      where: {
        carId,
        status: {
          in: ['pending', 'confirmed']  // Ne vérifier que les réservations actives
        },
        AND: [
          {
            startDate: {
              lte: new Date(endDate),
            },
          },
          {
            endDate: {
              gte: new Date(startDate),
            },
          },
        ],
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "La voiture est déjà réservée pour cette période" },
        { status: 400 }
      );
    }

    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        carId: carId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice,
        status: 'pending',
      },
    });

    // Inclure le numéro WhatsApp dans la réponse pour la redirection
    const bookingWithWhatsapp = {
      ...booking,
      whatsappNumber: whatsappNumber || null
    };

    // Mettre à jour le statut de la voiture
    await prisma.car.update({
      where: { id: carId },
      data: { status: 'rented' },
    });

    return NextResponse.json(bookingWithWhatsapp);
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/[id]
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "ID de la réservation requis" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur est propriétaire de la réservation
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id,
        user: {
          email: session.user.email
        }
      }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: body.status,
        ...(body.startDate && { startDate: new Date(body.startDate) }),
        ...(body.endDate && { endDate: new Date(body.endDate) }),
        ...(body.totalPrice && { totalPrice: body.totalPrice }),
      },
      include: {
        car: true,
      },
    });

    // Mettre à jour le statut de la voiture si nécessaire
    if (body.status === 'cancelled') {
      await prisma.car.update({
        where: { id: booking.carId },
        data: { status: 'available' },
      });
    }

    return NextResponse.json(booking);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Réservation non trouvée" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Erreur de validation des données" },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la mise à jour de la réservation:', error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la réservation" },
      { status: 500 }
    );
  }
} 