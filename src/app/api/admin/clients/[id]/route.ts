import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { hash } from 'bcrypt';

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

// GET /api/admin/clients/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Vérification admin
  const adminError = await verifyAdmin();
  if (adminError) return adminError;

  try {
    const client = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        bookings: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            car: {
              select: {
                id: true,
                brand: true,
                model: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Ne pas renvoyer le mot de passe
    const { password, ...clientWithoutPassword } = client;
    
    // Obtenir le nombre de réservations séparément
    const bookingsCount = await prisma.booking.count({
      where: { userId: params.id },
    });

    return NextResponse.json({
      ...clientWithoutPassword,
      _count: { bookings: bookingsCount }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du client:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du client' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/clients/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Vérification admin
  const adminError = await verifyAdmin();
  if (adminError) return adminError;

  try {
    const body = await request.json();
    const { email, password, role } = body;

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Préparer les données à mettre à jour
    const updateData: any = {};
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) {
      updateData.password = await hash(password, 10);
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    });

    // Ne pas renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du client' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/clients/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Vérification admin
  const adminError = await verifyAdmin();
  if (adminError) return adminError;

  try {
    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // On ne peut pas supprimer un admin
    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Impossible de supprimer un administrateur' },
        { status: 403 }
      );
    }

    // Supprimer d'abord toutes les réservations de l'utilisateur
    // (pour respecter les contraintes de clé étrangère)
    await prisma.booking.deleteMany({
      where: { userId: params.id },
    });

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Client supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du client' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/clients/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Vérification admin
  const adminError = await verifyAdmin();
  if (adminError) return adminError;

  try {
    const body = await request.json();
    const { email, password, role } = body;

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Préparer les données à mettre à jour
    const updateData: any = {};
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) {
      updateData.password = await hash(password, 10);
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
    });

    // Ne pas renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du client' },
      { status: 500 }
    );
  }
} 