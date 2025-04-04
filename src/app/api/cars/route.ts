import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Prisma.CarWhereInput = {};

    // Filtrer par statut si spécifié
    if (status) {
      where.status = status;
    }

    // Recherche par marque, modèle ou type si spécifié
    if (search) {
      where.OR = [
        { brand: { contains: search } },
        { model: { contains: search } },
        { type: { contains: search } },
      ];
    }

    // Récupérer les voitures
    const cars = await prisma.car.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cars);
  } catch (error) {
    console.error("[API_CARS_GET]", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la récupération des voitures" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification et le rôle admin
    const user = await getCurrentUser();
    console.log("Utilisateur authentifié:", user?.email, "Rôle:", user?.role);
    
    if (!user || user.role !== "ADMIN") {
      console.error("Authentification échouée:", { user: !!user, role: user?.role });
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Récupérer les données JSON du corps de la requête
    const carData = await req.json();
    console.log("Données reçues par l'API:", carData);
    
    // Extraire les champs
    const {
      brand, 
      model, 
      year, 
      type, 
      transmission, 
      seats, 
      price, 
      description, 
      status, 
      image
    } = carData;

    // Validation détaillée
    const missingFields = [];
    if (!brand) missingFields.push("marque");
    if (!model) missingFields.push("modèle");
    if (!year || isNaN(year)) missingFields.push("année");
    if (!type) missingFields.push("type");
    if (!transmission) missingFields.push("transmission");
    if (!seats || isNaN(seats)) missingFields.push("places");
    if (!price || isNaN(price)) missingFields.push("prix");
    if (!description) missingFields.push("description");
    if (!status) missingFields.push("statut");
    if (!image) missingFields.push("image");

    // Si des champs sont manquants, renvoyer une erreur détaillée
    if (missingFields.length > 0) {
      console.error("Validation échouée - champs manquants:", missingFields);
      return NextResponse.json(
        { 
          error: "Certains champs requis sont manquants", 
          missingFields: missingFields 
        },
        { status: 400 }
      );
    }

    // Validation supplémentaire de l'URL de l'image
    // (Désactivée temporairement pour faciliter le déploiement)
    /* 
    if (!image.startsWith("http") && !image.startsWith("/uploads/")) {
      console.error("URL d'image invalide:", image);
      return NextResponse.json(
        { error: "L'URL de l'image n'est pas valide" },
        { status: 400 }
      );
    }
    */

    console.log("Création de la voiture avec les données validées:", {
      brand, model, year, type, transmission, seats, price, status, 
      image: image.substring(0, 50) + "..." // Tronquer l'URL pour les logs
    });

    // Créer la voiture dans la base de données
    const car = await prisma.car.create({
      data: {
        brand,
        model,
        year,
        type,
        transmission,
        seats,
        price,
        description,
        status,
        image,
      },
    });

    console.log("Voiture créée avec succès:", car.id);
    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error("[API_CARS_POST]", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la création de la voiture" },
      { status: 500 }
    );
  }
} 