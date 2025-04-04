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

// GET /api/admin/bookings/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Vérification admin
  const adminError = await verifyAdmin();
  if (adminError) return adminError;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          }
        },
        car: true
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la réservation' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/bookings/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Vérification admin
  const adminError = await verifyAdmin();
  if (adminError) return adminError;

  try {
    const body = await request.json();
    const { status, userId, carId, startDate, endDate, totalPrice, originalCarId } = body;

    // Vérifier que la réservation existe
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        car: true
      }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si la voiture a changé
    const carChanged = originalCarId && carId !== originalCarId;

    // Vérifier si les dates se chevauchent avec d'autres réservations pour la même voiture
    if (carId && (startDate || endDate)) {
      const startDateObj = startDate ? new Date(startDate) : existingBooking.startDate;
      const endDateObj = endDate ? new Date(endDate) : existingBooking.endDate;

      const existingBookings = await prisma.booking.findMany({
        where: {
          id: { not: params.id }, // Exclure la réservation actuelle
          carId: carId,
          status: { not: 'cancelled' },
          AND: [
            { startDate: { lte: endDateObj } },
            { endDate: { gte: startDateObj } }
          ]
        }
      });

      if (existingBookings.length > 0) {
        return NextResponse.json(
          { error: 'La voiture est déjà réservée pour cette période' },
          { status: 400 }
        );
      }
    }

    // Si la voiture a changé, mettre à jour le statut de l'ancienne voiture
    if (carChanged && originalCarId) {
      // Vérifier si l'ancienne voiture a d'autres réservations actives
      const otherActiveBookings = await prisma.booking.findFirst({
        where: {
          id: { not: params.id },
          carId: originalCarId,
          status: { in: ['pending', 'confirmed'] }
        }
      });

      // Si aucune autre réservation active, remettre la voiture comme disponible
      if (!otherActiveBookings) {
        await prisma.car.update({
          where: { id: originalCarId },
          data: { status: 'available' }
        });
      }

      // Mettre à jour le statut de la nouvelle voiture si la réservation n'est pas annulée
      if (status !== 'cancelled') {
        await prisma.car.update({
          where: { id: carId },
          data: { status: 'booked' }
        });
      }
    } else if (status === 'cancelled' && existingBooking.status !== 'cancelled') {
      // Si la réservation est annulée, mettre à jour le statut de la voiture
      await prisma.car.update({
        where: { id: existingBooking.carId },
        data: { status: 'available' }
      });
    } else if (status !== 'cancelled' && existingBooking.status === 'cancelled') {
      // Si la réservation était annulée et ne l'est plus, mettre à jour le statut de la voiture
      await prisma.car.update({
        where: { id: carId || existingBooking.carId },
        data: { status: 'booked' }
      });
    }

    // Mettre à jour la réservation (uniquement les champs fournis)
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        ...(status !== undefined && { status }),
        ...(userId !== undefined && { userId }),
        ...(carId !== undefined && { carId }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
        ...(totalPrice !== undefined && { totalPrice }),
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
      }
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la réservation' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/bookings/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Vérification admin
  const adminError = await verifyAdmin();
  if (adminError) return adminError;

  try {
    // Vérifier que la réservation existe
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    // Stocker l'ID de la voiture avant de supprimer la réservation
    const carId = booking.carId;
    
    // Supprimer la réservation
    await prisma.booking.delete({
      where: { id: params.id },
    });

    // Vérifier s'il existe d'autres réservations actives pour cette voiture
    const activeBookings = await prisma.booking.findFirst({
      where: {
        carId,
        status: {
          in: ['pending', 'confirmed']
        }
      }
    });

    // Si aucune autre réservation active, remettre la voiture comme disponible
    if (!activeBookings) {
      await prisma.car.update({
        where: { id: carId },
        data: { status: 'available' },
      });
    }

    return NextResponse.json(
      { message: 'Réservation supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la réservation' },
      { status: 500 }
    );
  }
} 