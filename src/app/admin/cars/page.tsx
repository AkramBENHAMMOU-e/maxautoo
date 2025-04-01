import prisma from '@/lib/prisma';
import { CarsClient } from './components/cars-client';

// Fonction pour récupérer les voitures avec filtres
async function getCars(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
) {
  // Récupérer les paramètres de recherche de manière sécurisée
  const params = await searchParams;
  const search = params.search ? (params.search as string) : undefined;
  const status = params.status ? (params.status as string) : undefined;

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
        },
      },
      {
        model: {
          contains: search,
        },
      },
      {
        type: {
          contains: search,
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

  return { cars, stats };
}

export default async function AdminCarsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { cars, stats } = await getCars(Promise.resolve(searchParams));

  // Valeurs pour le filtrage
  const params = await Promise.resolve(searchParams);
  const searchQuery = params.search ? (params.search as string) : '';
  const currentStatus = params.status ? (params.status as string) : 'all';

  return (
    <CarsClient 
      cars={cars} 
      stats={stats} 
      searchQuery={searchQuery} 
      currentStatus={currentStatus}
    />
  );
} 