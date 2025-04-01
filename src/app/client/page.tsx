import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarClock, Fuel, Car as CarIcon, Users, ChevronRight, Star, MapPin } from "lucide-react";
import prisma from "@/lib/prisma";

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

// Fonction pour récupérer une voiture premium pour le hero
async function getHeroCar() {
  try {
    // Récupérer une voiture de type luxury si disponible
    const luxuryCar = await prisma.car.findFirst({
      where: {
        status: "available",
        type: "luxury",
      },
    });
    
    // Si pas de voiture de luxe, prendre une autre voiture disponible
    if (!luxuryCar) {
      return await prisma.car.findFirst({
        where: {
          status: "available"
        }
      });
    }
    
    return luxuryCar;
  } catch (error) {
    console.error("Erreur lors de la récupération de la voiture hero:", error);
    return null;
  }
}

export default async function ClientHomePage() {
  // Récupérer les voitures en vedette
  const featuredCars = await getFeaturedCars();
  // Récupérer la voiture pour le hero
  const heroCar = await getHeroCar();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-24 md:py-32 overflow-hidden">
        {/* Formes décoratives */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-10 translate-x-1/4 translate-y-1/4"></div>
        
        <div className="container mx-auto px-4 z-10 relative flex flex-col md:flex-row md:items-center">
          <div className="max-w-2xl md:w-1/2 z-20">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Louez votre <span className="text-white">Voiture</span><br />
              <span className="text-blue-200">au Maroc</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 leading-relaxed max-w-xl">
              Location de voitures aux meilleurs prix dans tout le Royaume. Des véhicules adaptés pour vos déplacements professionnels ou vos voyages à travers les villes marocaines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-full px-8 transition-all duration-300 hover:shadow-lg">
                <Link href="/client/cars">
                  <span className="flex items-center">
                    Parcourir les Voitures
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </span>
                </Link>
              </Button>
              <Button asChild variant="default" size="lg" className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-6 transition-all duration-300 hover:shadow-lg">
                <Link href="/client/booking">Vérifier la Réservation</Link>
              </Button>
            </div>
            
            {heroCar && (
              <div className="bg-blue-700/80 rounded-xl shadow-lg border border-blue-400/20 backdrop-blur-md p-4 transform hover:translate-y-[-4px] transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-white" fill="white" />
                  <div className="text-sm font-medium text-blue-100">Découvrez notre véhicule premium :</div>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl md:text-3xl font-bold text-white lowercase">
                    {heroCar.brand} {heroCar.model}
                  </h3>
                  <div className="text-xl font-bold text-white bg-blue-600 px-4 py-1 rounded-full">
                    {heroCar.price}DH<span className="text-sm font-normal">/jour</span>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm" className="mt-3 w-full text-white hover:bg-blue-600/50 flex justify-center items-center group">
                  <Link href={`/client/cars/${heroCar.id}`}>
                    <span className="flex items-center">
                      Voir cette voiture
                      <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
          
          <div className="md:w-1/2 md:absolute md:right-0 md:top-1/2 md:transform md:-translate-y-1/2 mt-8 md:mt-0 z-10">
            {heroCar && (
              <div className="relative w-full h-[300px] md:h-[450px]">
                <Image
                  src={heroCar.image}
                  alt={`${heroCar.brand} ${heroCar.model}`}
                  fill
                  className="object-contain z-10 drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-transparent to-transparent z-0 md:hidden"></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Comment ça marche</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-14">Location de voiture facile et rapide partout au Maroc en trois étapes simples</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center group">
              <div className="bg-blue-100 p-5 rounded-2xl mb-5 transform group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300 relative">
                <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-sm w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">1</div>
                <CarIcon size={34} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Choisissez votre voiture</h3>
              <p className="text-gray-600">
                Parcourez notre flotte de véhicules adaptés à tous vos besoins, des citadines économiques aux 4x4 pour l'Atlas.
              </p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="bg-blue-100 p-5 rounded-2xl mb-5 transform group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300 relative">
                <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-sm w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">2</div>
                <CalendarClock size={34} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Réservez en ligne</h3>
              <p className="text-gray-600">
                Sélectionnez vos dates, confirmez votre réservation et recevez une confirmation immédiate. Sans avance.
              </p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="bg-blue-100 p-5 rounded-2xl mb-5 transform group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300 relative">
                <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-sm w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">3</div>
                <MapPin size={34} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Récupérez votre véhicule</h3>
              <p className="text-gray-600">
                Récupérez votre voiture à notre agence ou profitez de notre service de livraison à l'aéroport ou à votre hôtel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Notre flotte de véhicules</h2>
              <p className="text-gray-600">Découvrez nos modèles les plus populaires pour explorer le Maroc</p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0 rounded-full hover:shadow-md transition-all duration-300">
              <Link href="/client/cars">
                <span className="flex items-center">
                  Voir tous les véhicules
                  <ChevronRight className="ml-2 h-5 w-5" />
                </span>
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.length > 0 ? (
              featuredCars.map((car) => (
                <Card key={car.id} className="overflow-hidden border-0 rounded-xl hover:shadow-xl transition-all duration-300 group">
                  <div className="aspect-[16/9] relative">
                  <Image
                    src={car.image}
                      alt={`${car.brand} ${car.model}`}
                    fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                      {car.type}
                  </div>
                    <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <CardContent className="p-6 relative -mt-10 bg-white rounded-t-3xl z-10">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold">{car.brand} {car.model}</h3>
                      <div className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{car.price}DH<span className="text-sm font-normal text-gray-500">/jour</span></div>
                    </div>
                    <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                          <Users size={16} className="text-blue-600" />
                        </div>
                        {car.seats} Places
                    </div>
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                          <CarIcon size={16} className="text-blue-600" />
                        </div>
                      {car.transmission}
                    </div>
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                          <Fuel size={16} className="text-blue-600" />
                        </div>
                        {car.year}
                      </div>
                  </div>
                </CardContent>
                  <CardFooter className="p-6 pt-0 bg-white flex gap-4">
                    <Button asChild className="w-full rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300">
                      <Link href={`/client/cars/${car.id}`}>
                        <span className="flex items-center justify-center">
                          Voir les Détails
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </span>
                      </Link>
                  </Button>
                </CardFooter>
              </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 border border-dashed border-gray-300 rounded-xl">
                <CarIcon size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Aucune voiture disponible pour le moment.</p>
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
