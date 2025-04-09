const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚗 Marquage des voitures de démonstration comme indisponibles...');

  try {
    // Marquer la BMW X5 comme indisponible
    const bmwResult = await prisma.car.updateMany({
      where: {
        brand: 'BMW',
        model: 'X5',
      },
      data: {
        status: 'unavailable',
      },
    });
    
    console.log(`BMW X5 mise à jour : ${bmwResult.count} voiture(s)`);

    // Marquer la Toyota Corolla comme indisponible
    const toyotaResult = await prisma.car.updateMany({
      where: {
        brand: 'Toyota',
        model: 'Corolla',
      },
      data: {
        status: 'unavailable',
      },
    });
    
    console.log(`Toyota Corolla mise à jour : ${toyotaResult.count} voiture(s)`);

    console.log('✅ Mise à jour terminée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des voitures:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 