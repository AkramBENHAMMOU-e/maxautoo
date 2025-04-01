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
    const { status } = body;

    // Vérifier que la réservation existe
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour la réservation (uniquement le statut)
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
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

    // Supprimer la réservation
    await prisma.booking.delete({
      where: { id: params.id },
    });

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