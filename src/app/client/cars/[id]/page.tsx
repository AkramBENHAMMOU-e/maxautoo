import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import BookingForm from '@/components/BookingForm';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';

// Temporary mock data - in a real app this would come from an API
const carsData = [
  {
    id: "1",
    name: "Tesla Model 3",
    category: "Electric",
    price: 89,
    image: "https://same-assets.com/3da9e3ddce17a2ff8dfff77f56db8a44-image.png",
    gallery: [
      "https://same-assets.com/3da9e3ddce17a2ff8dfff77f56db8a44-image.png",
      "https://same-assets.com/c3a1e5ef0fb1b4ea1aeabf7b6cd03aad-image.png",
      "https://same-assets.com/a8ff02c4b4343ed66e0fa066abbd3da6-image.png",
    ],
    description: "Experience the future of driving with the Tesla Model 3. This all-electric sedan combines luxury, performance, and cutting-edge technology for an unmatched driving experience.",
    specs: {
      seats: 5,
      doors: 4,
      transmission: "Automatic",
      fuelType: "Electric",
      range: "358 miles",
      acceleration: "0-60 mph in 3.1s",
      topSpeed: "162 mph",
      year: 2023
    },
    features: [
      "Autopilot",
      "15-inch touchscreen",
      "Premium sound system",
      "Heated seats",
      "Glass roof",
      "Navigation",
      "Bluetooth connectivity",
      "USB-C ports"
    ],
    rating: 4.9,
    reviews: 128
  },
  {
    id: "2",
    name: "BMW X5",
    category: "SUV",
    price: 120,
    image: "https://same-assets.com/f0c9dbbf7e7c02a15f2e73b0e93ef64d-image.png",
    gallery: [
      "https://same-assets.com/f0c9dbbf7e7c02a15f2e73b0e93ef64d-image.png",
      "https://same-assets.com/2e35e0afba1cb3c6a9c6e82e841ffd38-image.png",
      "https://same-assets.com/ca08232ffbf92a757cd4d3e0b15ed8a2-image.png",
    ],
    description: "The BMW X5 offers the perfect blend of luxury, performance, and versatility. This premium SUV delivers a smooth ride, spacious interior, and advanced features for an exceptional driving experience.",
    specs: {
      seats: 7,
      doors: 5,
      transmission: "Automatic",
      fuelType: "Diesel",
      range: "580 miles",
      acceleration: "0-60 mph in 5.3s",
      topSpeed: "150 mph",
      year: 2023
    },
    features: [
      "Panoramic sunroof",
      "12.3-inch infotainment display",
      "Harman Kardon sound system",
      "Heated and ventilated seats",
      "Wireless charging",
      "Adaptive cruise control",
      "Ambient lighting",
      "Gesture control"
    ],
    rating: 4.8,
    reviews: 96
  },
  // More cars would be here in a real implementation
];

async function getCarDetails(id: string) {
  const car = await prisma.car.findUnique({
    where: { id },
  });

  if (!car) {
    notFound();
  }

  return car;
}

export default async function CarDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const car = await getCarDetails(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/client/cars" className="text-blue-600 hover:underline flex items-center">
          &larr; Retour aux voitures
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Détails de la voiture */}
        <div>
          <img
            src={car.image || '/placeholder-car.jpg'}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-[400px] object-cover rounded-lg shadow-lg"
          />
          <div className="mt-6">
            <h1 className="text-3xl font-bold">
              {car.brand} {car.model} ({car.year})
            </h1>
            <p className="text-gray-600 mt-2">{car.description}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="font-semibold">Type</h3>
                <p>{car.type}</p>
              </div>
              <div>
                <h3 className="font-semibold">Transmission</h3>
                <p>{car.transmission}</p>
              </div>
              <div>
                <h3 className="font-semibold">Places</h3>
                <p>{car.seats}</p>
              </div>
              <div>
                <h3 className="font-semibold">Prix par jour</h3>
                <p>{car.price.toFixed(2)} €</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de réservation */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Réserver cette voiture</h2>
          {session ? (
            <BookingForm car={car} userEmail={session.user?.email} />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Veuillez vous connecter pour réserver cette voiture
              </p>
              <a
                href={`/auth/login?callbackUrl=/client/cars/${car.id}`}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Se connecter
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
