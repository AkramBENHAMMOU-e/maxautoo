import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Mail, Phone, Clock, Users, Award, Shield, Smile } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">À Propos de MaxiAuto</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Votre partenaire de confiance pour la location de voitures dans tout le Maroc, alliant service personnalisé et véhicules de qualité pour tous vos déplacements.
          </p>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Notre Histoire</h2>
            <p className="text-gray-700 mb-6">
              Fondée en 2018 à Casablanca, MaxiAuto est née d'une vision entrepreneuriale marocaine : offrir un service de location de voitures moderne et fiable, adapté aux besoins des Marocains comme des visiteurs internationaux.
            </p>
            <p className="text-gray-700 mb-6">
              Ce qui a commencé comme une agence locale dans le centre de Casablanca s'est rapidement développé pour couvrir les principales villes touristiques et économiques du Royaume. Notre connaissance du terrain marocain et des spécificités locales nous a permis de bâtir une offre parfaitement adaptée.
            </p>
            <p className="text-gray-700">
              Aujourd'hui, MaxiAuto est fière de proposer une flotte diversifiée allant des citadines économiques aux SUV robustes pour explorer l'Atlas, ainsi qu'un service client réactif qui vous accompagne sur toutes les routes du Maroc.
            </p>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Hospitalité Marocaine</h3>
              <p className="text-gray-600">
                Nous accueillons chaque client avec la chaleur et l'hospitalité qui caractérisent le Maroc, en offrant un service attentif et personnalisé.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-600">
                Nous visons l'excellence dans toutes nos prestations, avec une flotte moderne et un service client réactif à chaque étape de votre expérience.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fiabilité</h3>
              <p className="text-gray-600">
                Sur les routes exigeantes du Maroc, nous garantissons des véhicules parfaitement entretenus pour assurer votre sécurité et votre tranquillité d'esprit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Équipe */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Notre Équipe</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-700 mb-8">
              L'équipe MaxiAuto est composée de professionnels marocains passionnés, connaissant parfaitement le territoire et les besoins spécifiques de nos clients. Nous parlons arabe, français, anglais et espagnol pour servir notre clientèle diversifiée.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Service Client</h3>
                <p className="text-gray-600">
                  Notre équipe de service client est disponible 7j/7 pour vous conseiller sur les meilleurs itinéraires au Maroc et vous assister pendant toute la durée de votre location.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Maintenance</h3>
                <p className="text-gray-600">
                  Nos techniciens qualifiés s'assurent que chaque véhicule est parfaitement préparé pour les différents terrains marocains, de la côte atlantique aux routes de montagne.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contactez-nous */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Contactez-nous</h2>
            <p className="text-gray-300 mb-8">
              Des questions sur nos services de location au Maroc ? Notre équipe multilingue est à votre disposition pour vous renseigner.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-10">
              <div className="flex items-start">
                <Mail className="h-6 w-6 mr-3 text-blue-400" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-300">contact@maxiauto.ma</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 mr-3 text-blue-400" />
                <div>
                  <h3 className="font-semibold mb-1">Téléphone</h3>
                  <p className="text-gray-300">+212 522 123 456</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 mr-3 text-blue-400" />
                <div>
                  <h3 className="font-semibold mb-1">Adresse</h3>
                  <p className="text-gray-300">27 Avenue Hassan II, Casablanca 20000, Maroc</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-6 w-6 mr-3 text-blue-400" />
                <div>
                  <h3 className="font-semibold mb-1">Heures d'ouverture</h3>
                  <p className="text-gray-300">Lun-Sam: 8h30-20h, Dim: 9h-17h</p>
                </div>
              </div>
            </div>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/client/contact">Nous Contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 