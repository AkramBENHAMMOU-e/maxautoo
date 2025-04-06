import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function InsurancePage() {
  const insurancePlans = [
    {
      name: "Basique",
      price: 100,
      features: [
        { name: "Responsabilité civile", included: true },
        { name: "Protection contre le vol", included: false },
        { name: "Protection contre les dommages", included: false },
        { name: "Assistance routière", included: false },
        { name: "Franchise réduite", included: false },
      ],
    },
    {
      name: "Standard",
      price: 180,
      features: [
        { name: "Responsabilité civile", included: true },
        { name: "Protection contre le vol", included: true },
        { name: "Protection contre les dommages", included: true },
        { name: "Assistance routière", included: false },
        { name: "Franchise réduite", included: false },
      ],
    },
    {
      name: "Premium",
      price: 250,
      features: [
        { name: "Responsabilité civile", included: true },
        { name: "Protection contre le vol", included: true },
        { name: "Protection contre les dommages", included: true },
        { name: "Assistance routière", included: true },
        { name: "Franchise réduite", included: true },
      ],
    },
  ];

  // Alternative mobile-friendly display for small screens
  const renderMobileInsurancePlans = () => (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {insurancePlans.map((plan) => (
        <div key={plan.name} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
            <h3 className="font-bold text-lg">{plan.name}</h3>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{plan.price} DH/jour</span>
          </div>
          <ul className="space-y-2">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm">
                {feature.included ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-gray-300 mr-2 flex-shrink-0" />
                )}
                <span className={feature.included ? "text-gray-900" : "text-gray-500"}>
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-10 md:py-16 lg:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6">Assurance Location au Maroc</h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto text-blue-100">
            Protégez votre location avec nos options d'assurance adaptées aux routes marocaines pour une tranquillité d'esprit totale.
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start md:items-center flex-col md:flex-row md:mb-8 mb-4">
              <div className="bg-blue-100 p-3 md:p-4 rounded-full mb-4 md:mb-0 md:mr-6">
                <ShieldCheck className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              </div>
              <h2 className="text-xl md:text-3xl font-bold">Une Protection Adaptée aux Routes Marocaines</h2>
            </div>
            <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6">
              Chez MaxiAuto, nous comprenons les défis spécifiques de la conduite au Maroc, qu'il s'agisse des routes urbaines de Casablanca, des cols de l'Atlas ou des pistes du désert. 
              C'est pourquoi nous proposons plusieurs niveaux de couverture adaptés aux conditions locales et à votre budget.
            </p>
            <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6">
              Notre assurance tous risques couvre les dommages au véhicule, le vol, et offre une assistance routière dans tout le Royaume 
              pour vous garantir une tranquillité d'esprit totale pendant votre location.
            </p>
          </div>
        </div>
      </section>

      {/* Insurance Plans */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-12 text-center">Nos Formules d'Assurance</h2>
          
          {/* Mobile view for insurance plans */}
          {renderMobileInsurancePlans()}
          
          {/* Desktop view with table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableCaption>Tarifs par jour de location</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Formule</TableHead>
                  <TableHead>Responsabilité civile</TableHead>
                  <TableHead>Vol</TableHead>
                  <TableHead>Dommages</TableHead>
                  <TableHead>Assistance routière</TableHead>
                  <TableHead>Franchise réduite</TableHead>
                  <TableHead className="text-right">Prix/jour</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {insurancePlans.map((plan) => (
                  <TableRow key={plan.name}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    {plan.features.map((feature, index) => (
                      <TableCell key={index}>
                        {feature.included ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-300" />
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">{plan.price} DH</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-12 text-center">Avantages de Nos Assurances</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Couverture Nationale</h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-600">
                Notre assurance Premium offre une protection dans tout le Maroc, y compris les zones rurales et désertiques, avec assistance routière 24/7.
              </p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Franchise Réduite</h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-600">
                Optez pour la formule Premium et bénéficiez d'une franchise considérablement réduite en cas de sinistre, même sur les routes difficiles.
              </p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md sm:col-span-2 md:col-span-1 sm:max-w-xs sm:mx-auto md:max-w-none">
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Assistance Multilingue</h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-600">
                Nos services d'assistance sont disponibles en arabe, français et anglais pour vous aider partout dans le Royaume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-12 text-center">Questions Fréquentes</h2>
          <div className="max-w-3xl mx-auto space-y-5 md:space-y-8">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
              <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-3">L'assurance couvre-t-elle les déplacements hors route ?</h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-700">
                Notre formule Premium couvre les déplacements sur pistes, très courants au Maroc, à condition que le véhicule loué soit adapté à ce type de terrain (4x4, SUV). 
                Les formules Basique et Standard ne couvrent que les routes goudronnées.
              </p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
              <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-3">Puis-je souscrire à l'assurance lors de la récupération du véhicule ?</h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-700">
                Oui, vous pouvez souscrire à l'une de nos formules d'assurance au moment de la prise en charge du véhicule dans n'importe quelle agence MaxiAuto au Maroc. 
                Toutefois, nous recommandons de le faire lors de la réservation pour gagner du temps.
              </p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
              <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-3">Que faire en cas de panne ou d'accident dans une zone reculée ?</h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-700">
                En cas de problème, contactez notre service d'assistance au +212 522 123 456. Notre réseau couvre l'ensemble du territoire marocain, 
                y compris les zones éloignées. Avec la formule Premium, nous organisons le dépannage jusqu'à la ville la plus proche et votre transport.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 md:py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">Prêt à Explorer le Maroc en Toute Sécurité ?</h2>
          <p className="text-xs md:text-lg text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Choisissez le véhicule adapté à votre itinéraire et ajoutez l'option d'assurance pour une expérience sans souci sur toutes les routes du Royaume.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-sm md:text-base py-2 h-auto rounded-full">
              <Link href="/client/cars">
                <span className="flex items-center justify-center">
                  Parcourir les Véhicules
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