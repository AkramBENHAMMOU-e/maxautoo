import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Supprimer les données existantes
  await prisma.booking.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();
  await prisma.contact.deleteMany();

  // Créer un utilisateur admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Créer un utilisateur client
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
    },
  });

  // Créer des voitures
  const cars = await Promise.all([
    prisma.car.create({
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
    }),
    prisma.car.create({
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
    }),
    prisma.car.create({
      data: {
        brand: 'Porsche',
        model: '911',
        year: 2021,
        type: 'sport',
        transmission: 'manual',
        seats: 2,
        price: 200,
        image: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg',
        description: 'Voiture sport emblématique, performance et design exceptionnel.',
        status: 'available',
      },
    }),
    prisma.car.create({
      data: {
        brand: 'Renault',
        model: 'Clio',
        year: 2022,
        type: 'economy',
        transmission: 'manual',
        seats: 5,
        price: 40,
        image: 'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg',
        description: 'Voiture compacte parfaite pour la ville et les petits trajets.',
        status: 'available',
      },
    }),
    prisma.car.create({
      data: {
        brand: 'Tesla',
        model: 'Model S',
        year: 2023,
        type: 'luxury',
        transmission: 'automatic',
        seats: 5,
        price: 180,
        image: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg',
        description: 'Véhicule électrique de luxe avec une autonomie exceptionnelle.',
        status: 'available',
      },
    }),
  ]);

  // Créer quelques réservations
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

  await prisma.booking.create({
    data: {
      userId: user.id,
      carId: cars[0].id,
      startDate: oneWeekFromNow,
      endDate: twoWeeksFromNow,
      totalPrice: cars[0].price * 7, // 7 jours
      status: 'confirmed',
    },
  });

  console.log('Base de données remplie avec succès!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 