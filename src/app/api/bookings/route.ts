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
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();

    // Validation des données requises
    if (!body.carId || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Toutes les informations sont requises' },
        { status: 400 }
      );
    }

    // Vérifier si la voiture est disponible
    const car = await prisma.car.findUnique({
      where: { id: body.carId }
    });

    if (!car) {
      return NextResponse.json(
        { error: 'Voiture non trouvée' },
        { status: 404 }
      );
    }

    if (car.status !== 'available') {
      return NextResponse.json(
        { error: 'Cette voiture n\'est pas disponible' },
        { status: 400 }
      );
    }

    // Vérifier si les dates ne chevauchent pas d'autres réservations
    const existingBooking = await prisma.booking.findFirst({
      where: {
        carId: body.carId,
        OR: [
          {
            AND: [
              { startDate: { lte: new Date(body.startDate) } },
              { endDate: { gte: new Date(body.startDate) } }
            ]
          },
          {
            AND: [
              { startDate: { lte: new Date(body.endDate) } },
              { endDate: { gte: new Date(body.endDate) } }
            ]
          }
        ]
      }
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Cette voiture est déjà réservée pour ces dates' },
        { status: 400 }
      );
    }

    // Créer la réservation
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        status: 'pending',
        totalPrice: body.totalPrice,
        userId: user.id,
        carId: body.carId,
      },
      include: {
        car: true,
      },
    });

    // Mettre à jour le statut de la voiture
    await prisma.car.update({
      where: { id: body.carId },
      data: { status: 'booked' },
    });

    return NextResponse.json(booking);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: 'Erreur de validation des données' },
        { status: 400 }
      );
    }
    
    console.error('Erreur lors de la création de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la réservation' },
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
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de la réservation requis' },
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
        { error: 'Réservation non trouvée' },
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
          { error: 'Réservation non trouvée' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Erreur de validation des données' },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la mise à jour de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la réservation' },
      { status: 500 }
    );
  }
} 