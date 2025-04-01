import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// Middleware de vérification admin
async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Accès refusé' },
      { status: 403 }
    );
  }

  return null; // Pas d'erreur, l'utilisateur est admin
}

// GET /api/admin/bookings
export async function GET(request: Request) {
  // Vérification admin
  const adminError = await verifyAdmin();
  if (adminError) return adminError;

  // Récupérer les paramètres de requête
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const status = url.searchParams.get('status') || undefined;
  
  // Calculer l'offset pour la pagination
  const skip = (page - 1) * limit;

  try {
    // Construire la requête de filtrage
    const where = status ? { status } : {};

    // Compter le nombre total de réservations pour la pagination
    const total = await prisma.booking.count({ where });

    // Récupérer les réservations avec pagination
    const bookings = await prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          }
        },
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            image: true,
          }
        }
      }
    });

    return NextResponse.json({
      bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    );
  }
}

// POST /api/admin/bookings - Créer une nouvelle réservation
export async function POST(request: Request) {
  // Vérification admin
  const adminError = await verifyAdmin();
  if (adminError) return adminError;

  try {
    const body = await request.json();
    const { userId, carId, startDate, endDate, totalPrice, status } = body;

    // Validation des données requises
    if (!userId || !carId || !startDate || !endDate || !totalPrice) {
      return NextResponse.json(
        { error: 'Toutes les informations sont requises' },
        { status: 400 }
      );
    }

    // Vérifier si la voiture existe et est disponible
    const car = await prisma.car.findUnique({
      where: { id: carId }
    });

    if (!car) {
      return NextResponse.json(
        { error: 'Voiture non trouvée' },
        { status: 404 }
      );
    }

    if (car.status !== 'available' && status !== 'cancelled') {
      return NextResponse.json(
        { error: 'Cette voiture n\'est pas disponible' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si les dates ne chevauchent pas d'autres réservations
    const existingBooking = await prisma.booking.findFirst({
      where: {
        carId,
        status: { not: 'cancelled' },
        OR: [
          {
            AND: [
              { startDate: { lte: new Date(startDate) } },
              { endDate: { gte: new Date(startDate) } }
            ]
          },
          {
            AND: [
              { startDate: { lte: new Date(endDate) } },
              { endDate: { gte: new Date(endDate) } }
            ]
          }
        ]
      }
    });

    if (existingBooking && status !== 'cancelled') {
      return NextResponse.json(
        { error: 'Cette voiture est déjà réservée pour ces dates' },
        { status: 400 }
      );
    }

    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status || 'pending',
        totalPrice,
        userId,
        carId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          }
        },
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
          }
        }
      },
    });

    // Mettre à jour le statut de la voiture si la réservation n'est pas annulée
    if (status !== 'cancelled') {
      await prisma.car.update({
        where: { id: carId },
        data: { status: 'booked' },
      });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la réservation' },
      { status: 500 }
    );
  }
} 