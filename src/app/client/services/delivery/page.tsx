import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, Clock, Check, ChevronRight } from "lucide-react";

export default function DeliveryPage() {
  const locations = [
    "Casablanca et région",
    "Rabat-Salé",
    "Marrakech",
    "Tanger",
    "Agadir",
    "Fès",
    "Meknès",
    "Essaouira"
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-10 md:py-16 lg:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6">Service de Livraison au Maroc</h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto text-blue-100">
            Recevez votre véhicule de location directement à l'adresse de votre choix, pour un confort et une praticité maximale partout au Maroc.
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start md:items-center flex-col md:flex-row md:mb-8 mb-4">
              <div className="bg-blue-100 p-3 md:p-4 rounded-full mb-4 md:mb-0 md:mr-6">
                <Truck className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              </div>
              <h2 className="text-xl md:text-3xl font-bold">La Livraison à Votre Porte</h2>
            </div>
            <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6">
              Notre service de livraison est conçu pour vous faire gagner du temps et vous éviter les déplacements inutiles. 
              Que vous soyez à votre domicile, à l'hôtel, à votre riad ou en déplacement professionnel, nous livrons votre véhicule à l'adresse et à l'heure qui vous conviennent.
            </p>
            <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6">
              Ce service premium est disponible dans un rayon de 30 km autour de nos agences principales, 
              couvrant les grandes villes marocaines et leurs périphéries.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-12 text-center">Comment Ça Marche</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <span className="text-lg md:text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Réservation</h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-600">
                  Lors de votre réservation en ligne ou par téléphone, sélectionnez l'option "Livraison" et indiquez l'adresse souhaitée.
                </p>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <span className="text-lg md:text-xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Confirmation</h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-600">
                  Notre équipe vous contacte pour confirmer les détails de la livraison et coordonner l'heure exacte.
                </p>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center sm:col-span-2 md:col-span-1 sm:max-w-xs sm:mx-auto md:max-w-none">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <span className="text-lg md:text-xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Livraison</h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-600">
                  Notre chauffeur vous livre le véhicule à l'adresse indiquée, effectue avec vous l'état des lieux et vous remet les clés.
                </p>
              </div>
            </div>

            <div className="mt-6 md:mt-12 bg-white p-4 md:p-6 rounded-lg shadow-md">
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Retour du Véhicule</h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-700 mb-2 md:mb-4">
                Pour encore plus de confort, vous pouvez également opter pour la récupération du véhicule à la fin de votre location. 
                Notre chauffeur viendra chercher le véhicule à l'adresse de votre choix dans notre zone de service.
              </p>
              <p className="text-xs md:text-sm lg:text-base text-gray-700">
                Ce service est disponible pour toute location d'une durée minimum de 2 jours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Zones de Service */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-12 text-center">Zones de Service</h2>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="md:w-1/2">
                <div className="flex items-center mb-3 md:mb-6">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-blue-600 mr-2 md:mr-3" />
                  <h3 className="text-lg md:text-xl font-semibold">Nos Zones de Livraison</h3>
                </div>
                <p className="text-xs md:text-sm lg:text-base text-gray-700 mb-3 md:mb-6">
                  Notre service de livraison est actuellement disponible dans les zones suivantes, avec un rayon de 30 km autour de nos agences principales :
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-sm md:text-base">
                  {locations.map((location, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-1 md:mr-2 shrink-0 mt-0.5" />
                      <span>{location}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="flex items-center mb-3 md:mb-6">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-blue-600 mr-2 md:mr-3" />
                  <h3 className="text-lg md:text-xl font-semibold">Horaires de Livraison</h3>
                </div>
                <p className="text-xs md:text-sm lg:text-base text-gray-700 mb-3 md:mb-6">
                  Nos services de livraison et de récupération sont disponibles :
                </p>
                <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-1 md:mr-2 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Lundi au Vendredi :</span>
                      <span className="block text-gray-600 text-xs md:text-sm">8h00 - 20h00</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-1 md:mr-2 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Samedi :</span>
                      <span className="block text-gray-600 text-xs md:text-sm">9h00 - 18h00</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-1 md:mr-2 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Dimanche :</span>
                      <span className="block text-gray-600 text-xs md:text-sm">10h00 - 16h00 (avec supplément)</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-12 text-center">Tarification</h2>
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-3 md:p-6">
              <h3 className="text-lg md:text-2xl font-bold text-center">Frais de Livraison</h3>
            </div>
            <div className="p-4 md:p-6">
              <div className="space-y-3 md:space-y-4 text-sm md:text-base">
                <div className="flex justify-between items-center pb-2 md:pb-4 border-b">
                  <span className="font-medium">Distance jusqu'à 10 km</span>
                  <span className="font-bold">150 DH</span>
                </div>
                <div className="flex justify-between items-center pb-2 md:pb-4 border-b">
                  <span className="font-medium">Distance de 10 à 20 km</span>
                  <span className="font-bold">250 DH</span>
                </div>
                <div className="flex justify-between items-center pb-2 md:pb-4 border-b">
                  <span className="font-medium">Distance de 20 à 30 km</span>
                  <span className="font-bold">400 DH</span>
                </div>
                <div className="flex justify-between items-center pb-2 md:pb-4 border-b">
                  <span className="font-medium">Supplément dimanche</span>
                  <span className="font-bold">+100 DH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Service de récupération</span>
                  <span className="font-bold">Mêmes tarifs</span>
                </div>
              </div>
              <div className="mt-4 md:mt-6 text-xs md:text-sm text-gray-600">
                <p>* Les tarifs sont indiqués par trajet. Pour une livraison ET une récupération, les frais s'appliquent pour chaque service.</p>
                <p className="mt-1 md:mt-2">* Pour les locations de plus de 7 jours, profitez d'une réduction de 50% sur les frais de livraison et de récupération.</p>
                <p className="mt-1 md:mt-2">* Les livraisons vers certaines zones touristiques (médinas, riads difficiles d'accès) peuvent occasionner des frais supplémentaires.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 md:py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">Réservez avec Livraison</h2>
          <p className="text-xs md:text-lg text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Simplifiez votre expérience de location et explorez le Maroc en toute liberté avec notre service de livraison premium.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-sm md:text-base py-2 h-auto rounded-full">
              <Link href="/client/cars">
                <span className="flex items-center justify-center">
                  Réserver Maintenant
                  <ChevronRight className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
                </span>
              </Link>
            </Button>
            <Button asChild  size="lg" className="border-white text-white bg-blue-700 text-sm md:text-base py-2 h-auto rounded-full">
              <Link href="/client/contact">
                <span className="flex items-center justify-center">
                  Questions ? Contactez-nous
                  <ChevronRight className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 