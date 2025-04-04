const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Ajout des données de test en JavaScript...');

  try {
    // Créer un utilisateur admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });
    console.log('✓ Utilisateur admin créé');

    // Créer un utilisateur client
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'user@example.com',
        password: userPassword,
        role: 'USER',
      },
    });
    console.log('✓ Utilisateur client créé');

    // Créer des voitures
    const car1 = await prisma.car.create({
      data: {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2023,
        type: 'economy',
        transmission: 'automatic',
        seats: 5,
        price: 50,
        image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
        description: 'Voiture économique idéale pour la ville, avec faible consommation de carburant.',
        status: 'available',
      },
    });
    
    const car2 = await prisma.car.create({
      data: {
        brand: 'BMW',
        model: 'X5',
        year: 2022,
        type: 'luxury',
        transmission: 'automatic',
        seats: 5,
        price: 150,
        image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
        description: 'SUV de luxe avec intérieur cuir et technologie de pointe.',
        status: 'available',
      },
    });
    
    console.log('✓ Voitures créées');

    // Créer une réservation
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

    await prisma.booking.create({
      data: {
        userId: user.id,
        carId: car1.id,
        startDate: oneWeekFromNow,
        endDate: twoWeeksFromNow,
        totalPrice: car1.price * 7, // 7 jours
        status: 'confirmed',
      },
    });
    console.log('✓ Réservation créée');

    console.log('Base de données remplie avec succès!');
  } catch (error) {
    console.error('Erreur lors du remplissage de la base de données:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 