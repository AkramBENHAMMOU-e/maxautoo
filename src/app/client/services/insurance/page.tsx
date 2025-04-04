import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle, AlertCircle } from "lucide-react";
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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Assurance Location au Maroc</h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100">
            Protégez votre location avec nos options d'assurance adaptées aux routes marocaines pour une tranquillité d'esprit totale.
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-8">
              <div className="bg-blue-100 p-4 rounded-full mr-6">
                <ShieldCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold">Une Protection Adaptée aux Routes Marocaines</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Chez MaxiAuto, nous comprenons les défis spécifiques de la conduite au Maroc, qu'il s'agisse des routes urbaines de Casablanca, des cols de l'Atlas ou des pistes du désert. 
              C'est pourquoi nous proposons plusieurs niveaux de couverture adaptés aux conditions locales et à votre budget.
            </p>
            <p className="text-gray-700 mb-6">
              Notre assurance tous risques couvre les dommages au véhicule, le vol, et offre une assistance routière dans tout le Royaume 
              pour vous garantir une tranquillité d'esprit totale pendant votre location.
            </p>
          </div>
        </div>
      </section>

      {/* Insurance Plans */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Nos Formules d'Assurance</h2>
          <div className="overflow-x-auto">
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Avantages de Nos Assurances</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Couverture Nationale</h3>
              <p className="text-gray-600">
                Notre assurance Premium offre une protection dans tout le Maroc, y compris les zones rurales et désertiques, avec assistance routière 24/7.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Franchise Réduite</h3>
              <p className="text-gray-600">
                Optez pour la formule Premium et bénéficiez d'une franchise considérablement réduite en cas de sinistre, même sur les routes difficiles.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Assistance Multilingue</h3>
              <p className="text-gray-600">
                Nos services d'assistance sont disponibles en arabe, français et anglais pour vous aider partout dans le Royaume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Questions Fréquentes</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">L'assurance couvre-t-elle les déplacements hors route ?</h3>
              <p className="text-gray-700">
                Notre formule Premium couvre les déplacements sur pistes, très courants au Maroc, à condition que le véhicule loué soit adapté à ce type de terrain (4x4, SUV). 
                Les formules Basique et Standard ne couvrent que les routes goudronnées.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Puis-je souscrire à l'assurance lors de la récupération du véhicule ?</h3>
              <p className="text-gray-700">
                Oui, vous pouvez souscrire à l'une de nos formules d'assurance au moment de la prise en charge du véhicule dans n'importe quelle agence MaxiAuto au Maroc. 
                Toutefois, nous recommandons de le faire lors de la réservation pour gagner du temps.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Que faire en cas de panne ou d'accident dans une zone reculée ?</h3>
              <p className="text-gray-700">
                En cas de problème, contactez notre service d'assistance au +212 522 123 456. Notre réseau couvre l'ensemble du territoire marocain, 
                y compris les zones éloignées. Avec la formule Premium, nous organisons le dépannage jusqu'à la ville la plus proche et votre transport.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à Explorer le Maroc en Toute Sécurité ?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Choisissez le véhicule adapté à votre itinéraire et ajoutez l'option d'assurance pour une expérience sans souci sur toutes les routes du Royaume.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/client/cars">Parcourir les Véhicules</Link>
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