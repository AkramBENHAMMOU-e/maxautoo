import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import BookingForm from '@/components/BookingForm';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import Image from 'next/image';

async function getCarDetails(id: string) {
  const car = await prisma.car.findUnique({
    where: { id },
  });

  if (!car) {
    notFound();
  }

  return car;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CarDetailsPage({
  params,
}: PageProps) {
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
          <div className="relative w-full h-[400px]">
            <Image
              src={car.image || '/placeholder-car.jpg'}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-cover rounded-lg shadow-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
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
            <BookingForm car={car} />
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
