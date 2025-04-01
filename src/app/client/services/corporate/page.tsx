import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Users, ClipboardCheck, BadgePercent, Calculator, MessageSquare } from "lucide-react";

export default function CorporatePage() {
  const benefits = [
    {
      icon: <Building2 className="h-10 w-10 text-blue-600" />,
      title: "Flotte variée",
      description: "Accédez à notre vaste gamme de véhicules adaptés à tous vos besoins professionnels, des berlines aux 4x4 en passant par les utilitaires."
    },
    {
      icon: <Users className="h-10 w-10 text-blue-600" />,
      title: "Gestion simplifiée",
      description: "Un portail dédié et un responsable de compte unique pour gérer toutes vos réservations et suivre vos dépenses en temps réel."
    },
    {
      icon: <ClipboardCheck className="h-10 w-10 text-blue-600" />,
      title: "Facturation centralisée",
      description: "Recevez une facture mensuelle détaillée et personnalisée selon les exigences de votre entreprise, avec possibilité de ventilation par service."
    },
    {
      icon: <BadgePercent className="h-10 w-10 text-blue-600" />,
      title: "Tarifs préférentiels",
      description: "Bénéficiez de remises exclusives basées sur le volume de réservations et la durée des contrats de partenariat."
    }
  ];

  const plans = [
    {
      name: "Flex Business",
      price: "À partir de 350 DH/jour",
      features: [
        "Flotte Standard",
        "Kilométrage limité",
        "Facturation mensuelle",
        "Remise volume de 5%",
        "1 conducteur supplémentaire gratuit"
      ],
      description: "Idéal pour les PME avec des besoins occasionnels"
    },
    {
      name: "Premium Corporate",
      price: "À partir de 450 DH/jour",
      features: [
        "Flotte Premium",
        "Kilométrage illimité",
        "Système de réservation dédié",
        "Remise volume de 15%",
        "Conducteurs illimités",
        "Service prioritaire"
      ],
      description: "Solution complète pour les entreprises ayant des besoins réguliers"
    },
    {
      name: "Contrat Longue Durée",
      price: "Devis personnalisé",
      features: [
        "Véhicules personnalisables",
        "Tarifs fixes garantis",
        "Gestion de parc complète",
        "Assurance tous risques incluse",
        "Entretien et maintenance inclus",
        "Véhicule de remplacement garanti"
      ],
      description: "Pour les entreprises souhaitant externaliser leur flotte automobile"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Solutions Entreprises au Maroc</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Des offres de mobilité sur mesure pour répondre aux besoins spécifiques de votre entreprise au Maroc.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Votre Partenaire Mobilité Professionnel</h2>
            <p className="text-gray-700 mb-6">
              Chez MaxiAuto, nous comprenons les défis de mobilité auxquels font face les entreprises marocaines. 
              Notre programme entreprise offre des solutions adaptées pour optimiser vos déplacements professionnels, 
              qu'il s'agisse de courts trajets urbains à Casablanca ou de missions longue durée à travers le Royaume.
            </p>
            <p className="text-gray-700">
              De la startup innovante à la multinationale, nous proposons des offres flexibles qui s'adaptent 
              à la taille de votre structure et à l'évolution de vos besoins.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Les Avantages pour Votre Entreprise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="mb-4 flex justify-center">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Nos Formules Entreprises</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6 border-b">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-blue-600 font-semibold mb-3">{plan.price}</p>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Secteurs d'Activité</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-gray-700 mb-10">
              Nous travaillons avec des entreprises de tous secteurs pour répondre à leurs besoins spécifiques en matière de mobilité.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-lg bg-white shadow-sm">
                <h3 className="font-semibold mb-1">Tourisme</h3>
                <p className="text-sm text-gray-600">Services dédiés pour les agences de voyage et hôtels</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm">
                <h3 className="font-semibold mb-1">BTP</h3>
                <p className="text-sm text-gray-600">Véhicules utilitaires et 4x4 pour chantiers</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm">
                <h3 className="font-semibold mb-1">Banque & Finance</h3>
                <p className="text-sm text-gray-600">Berlines et véhicules de direction</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm">
                <h3 className="font-semibold mb-1">Santé</h3>
                <p className="text-sm text-gray-600">Solutions adaptées pour personnel médical</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm">
                <h3 className="font-semibold mb-1">Agriculture</h3>
                <p className="text-sm text-gray-600">4x4 et véhicules adaptés aux zones rurales</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm">
                <h3 className="font-semibold mb-1">IT & Télécoms</h3>
                <p className="text-sm text-gray-600">Flotte urbaine et véhicules écologiques</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Ce que disent nos clients entreprises</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 italic mb-4">
                "MaxiAuto nous a permis d'optimiser significativement notre budget mobilité grâce à une gestion centralisée et des tarifs adaptés. Le service client est toujours réactif pour nos besoins urgents."
              </p>
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">SM</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">Samir Mezouar</p>
                  <p className="text-sm text-gray-600">Directeur Administratif, Atlas Consulting</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 italic mb-4">
                "En tant qu'entreprise opérant dans plusieurs villes marocaines, nous avions besoin d'un partenaire fiable. MaxiAuto nous offre cette flexibilité avec un service constant partout au Maroc."
              </p>
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">LB</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">Leila Benkirane</p>
                  <p className="text-sm text-gray-600">Responsable Logistique, Maroc Telecom</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Discutons de vos besoins spécifiques</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Nos experts sont à votre disposition pour élaborer une solution sur mesure adaptée aux besoins de mobilité de votre entreprise au Maroc.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/client/contact">Demander un devis</Link>
            </Button>
            <Button asChild  size="lg" className="bg-blue-700 text-white hover:bg-blue-800">
              <a href="tel:+212522123456">+212 522 123 456</a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Questions Fréquentes</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                À partir de combien de réservations puis-je bénéficier d'un contrat entreprise ?
              </h3>
              <p className="text-gray-700">
                Nos contrats entreprises sont disponibles à partir de 5 réservations par mois ou 20 jours de location mensuelle cumulée. 
                Toutefois, nous étudions chaque demande au cas par cas pour vous proposer la solution la plus adaptée.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                Proposez-vous des services spécifiques pour les déplacements professionnels à l'international ?
              </h3>
              <p className="text-gray-700">
                Oui, nous proposons des services spécifiques pour les entreprises accueillant des collaborateurs ou clients internationaux au Maroc. 
                Nous offrons un accueil personnalisé dans les principaux aéroports marocains et une documentation disponible en plusieurs langues.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                Comment fonctionne la facturation pour les entreprises ?
              </h3>
              <p className="text-gray-700">
                Nous proposons une facturation mensuelle consolidée et personnalisable selon vos besoins (par département, par projet, etc.). 
                Toutes nos factures sont conformes à la réglementation marocaine et peuvent être intégrées facilement dans votre comptabilité.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 