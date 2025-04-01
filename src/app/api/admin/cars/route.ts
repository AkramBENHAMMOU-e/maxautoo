import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
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

// GET /api/admin/cars
export async function GET(request: Request) {
  // Vérification admin
  const adminError = await verifyAdmin();
  if (adminError) return adminError;

  try {
    // Récupérer les paramètres de requête
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || undefined;

    // Construire la requête
    const where: any = {};

    // Filtre par statut
    if (status && status !== 'all') {
      where.status = status;
    }

    // Recherche par marque ou modèle
    if (search) {
      where.OR = [
        {
          brand: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          model: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          type: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Récupérer les voitures
    const cars = await prisma.car.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Récupérer les statistiques
    const carsTotal = await prisma.car.count();
    const carsAvailable = await prisma.car.count({
      where: { status: 'available' },
    });
    const carsUnavailable = carsTotal - carsAvailable;

    // Statistiques
    const stats = {
      all: carsTotal,
      available: carsAvailable,
      unavailable: carsUnavailable,
    };

    return NextResponse.json({ cars, stats });
  } catch (error) {
    console.error('Erreur lors de la récupération des voitures:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des voitures' },
      { status: 500 }
    );
  }
} 