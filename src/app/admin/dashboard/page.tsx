import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { DashboardClient } from './components/dashboard-client';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!session) {
    console.log('User not authenticated, redirecting to login');
    redirect('/auth/login?callbackUrl=/admin/dashboard');
    return null;
  }
  
  // Vérifier explicitement si l'utilisateur est un administrateur
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || '' },
  });

  if (!user || user.role !== 'ADMIN') {
    // Rediriger vers la page d'accueil si l'utilisateur n'est pas un administrateur
    console.log('User is not admin, redirecting to home');
    redirect('/');
    return null;
  }

  // Obtenir les statistiques pour le tableau de bord
  const [carsCount, usersCount, bookingsCount, bookings] = await Promise.all([
    prisma.car.count(),
    prisma.user.count(),
    prisma.booking.count(),
    prisma.booking.findMany({
      take: 5,
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
    })
  ]);

  // Calculer le revenu total (somme des prix de toutes les réservations)
  const revenue = await prisma.booking.aggregate({
    _sum: {
      totalPrice: true,
    },
    where: {
      status: 'completed'
    }
  });

  const totalRevenue = revenue._sum.totalPrice || 0;

  // Passez toutes les données au composant client
  return (
    <DashboardClient 
      carsCount={carsCount}
      usersCount={usersCount}
      bookingsCount={bookingsCount}
      bookings={bookings}
      totalRevenue={totalRevenue}
    />
  );
}
