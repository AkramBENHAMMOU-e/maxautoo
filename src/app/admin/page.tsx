import { redirect } from "next/navigation";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AdminClient } from './components/admin-client';

async function getStatistics() {
  // Nombre total de clients
  const totalUsers = await prisma.user.count({
    where: { role: 'USER' }
  });

  // Nombre total de véhicules
  const totalCars = await prisma.car.count();

  // Nombre de véhicules disponibles
  const availableCars = await prisma.car.count({
    where: { status: 'available' }
  });

  // Nombre total de réservations
  const totalBookings = await prisma.booking.count();

  // Nombre de réservations en attente
  const pendingBookings = await prisma.booking.count({
    where: { status: 'pending' }
  });

  // Revenu total (de toutes les réservations confirmées)
  const revenue = await prisma.booking.aggregate({
    where: { status: 'confirmed' },
    _sum: { totalPrice: true }
  });

  // Réservations récentes
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { email: true } },
      car: { select: { brand: true, model: true } }
    }
  });

  return {
    totalUsers,
    totalCars,
    availableCars,
    totalBookings,
    pendingBookings,
    revenue: revenue._sum.totalPrice || 0,
    recentBookings
  };
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!session) {
    redirect('/auth/login?callbackUrl=/admin');
  }
  
  // Vérifier si l'utilisateur est un administrateur
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || '' },
  });

  if (!user || user.role !== 'ADMIN') {
    // Rediriger vers la page d'accueil si l'utilisateur n'est pas un administrateur
    redirect('/');
  }

  // Rediriger vers le dashboard administrateur
  redirect('/admin/dashboard');
}
