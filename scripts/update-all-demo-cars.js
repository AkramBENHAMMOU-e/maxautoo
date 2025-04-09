const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Liste des voitures de démonstration avec leur marque et modèle
const demoCars = [
  { brand: 'BMW', model: 'X5' },
  { brand: 'Toyota', model: 'Corolla' },
  { brand: 'Porsche', model: '911' },
  { brand: 'Renault', model: 'Clio' },
  { brand: 'Tesla', model: 'Model S' }
];

async function main() {
  console.log('🚗 Marquage de toutes les voitures de démonstration comme indisponibles...');

  try {
    // Mettre à jour chaque voiture de démonstration
    for (const car of demoCars) {
      const result = await prisma.car.updateMany({
        where: {
          brand: car.brand,
          model: car.model,
        },
        data: {
          status: 'unavailable',
        },
      });
      
      console.log(`${car.brand} ${car.model} mise à jour : ${result.count} voiture(s)`);
    }

    console.log('✅ Mise à jour terminée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des voitures:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 