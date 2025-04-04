import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, Plane, Briefcase, Users, Car, Clock, Key } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      id: "insurance",
      title: "Assurance",
      description: "Protégez votre location avec nos options d'assurance complètes.",
      icon: ShieldCheck,
      details: "Nous proposons plusieurs niveaux de couverture pour assurer votre tranquillité. Notre assurance tous risques couvre les dommages au véhicule, le vol, et offre une assistance routière 24/7."
    },
    {
      id: "delivery",
      title: "Livraison",
      description: "Livraison et récupération de votre véhicule à l'adresse de votre choix.",
      icon: Truck,
      details: "Service disponible dans un rayon de 50km autour de nos agences. Réservez à l'avance pour garantir la disponibilité."
    },
    {
      id: "airport",
      title: "Service Aéroport",
      description: "Prise en charge et retour de votre véhicule directement à l'aéroport.",
      icon: Plane,
      details: "Notre équipe vous accueille dès votre arrivée. Service disponible 7j/7 aux principaux aéroports."
    },
    {
      id: "corporate",
      title: "Location Entreprise",
      description: "Solutions de mobilité adaptées aux besoins professionnels.",
      icon: Briefcase,
      details: "Tarifs préférentiels et gestion de flotte pour les entreprises. Contrats flexibles adaptés à vos besoins spécifiques."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Nos Services</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Découvrez l'ensemble des services que nous proposons pour rendre votre expérience de location aussi pratique et agréable que possible.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {services.map((service) => (
              <div key={service.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                    <service.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">{service.title}</h2>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <p className="text-gray-700 mb-6">{service.details}</p>
                  <Button asChild>
                    <Link href={`/client/services/${service.id}`}>En savoir plus</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Engagement */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Notre Engagement</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Véhicules Récents</h3>
              <p className="text-gray-600">
                Notre flotte est régulièrement renouvelée pour vous offrir des véhicules modernes, confortables et fiables.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Service Rapide</h3>
              <p className="text-gray-600">
                Nos procédures de prise en charge et de retour sont optimisées pour vous faire gagner du temps.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Assistance 24/7</h3>
              <p className="text-gray-600">
                Notre équipe est disponible à tout moment pour vous aider en cas de besoin pendant votre location.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à réserver ?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Explorez notre sélection de véhicules et choisissez l'option qui correspond le mieux à vos besoins.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/client/cars">Voir les Véhicules</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-blue-700">
              <Link href="/client/contact">Nous Contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 