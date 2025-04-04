import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane, Clock, MapPin, AlertCircle, Check, Car, BadgeCheck } from "lucide-react";

export default function AirportPage() {
  const airports = [
    {
      name: "Aéroport Mohammed V (Casablanca)",
      code: "CMN",
      hours: "24h/24, 7j/7",
      terminal: "Terminaux 1 et 2",
      meetingPoint: "Zone d'accueil MaxiAuto au niveau Arrivées"
    },
    {
      name: "Aéroport Marrakech Menara",
      code: "RAK",
      hours: "6h00 - 00h00",
      terminal: "Terminaux 1 et 2",
      meetingPoint: "Comptoir MaxiAuto au hall Arrivées"
    },
    {
      name: "Aéroport Agadir-Al Massira",
      code: "AGA",
      hours: "6h00 - 00h00",
      terminal: "Terminal principal",
      meetingPoint: "Comptoir Partenaire à la sortie des douanes"
    },
    {
      name: "Aéroport Rabat-Salé",
      code: "RBA",
      hours: "7h00 - 22h00",
      terminal: "Terminal unique",
      meetingPoint: "Agent avec panneau à la sortie"
    },
    {
      name: "Aéroport Tanger Ibn Battouta",
      code: "TNG",
      hours: "7h00 - 22h00",
      terminal: "Terminal principal",
      meetingPoint: "Comptoir MaxiAuto au hall Arrivées"
    },
    {
      name: "Aéroport Fès-Saïss",
      code: "FEZ",
      hours: "7h00 - 22h00",
      terminal: "Terminal principal",
      meetingPoint: "Agent avec panneau à la sortie"
    }
  ];

  const steps = [
    {
      title: "Réservation en avance",
      description: "Indiquez votre numéro de vol et l'heure d'arrivée lors de votre réservation en ligne."
    },
    {
      title: "Confirmation",
      description: "Recevez une confirmation par SMS avec les coordonnées de votre agent d'accueil."
    },
    {
      title: "Accueil personnalisé",
      description: "Notre agent vous accueille à l'aéroport avec un panneau à votre nom."
    },
    {
      title: "Prise en charge rapide",
      description: "Formalités simplifiées et remise des clés immédiate, sans attente aux comptoirs."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Service Aéroport au Maroc</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Commencez votre voyage dès votre atterrissage avec notre service de location de voiture en aéroport.
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-8">
              <div className="bg-blue-100 p-4 rounded-full mr-6">
                <Plane className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold">Location de Voiture aux Aéroports Marocains</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Chez MaxiAuto, nous savons que la qualité de votre séjour au Maroc commence dès votre arrivée à l'aéroport. 
              Notre service aéroportuaire premium est conçu pour faciliter votre transition de l'avion à la route, sans stress et sans attente.
            </p>
            <p className="text-gray-700 mb-6">
              Présents dans les principaux aéroports internationaux du Royaume, nos agents vous accueillent personnellement 
              et s'occupent de toutes les formalités pour que vous puissiez prendre la route rapidement vers votre destination.
            </p>
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Notre Service Aéroport</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pas d'Attente</h3>
              <p className="text-gray-600">
                Notre service d'accueil personnalisé vous évite les files d'attente aux comptoirs traditionnels. Votre véhicule est prêt dès votre arrivée.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Véhicule Sur Place</h3>
              <p className="text-gray-600">
                Votre voiture vous attend dans le parking de l'aéroport. Notre agent vous y accompagne directement après votre arrivée.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <BadgeCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Suivi de Vol</h3>
              <p className="text-gray-600">
                Nous surveillons l'état de votre vol pour nous adapter à tout retard ou arrivée anticipée, garantissant notre présence à votre arrivée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Comment Ça Marche</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Steps */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 transform -translate-x-1/2"></div>
              <div className="space-y-12">
                {steps.map((step, index) => (
                  <div key={index} className="relative flex items-start md:items-center flex-col md:flex-row">
                    <div className="flex items-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                      <div className="z-10 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                        {index + 1}
                      </div>
                    </div>
                    <div className={`mt-3 md:mt-0 md:w-5/12 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto'}`}>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Airports */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Nos Aéroports Desservis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {airports.map((airport, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold">{airport.name}</h3>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center">
                    <span className="font-medium w-32">Code IATA:</span>
                    <span>{airport.code}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32">Horaires:</span>
                    <span>{airport.hours}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32">Terminal:</span>
                    <span>{airport.terminal}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32">Point de rencontre:</span>
                    <span>{airport.meetingPoint}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Informations Importantes</h2>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
              <div className="flex">
                <AlertCircle className="h-6 w-6 text-amber-500 mr-3 shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800">Report de vol ou retard</h3>
                  <p className="text-amber-700">
                    En cas de retard ou de changement de votre vol, veuillez nous contacter dès que possible au +212 522 123 456 
                    afin que nous puissions adapter notre service à votre nouvel horaire d'arrivée.
                  </p>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Documents requis pour la prise en charge</h3>
            <ul className="space-y-2 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Passeport ou carte d'identité</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Permis de conduire (international pour certaines nationalités)</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Bon de réservation ou numéro de confirmation</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span>Carte de crédit au nom du conducteur principal</span>
              </li>
            </ul>
            <p className="text-gray-700">
              Notre service aéroport est disponible pour tous les types de véhicules de notre flotte, 
              de la citadine économique au SUV 4x4, en passant par nos modèles Premium et nos minibus.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Tarifs</h2>
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-6">
              <h3 className="text-2xl font-bold text-center">Service Aéroport Premium</h3>
            </div>
            <div className="p-6">
              <p className="text-center mb-6">
                Notre service d'accueil premium à l'aéroport est proposé au tarif fixe de:
              </p>
              <p className="text-4xl font-bold text-center text-blue-600 mb-6">200 DH</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Accueil personnalisé à votre arrivée</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Accompagnement jusqu'à votre véhicule</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>État des lieux et remise des clés rapides</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Suivi de votre vol</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Assistance en français, arabe et anglais</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                * Ce service est gratuit pour toute location Premium et pour les membres de notre programme de fidélité Gold et Platinum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Commencez Votre Aventure Marocaine Dès l'Aéroport</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Réservez notre service aéroport et profitez d'une prise en charge sans stress pour explorer le Maroc à votre rythme.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/client/cars">Réserver avec Service Aéroport</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-blue-700">
              <Link href="/client/contact">Questions ? Contactez-nous</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 