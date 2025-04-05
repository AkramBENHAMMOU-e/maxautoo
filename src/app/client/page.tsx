import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarClock, Fuel, Car as CarIcon, Users, ChevronRight, Star, MapPin, CheckCheck, PhoneCall } from "lucide-react";
import prisma from "@/lib/prisma";
import { CarSlider } from "@/components/CarSlider";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

// Fonction pour récupérer les voitures en vedette
async function getFeaturedCars() {
  try {
    // Récupérer 3 voitures disponibles
    const cars = await prisma.car.findMany({
      where: {
        status: "available"
      },
      take: 3,
      orderBy: {
        createdAt: "desc" // Voitures les plus récentes
      }
    });
    
    return cars;
  } catch (error) {
    console.error("Erreur lors de la récupération des voitures en vedette:", error);
    return [];
  }
}

// Fonction pour récupérer toutes les voitures disponibles
async function getAvailableCars() {
  try {
    return await prisma.car.findMany({
      where: {
        status: "available"
      },
      orderBy: {
        price: 'desc'
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des voitures disponibles:", error);
    return [];
  }
}

export default async function ClientHomePage() {
  // Récupérer les voitures en vedette
  const featuredCars = await getFeaturedCars();
  // Récupérer toutes les voitures disponibles
  const availableCars = await getAvailableCars();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-10 md:py-16 lg:py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Location de voitures au <span className="text-blue-400">Maroc</span> sans tracas
              </h1>
              <p className="text-base md:text-lg text-blue-100 mb-6 md:mb-8 leading-relaxed max-w-xl">
                Des véhicules de qualité et un service client exceptionnel pour un voyage inoubliable à travers le Maroc. Prix transparents, sans frais cachés.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-8 md:mb-10">
                <Button asChild className="bg-white text-blue-800 hover:bg-blue-50 font-semibold py-2 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <Link href="/client/cars">
                    <CarIcon className="w-4 h-4 mr-2 inline" />
                    Voir nos véhicules
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 font-semibold py-2 rounded-full">
                  <Link href="/client/contact">
                    <PhoneCall className="w-4 h-4 mr-2 inline" />
                    Nous contacter
                  </Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-4 md:gap-8">
                <div className="flex items-center">
                  <div className="rounded-full bg-white/20 p-2 mr-3">
                    <CheckCheck className="w-4 h-4 md:w-5 md:h-5 text-blue-300" />
                  </div>
                  <span className="text-sm md:text-base">Sans frais cachés</span>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full bg-white/20 p-2 mr-3">
                    <CheckCheck className="w-4 h-4 md:w-5 md:h-5 text-blue-300" />
                  </div>
                  <span className="text-sm md:text-base">Assistance 24/7</span>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full bg-white/20 p-2 mr-3">
                    <CheckCheck className="w-4 h-4 md:w-5 md:h-5 text-blue-300" />
                  </div>
                  <span className="text-sm md:text-base">Annulation gratuite</span>
                </div>
              </div>
            </div>
            
            {/* Image statique remplaçant le carousel */}
            <div className="w-full h-full overflow-hidden rounded-2xl shadow-2xl">
              <div className="relative w-full h-full overflow-hidden rounded-xl aspect-video lg:aspect-[4/3]">
                <Image
                  src="/hero-car.jpg"
                  alt="Location de voitures de luxe au Maroc"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent h-1/3 p-4 lg:p-6 flex flex-col justify-end">
                  <h3 className="text-white text-base lg:text-xl font-bold">MERCEDES CLS</h3>
                  <p className="text-white/80 text-xs lg:text-sm mb-1">À partir de 600DH/jour</p>
                  <Button asChild className="mt-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-full shadow-lg text-xs lg:text-sm">
                    <Link href="/client/cars">
                      Réserver maintenant
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 md:mb-4">Comment ça marche</h2>
          <p className="text-sm md:text-base text-gray-600 text-center max-w-2xl mx-auto mb-8 md:mb-14">Location de voiture facile et rapide partout au Maroc en trois étapes simples</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <div className="flex flex-col items-center text-center group bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all">
              <div className="bg-blue-100 p-4 md:p-5 rounded-2xl mb-4 md:mb-5 transform group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300 relative">
                <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-sm w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold shadow-md">1</div>
                <CarIcon size={28} className="text-blue-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Choisissez votre voiture</h3>
              <p className="text-sm md:text-base text-gray-600">
                Parcourez notre flotte de véhicules adaptés à tous vos besoins, des citadines économiques aux 4x4.
              </p>
            </div>
            <div className="flex flex-col items-center text-center group bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all">
              <div className="bg-blue-100 p-4 md:p-5 rounded-2xl mb-4 md:mb-5 transform group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300 relative">
                <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-sm w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold shadow-md">2</div>
                <CalendarClock size={28} className="text-blue-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Réservez en ligne</h3>
              <p className="text-sm md:text-base text-gray-600">
                Sélectionnez vos dates, confirmez votre réservation et recevez une confirmation immédiate.
              </p>
            </div>
            <div className="flex flex-col items-center text-center group bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all">
              <div className="bg-blue-100 p-4 md:p-5 rounded-2xl mb-4 md:mb-5 transform group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300 relative">
                <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-sm w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold shadow-md">3</div>
                <MapPin size={28} className="text-blue-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Récupérez votre véhicule</h3>
              <p className="text-sm md:text-base text-gray-600">
                Récupérez votre voiture à notre agence ou profitez de notre service de livraison.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Notre flotte de véhicules</h2>
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-0">Découvrez nos modèles les plus populaires</p>
            </div>
            <Button asChild variant="outline" className="rounded-full hover:shadow-md transition-all duration-300">
              <Link href="/client/cars">
                <span className="flex items-center text-sm">
                  Voir tous les véhicules
                  <ChevronRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {featuredCars.length > 0 ? (
              featuredCars.map((car) => (
                <Card key={car.id} className="overflow-hidden border-0 rounded-xl hover:shadow-xl transition-all duration-300 group">
                  <div className="aspect-[16/9] relative">
                    <Image
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-blue-600 text-white text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full font-medium">
                      {car.type}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <CardContent className="p-4 md:p-6 relative -mt-10 bg-white rounded-t-3xl z-10">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg md:text-xl font-bold truncate pr-2">{car.brand} {car.model}</h3>
                      <div className="text-base md:text-lg font-bold text-blue-600 bg-blue-50 px-2 md:px-3 py-1 rounded-full">{car.price}DH<span className="text-xs md:text-sm font-normal text-gray-500">/j</span></div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-5 mt-3 md:mt-4 text-xs md:text-sm text-gray-600">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-1 md:p-1.5 rounded-full mr-1 md:mr-2">
                          <Users size={14} className="text-blue-600" />
                        </div>
                        {car.seats} Places
                      </div>
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-1 md:p-1.5 rounded-full mr-1 md:mr-2">
                          <CarIcon size={14} className="text-blue-600" />
                        </div>
                        {car.transmission && /^man/i.test(car.transmission) ? 'Manuelle' : 'Automatique'}
                      </div>
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-1 md:p-1.5 rounded-full mr-1 md:mr-2">
                          <Fuel size={14} className="text-blue-600" />
                        </div>
                        {car.year}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 md:p-6 pt-0 bg-white flex gap-4">
                    <Button asChild className="w-full rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-1.5 h-auto text-sm">
                      <Link href={`/client/cars/${car.id}`}>
                        <span className="flex items-center justify-center">
                          Voir les Détails
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </span>
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-12 border border-dashed border-gray-300 rounded-xl">
                <CarIcon size={32} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-base md:text-lg">Aucune voiture disponible pour le moment.</p>
                <p className="text-gray-400 text-sm mt-2">Veuillez vérifier ultérieurement</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJ3aGl0ZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMiIvPjwvZz48L3N2Zz4=')]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-white">Prêt à découvrir le Maroc ?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            De Casablanca à Marrakech, d'Agadir à Tanger, nos véhicules vous emmènent partout dans les meilleures conditions et au meilleur prix.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8 font-semibold transition-all duration-300 hover:shadow-lg">
              <Link href="/client/cars">
                <span className="flex items-center">
                  Réserver Maintenant
                  <ChevronRight className="ml-2 h-5 w-5" />
                </span>
              </Link>
            </Button>
            <Button asChild variant="default" size="lg" className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-6 transition-all duration-300 hover:shadow-lg">
              <Link href="/client/contact">
                <span className="flex items-center">
                  Nous Contacter
                  <ChevronRight className="ml-2 h-5 w-5" />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Destinations Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Nous desservons tout le Maroc</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nos agences sont présentes dans les principales villes touristiques et aéroports du Royaume
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <h3 className="font-bold text-xl mb-1">Casablanca</h3>
              <p className="text-gray-600 text-sm">Centre économique</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <h3 className="font-bold text-xl mb-1">Marrakech</h3>
              <p className="text-gray-600 text-sm">Ville impériale</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <h3 className="font-bold text-xl mb-1">Agadir</h3>
              <p className="text-gray-600 text-sm">Station balnéaire</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <h3 className="font-bold text-xl mb-1">Tanger</h3>
              <p className="text-gray-600 text-sm">Porte du détroit</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <h3 className="font-bold text-xl mb-1">Rabat</h3>
              <p className="text-gray-600 text-sm">Capitale administrative</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <h3 className="font-bold text-xl mb-1">Fès</h3>
              <p className="text-gray-600 text-sm">Ville médiévale</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <h3 className="font-bold text-xl mb-1">Essaouira</h3>
              <p className="text-gray-600 text-sm">Cité des Alizés</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
              <h3 className="font-bold text-xl mb-1">Ouarzazate</h3>
              <p className="text-gray-600 text-sm">Porte du désert</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
