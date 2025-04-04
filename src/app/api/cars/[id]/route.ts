import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extraire l'ID de façon sécurisée
    const { id } = params;
    
    const car = await prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      return NextResponse.json(
        { error: "Voiture non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error("[API_CAR_GET]", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la récupération de la voiture" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification et le rôle admin
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }
    
    // Extraire l'ID de façon sécurisée
    const { id } = params;

    // Vérifier si la voiture existe
    const existingCar = await prisma.car.findUnique({
      where: { id },
    });

    if (!existingCar) {
      return NextResponse.json(
        { error: "Voiture non trouvée" },
        { status: 404 }
      );
    }

    // Récupérer les données JSON au lieu du formData
    const carData = await req.json();
    
    // Validation de base
    if (!carData.brand || !carData.model || !carData.year || !carData.type || 
        !carData.transmission || !carData.seats || !carData.price || 
        !carData.description || !carData.status) {
      return NextResponse.json(
        { error: "Tous les champs requis doivent être remplis" },
        { status: 400 }
      );
    }

    // Mettre à jour la voiture dans la base de données
    const updatedCar = await prisma.car.update({
      where: { id },
      data: {
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        type: carData.type,
        transmission: carData.transmission,
        seats: carData.seats,
        price: carData.price,
        image: carData.image,
        description: carData.description,
        status: carData.status,
      },
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error("[API_CAR_PUT]", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la mise à jour de la voiture" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification et le rôle admin
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }
    
    // Extraire l'ID de façon sécurisée
    const { id } = params;

    // Vérifier si la voiture existe
    const existingCar = await prisma.car.findUnique({
      where: { id },
    });

    if (!existingCar) {
      return NextResponse.json(
        { error: "Voiture non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier si la voiture est déjà louée
    const activeBooking = await prisma.booking.findFirst({
      where: {
        carId: id,
        status: "confirmed",
        endDate: {
          gte: new Date(),
        },
      },
    });

    if (activeBooking) {
      return NextResponse.json(
        { error: "Impossible de supprimer une voiture actuellement louée" },
        { status: 400 }
      );
    }

    // Supprimer la voiture
    await prisma.car.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Voiture supprimée avec succès" });
  } catch (error) {
    console.error("[API_CAR_DELETE]", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la suppression de la voiture" },
      { status: 500 }
    );
  }
} 