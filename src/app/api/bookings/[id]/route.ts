import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        car: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Erreur lors de la récupération de la réservation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la réservation" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer la réservation
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est propriétaire de la réservation
    if (booking.userId !== user.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }

    // Vérifier que la réservation peut être annulée (status pending)
    if (booking.status !== "pending") {
      return NextResponse.json(
        { error: "Cette réservation ne peut pas être annulée" },
        { status: 400 }
      );
    }

    // Mettre à jour le statut de la réservation
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status: "cancelled" },
      include: {
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            image: true,
            price: true,
          },
        },
      },
    });

    // Mettre à jour le statut de la voiture à "available"
    await prisma.car.update({
      where: { id: booking.carId },
      data: { status: "available" },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Erreur lors de l'annulation de la réservation:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
} 