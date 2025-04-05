import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/contact/[id] - Récupère un message spécifique
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Récupérer l'ID depuis les paramètres
    const params = await context.params;
    const id = params.id;

    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // S'assurer que l'ID est disponible
    if (!id) {
      return NextResponse.json(
        { error: "ID non fourni" },
        { status: 400 }
      );
    }

    // Récupérer le message
    const message = await prisma.contact.findUnique({
      where: {
        id,
      },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Erreur lors de la récupération du message:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PATCH /api/contact/[id] - Met à jour un message (statut uniquement)
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Récupérer l'ID depuis les paramètres
    const params = await context.params;
    const id = params.id;

    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // S'assurer que l'ID est disponible
    if (!id) {
      return NextResponse.json(
        { error: "ID non fourni" },
        { status: 400 }
      );
    }

    // Récupérer les données de la requête
    const data = await request.json();
    
    // Vérifier que seul le statut est mis à jour
    if (!data.status || (data.status !== "READ" && data.status !== "UNREAD")) {
      return NextResponse.json(
        { error: "Statut invalide" },
        { status: 400 }
      );
    }

    // Mettre à jour le message
    const updatedMessage = await prisma.contact.update({
      where: {
        id,
      },
      data: {
        status: data.status,
      },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du message:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
} 