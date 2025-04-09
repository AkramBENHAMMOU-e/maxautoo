import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Liste des voitures de démonstration à supprimer
const demoCarDetails = [
  { brand: 'BMW', model: 'X5' },
  { brand: 'Toyota', model: 'Corolla' },
  { brand: 'Porsche', model: '911' },
  { brand: 'Renault', model: 'Clio' },
  { brand: 'Tesla', model: 'Model S' }
];

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Ajouter une clé secrète simple pour éviter les appels non autorisés
    const { searchParams } = new URL(req.url);
    const secretKey = searchParams.get('key');
    
    // Clé simple temporaire - à remplacer par une meilleure sécurité plus tard
    if (secretKey !== 'nettoyage123') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }
    
    // Construire la condition OR pour chaque paire marque/modèle
    const whereCondition = {
      OR: demoCarDetails.map(car => ({
        AND: [
          { brand: car.brand },
          { model: car.model }
        ]
      }))
    };

    // 1. Récupérer les voitures de test spécifiques
    const demoCars = await prisma.car.findMany({
      where: whereCondition
    });

    const carIds = demoCars.map(car => car.id);
    
    if (carIds.length === 0) {
      return NextResponse.json(
        { message: 'Aucune voiture de démonstration trouvée dans la base de données.' },
        { status: 200 }
      );
    }
    
    // 2. Supprimer les réservations liées à ces voitures
    const deletedBookings = await prisma.booking.deleteMany({
      where: {
        carId: {
          in: carIds
        }
      }
    });
    
    // 3. Supprimer les voitures de test
    const deletedCars = await prisma.car.deleteMany({
      where: {
        id: {
          in: carIds
        }
      }
    });
    
    // 4. Compter les voitures restantes
    const remainingCars = await prisma.car.count();
    
    return NextResponse.json({
      success: true,
      message: 'Nettoyage de la base de données effectué avec succès',
      details: {
        carsFound: demoCars.length,
        carsDetails: demoCars.map(car => `${car.brand} ${car.model} (ID: ${car.id})`),
        carsDeleted: deletedCars.count,
        bookingsDeleted: deletedBookings.count,
        remainingCars
      }
    });

  } catch (error) {
    console.error('Erreur lors du nettoyage de la base de données:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du nettoyage de la base de données' },
      { status: 500 }
    );
  }
} 