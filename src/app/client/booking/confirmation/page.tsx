"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    // Check URL parameters
    const successParam = searchParams.get("success");
    if (successParam === "true") {
      setSuccess(true);
    }

    // Generate a random booking ID for demo purposes
    // In a real app, this would come from the backend
    const randomId = Math.floor(100000 + Math.random() * 900000).toString();
    setBookingId(`BK-${randomId}`);
  }, [searchParams]);

  if (!success) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6 text-red-600">Échec de la Réservation</h1>
        <p className="mb-8 text-gray-600">
          Une erreur s'est produite lors du traitement de votre demande de réservation. Veuillez réessayer ou contacter le support client.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/client/cars">Parcourir les Voitures</Link>
          </Button>
          <Button asChild>
            <Link href="/client/contact">Contacter le Support</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600 h-8 w-8" />
        </div>

        <h1 className="text-3xl font-bold mb-2 text-gray-900">Réservation Confirmée !</h1>
        <p className="text-lg text-gray-600 mb-6">
          Votre réservation a été traitée avec succès. Consultez votre email pour plus de détails.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">Référence de Réservation</p>
            <p className="text-2xl font-bold text-blue-600">{bookingId}</p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Conservez cette référence pour :</p>
            <ul className="text-gray-700 space-y-1">
              <li>Vérifier l'état de votre réservation</li>
              <li>Modifier votre réservation</li>
              <li>Récupération rapide à notre agence</li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Que se passe-t-il ensuite ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="border border-gray-200 rounded p-4">
              <div className="font-bold text-xl mb-2 text-blue-600">1</div>
              <h3 className="font-medium mb-2">Email de Confirmation</h3>
              <p className="text-sm text-gray-600">
                Vous recevrez un email de confirmation détaillé avec toutes les informations de votre réservation.
              </p>
            </div>
            <div className="border border-gray-200 rounded p-4">
              <div className="font-bold text-xl mb-2 text-blue-600">2</div>
              <h3 className="font-medium mb-2">Préparation</h3>
              <p className="text-sm text-gray-600">
                Nous aurons votre voiture prête à l'heure et au lieu prévus.
              </p>
            </div>
            <div className="border border-gray-200 rounded p-4">
              <div className="font-bold text-xl mb-2 text-blue-600">3</div>
              <h3 className="font-medium mb-2">Récupération</h3>
              <p className="text-sm text-gray-600">
                Présentez simplement votre référence de réservation et votre pièce d'identité pour récupérer votre voiture.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/client/booking">Voir Mes Réservations</Link>
          </Button>
          <Button asChild>
            <Link href="/client">Retour à l'Accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
