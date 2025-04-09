import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// Liste des voitures de démonstration à supprimer
const demoCarDetails = [
  { brand: 'BMW', model: 'X5' },
  { brand: 'Toyota', model: 'Corolla' },
  { brand: 'Porsche', model: '911' },
  { brand: 'Renault', model: 'Clio' },
  { brand: 'Tesla', model: 'Model S' }
];

export async function GET(req: NextRequest) {
  try {
    // Vérifier l'authentification et les autorisations
    const session = await getServerSession(authOptions);
    
    // S'assurer que l'utilisateur est un administrateur
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé. Seuls les administrateurs peuvent effectuer cette action.' },
        { status: 403 }
      );
    }

    // Code secret dans l'URL pour une sécurité supplémentaire
    const { searchParams } = new URL(req.url);
    const secretKey = searchParams.get('key');
    
    // Vérifier le code secret (il devrait être stocké dans les variables d'environnement)
    const expectedSecret = process.env.ADMIN_SECRET_KEY || 'admin-secret-key';
    
    if (secretKey !== expectedSecret) {
      return NextResponse.json(
        { error: 'Clé secrète invalide' },
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
        carsDeleted: deletedCars.count,
        bookingsDeleted: deletedBookings.count,
        remainingCars: remainingCars,
        deletedCarsList: demoCars.map(car => `${car.brand} ${car.model}`)
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