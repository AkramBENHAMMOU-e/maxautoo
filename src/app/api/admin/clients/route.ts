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

// GET /api/admin/clients
export async function GET(request: Request) {
  // Vérification admin
  const adminError = await verifyAdmin();
  if (adminError) return adminError;

  // Récupérer les paramètres de requête
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const search = url.searchParams.get('search') || '';
  
  // Calculer l'offset pour la pagination
  const skip = (page - 1) * limit;

  try {
    // Construire la requête de recherche
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    // Compter le nombre total de clients pour la pagination
    const total = await prisma.user.count({ where });

    // Récupérer les clients avec pagination
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    return NextResponse.json({
      users,
      clients: users, // Pour la rétrocompatibilité
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des clients' },
      { status: 500 }
    );
  }
}

// POST /api/admin/clients - Créer un nouveau client
export async function POST(request: Request) {
  // Vérification admin
  const adminError = await verifyAdmin();
  if (adminError) return adminError;

  try {
    const body = await request.json();
    const { email, password, role } = body;

    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'email est déjà utilisé
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Créer le nouvel utilisateur
    const newUser = await prisma.user.create({
      data: {
        email,
        password: await hash(password, 10), // Hashage du mot de passe
        role: role || 'USER', // Par défaut, rôle USER
      },
    });

    // Ne pas renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du client' },
      { status: 500 }
    );
  }
} 