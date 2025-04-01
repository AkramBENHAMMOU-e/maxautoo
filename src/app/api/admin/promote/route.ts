import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Cette route est temporaire et devrait être supprimée en production
// car elle permet de promouvoir n'importe quel utilisateur en admin

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'L\'email est requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Promouvoir l'utilisateur en admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { 
        role: 'ADMIN'
      },
    });

    return NextResponse.json({
      message: `Utilisateur ${email} promu administrateur avec succès`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la promotion de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la promotion de l\'utilisateur' },
      { status: 500 }
    );
  }
} 