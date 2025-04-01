import prisma from '@/lib/prisma';
import { BookingsClient } from './components/bookings-client';

// Fonction pour récupérer les réservations avec filtres
async function getBookings(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
) {
  const params = await searchParams;
  const status = params.status ? (params.status as string) : undefined;
  const search = params.search ? (params.search as string) : undefined;

  const where: any = {};

  // Filtre par statut
  if (status && status !== 'all') {
    where.status = status;
  }

  // Recherche par email de client ou modèle de voiture
  if (search) {
    where.OR = [
      {
        user: {
          email: {
            contains: search,
          },
        },
      },
      {
        car: {
          OR: [
            { 
              brand: { 
                contains: search
              } 
            },
            { 
              model: { 
                contains: search
              } 
            },
          ],
        },
      },
    ];
  }

  // Récupérer les réservations avec les informations sur la voiture et le client
  const bookings = await prisma.booking.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      car: {
        select: {
          id: true,
          brand: true,
          model: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Récupérer les statistiques par statut
  const statusStats = await prisma.booking.groupBy({
    by: ['status'],
    _count: {
      id: true,
    },
  });

  // Formater les statistiques
  const stats = {
    all: bookings.length,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  };

  statusStats.forEach((stat) => {
    stats[stat.status as keyof typeof stats] = stat._count.id;
  });

  return { bookings, stats };
}

export default async function AdminBookingsPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  const { bookings, stats } = await getBookings(Promise.resolve(searchParams));

  // Valeurs pour le filtrage
  const params = await Promise.resolve(searchParams);
  const currentStatus = params.status ? (params.status as string) : 'all';
  const searchQuery = params.search ? (params.search as string) : '';

  return (
    <BookingsClient 
      bookings={bookings} 
      stats={stats} 
      currentStatus={currentStatus} 
      searchQuery={searchQuery} 
    />
  );
} 