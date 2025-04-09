const { PrismaClient } = require('@prisma/client');

// Utiliser explicitement l'URL de base de données de production
// Cette URL sera récupérée automatiquement des variables d'environnement de Vercel
const prisma = new PrismaClient();

// Liste des voitures spécifiques à supprimer 
// (plus précise que juste par marque pour éviter de supprimer des voitures légitimes)
const demoCarDetails = [
  { brand: 'BMW', model: 'X5' },
  { brand: 'Toyota', model: 'Corolla' },
  { brand: 'Porsche', model: '911' },
  { brand: 'Renault', model: 'Clio' },
  { brand: 'Tesla', model: 'Model S' }
];

async function main() {
  console.log('🧹 Nettoyage de la base de données de production...');

  try {
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
    console.log(`📋 ${demoCars.length} voitures de test trouvées en production`);
    
    // Afficher les voitures trouvées
    demoCars.forEach(car => {
      console.log(`- ${car.brand} ${car.model} (ID: ${car.id})`);
    });

    // 2. Supprimer les réservations liées à ces voitures
    const deletedBookings = await prisma.booking.deleteMany({
      where: {
        carId: {
          in: carIds
        }
      }
    });
    
    console.log(`🗑️ ${deletedBookings.count} réservations supprimées`);

    // 3. Supprimer les voitures de test
    const deletedCars = await prisma.car.deleteMany({
      where: {
        id: {
          in: carIds
        }
      }
    });
    
    console.log(`🚗 ${deletedCars.count} voitures de test supprimées`);
    console.log('✅ Nettoyage de production terminé avec succès!');
    
    // Afficher les voitures restantes
    const remainingCars = await prisma.car.count();
    console.log(`📊 Il reste ${remainingCars} voiture(s) dans la base de données de production.`);
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage de la base de données:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 