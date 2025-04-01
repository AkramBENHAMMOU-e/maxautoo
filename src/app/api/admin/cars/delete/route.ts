import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification et le rôle admin
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Récupérer les IDs à supprimer
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Aucun identifiant de voiture fourni" },
        { status: 400 }
      );
    }

    // Vérifier si des voitures sont actuellement louées
    const activeBookings = await prisma.booking.findMany({
      where: {
        carId: { in: ids },
        status: "confirmed",
        endDate: {
          gte: new Date(),
        },
      },
      select: {
        carId: true,
      }
    });

    if (activeBookings.length > 0) {
      const activeCarIds = activeBookings.map(booking => booking.carId);
      return NextResponse.json(
        { 
          error: "Impossible de supprimer des voitures actuellement louées",
          activeCarIds 
        },
        { status: 400 }
      );
    }

    // Supprimer les voitures
    const result = await prisma.car.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `${result.count} voiture(s) supprimée(s) avec succès`
    });
  } catch (error) {
    console.error("[API_CARS_DELETE_BATCH]", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la suppression des voitures" },
      { status: 500 }
    );
  }
} 