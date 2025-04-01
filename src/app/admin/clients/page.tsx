import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Search, Filter, UserPlus, Download, RefreshCw } from 'lucide-react';
import ClientActions from '@/components/admin/ClientActions';
import { format } from 'date-fns';
import { ClientsClient } from './components/clients-client';

// Fonction pour récupérer les clients avec filtres
async function getClients(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
) {
  const params = await searchParams;
  const search = params.search ? (params.search as string) : undefined;
  const sort = params.sort ? (params.sort as string) : 'recent';

  // Construire la requête
  const where: any = {
    role: 'USER', // Uniquement les utilisateurs clients
  };

  // Recherche par email
  if (search) {
    where.OR = [
      {
        email: {
          contains: search,
        },
      },
    ];
  }

  // Récupérer les clients
  const clients = await prisma.user.findMany({
    where,
    include: {
      _count: {
        select: {
          bookings: true,
        },
      },
      bookings: {
        take: 1,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          createdAt: true,
        },
      },
    },
    orderBy: 
      sort === 'recent' 
        ? { createdAt: 'desc' } 
        : sort === 'bookings'
        ? { bookings: { _count: 'desc' } }
        : { email: 'asc' },
  });

  // Récupérer le nombre total de clients
  const totalClients = await prisma.user.count({ where: { role: 'USER' } });

  // Récupérer le nombre total de réservations
  const totalBookings = await prisma.booking.count();

  // Calculer le nombre moyen de réservations par client
  const avgBookingsPerClient = totalClients > 0 ? (totalBookings / totalClients).toFixed(1) : '0';

  return { 
    clients, 
    stats: { 
      totalClients, 
      totalBookings, 
      avgBookingsPerClient 
    } 
  };
}

// Fonction pour exporter les clients en CSV
function generateCSV(clients: any[]) {
  const headers = ['ID', 'Email', 'Date d\'inscription', 'Nombre de réservations', 'Dernière réservation'];
  
  const rows = clients.map((client) => [
    client.id,
    client.email,
    format(new Date(client.createdAt), 'dd/MM/yyyy'),
    client._count.bookings,
    client.bookings[0] 
      ? format(new Date(client.bookings[0].createdAt), 'dd/MM/yyyy') 
      : 'Jamais',
  ]);

  return [headers, ...rows].map((row) => row.join(',')).join('\n');
}

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { clients, stats } = await getClients(Promise.resolve(searchParams));
  
  // Utiliser des valeurs sécurisées pour les paramètres de recherche
  const params = await Promise.resolve(searchParams);
  const searchQuery = params.search ? (params.search as string) : '';
  const currentSort = params.sort ? (params.sort as string) : 'recent';

  return (
    <ClientsClient 
      clients={clients}
      stats={stats}
      searchQuery={searchQuery}
      currentSort={currentSort}
    />
  );
} 