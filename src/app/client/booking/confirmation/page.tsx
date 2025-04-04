"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface BookingData {
  carBrand: string;
  carModel: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  bookingId: string;
}

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    // Check URL parameters
    const successParam = searchParams.get("success");
    // Considérer comme succès sauf si explicitement "false"
    setSuccess(successParam !== "false");

    // Récupérer les données de réservation du sessionStorage
    const storedData = sessionStorage.getItem('bookingData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setBookingData(parsedData);
        setBookingId(parsedData.bookingId || `BK-${Math.floor(100000 + Math.random() * 900000).toString()}`);
      } catch (e) {
        console.error("Erreur lors de la récupération des données de réservation:", e);
        // Fallback si les données ne sont pas disponibles
        setBookingId(`BK-${Math.floor(100000 + Math.random() * 900000).toString()}`);
      }
    } else {
      // Fallback si aucune donnée n'est disponible
      setBookingId(`BK-${Math.floor(100000 + Math.random() * 900000).toString()}`);
    }
  }, [searchParams]);

  const handleWhatsAppClick = () => {
    if (!bookingData) return;
    
    // Préparer le message WhatsApp
    const message = encodeURIComponent(
      `Bonjour, je viens de réserver la voiture ${bookingData.carBrand} ${bookingData.carModel} du ${bookingData.startDate} au ${bookingData.endDate} pour un total de ${bookingData.totalPrice} DH. Référence: ${bookingId}`
    );
    
    // Numéro de l'agence
    const agencyNumber = "212600000000"; // À remplacer par votre numéro réel
    
    // Créer l'URL WhatsApp
    const whatsappUrl = `https://wa.me/${agencyNumber}?text=${message}`;
    
    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank');
  };

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
          Votre réservation a été traitée avec succès. Votre voiture sera prête à l'heure indiquée.
        </p>

        <Button 
          onClick={handleWhatsAppClick}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg w-full mb-6 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Contacter par WhatsApp maintenant
        </Button>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">Référence de Réservation</p>
            <p className="text-2xl font-bold text-blue-600">{bookingId}</p>
          </div>

          {bookingData && (
            <div className="text-left mb-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-medium mb-2">Détails de la réservation</h3>
              <p>Voiture: {bookingData.carBrand} {bookingData.carModel}</p>
              <p>Du: {bookingData.startDate}</p>
              <p>Au: {bookingData.endDate}</p>
              <p>Total: {bookingData.totalPrice} DH</p>
            </div>
          )}

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
              <h3 className="font-medium mb-2">Confirmation WhatsApp</h3>
              <p className="text-sm text-gray-600">
                Utilisez le bouton WhatsApp ci-dessous pour contacter directement notre agence.
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

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Chargement...</h1>
        <p className="mb-8">Traitement de votre réservation...</p>
      </div>
    }>
      <BookingConfirmationContent />
    </Suspense>
  );
}
