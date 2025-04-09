const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Liste des voitures de démonstration à supprimer
const demoCarBrands = ['BMW', 'Toyota', 'Porsche', 'Renault', 'Tesla'];

async function main() {
  console.log('🧹 Nettoyage de la base de données...');

  try {
    // 1. Récupérer toutes les voitures de test
    const demoCars = await prisma.car.findMany({
      where: {
        brand: {
          in: demoCarBrands
        }
      }
    });

    const carIds = demoCars.map(car => car.id);
    console.log(`📋 ${demoCars.length} voitures de test trouvées`);

    // 2. Supprimer toutes les réservations liées à ces voitures
    const deletedBookings = await prisma.booking.deleteMany({
      where: {
        carId: {
          in: carIds
        }
      }
    });
    
    console.log(`🗑️ ${deletedBookings.count} réservations supprimées`);

    // 3. Supprimer toutes les voitures de test
    const deletedCars = await prisma.car.deleteMany({
      where: {
        id: {
          in: carIds
        }
      }
    });
    
    console.log(`🚗 ${deletedCars.count} voitures de test supprimées`);
    console.log('✅ Nettoyage terminé avec succès!');
    
    // Afficher les voitures restantes
    const remainingCars = await prisma.car.count();
    console.log(`📊 Il reste ${remainingCars} voiture(s) dans la base de données.`);
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage de la base de données:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 