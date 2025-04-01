"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarRange, Car as CarIcon, Euro, CheckCircle2, XCircle } from "lucide-react";

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  car: {
    id: string;
    brand: string;
    model: string;
    image: string;
    price: number;
  };
}

interface AlertMessage {
  type: "success" | "error";
  text: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "confirmed":
      return "bg-green-500 hover:bg-green-600";
    case "cancelled":
      return "bg-red-500 hover:bg-red-600";
    case "completed":
      return "bg-blue-500 hover:bg-blue-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "En attente";
    case "confirmed":
      return "Confirmée";
    case "cancelled":
      return "Annulée";
    case "completed":
      return "Terminée";
    default:
      return status;
  }
};

export default function ClientBookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState<AlertMessage | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/bookings", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.status === 401) {
          router.push("/auth/login?callbackUrl=/client/booking");
          return;
        }

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des réservations");
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Erreur:", error);
        setError("Impossible de charger les réservations. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  // Effacer l'alerte après 3 secondes
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'annulation de la réservation");
      }

      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: "cancelled" }
          : booking
      ));

      setAlert({
        type: "success",
        text: "La réservation a été annulée avec succès"
      });
    } catch (error) {
      console.error("Erreur:", error);
      setAlert({
        type: "error",
        text: "Impossible d'annuler la réservation. Veuillez réessayer plus tard."
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mes Réservations</h1>
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mes Réservations</h1>

      {alert && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          alert.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {alert.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          {alert.text}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {bookings.length === 0 && !error ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Vous n'avez pas encore de réservations.</p>
          <Button asChild variant="default">
            <Link href="/client/cars">Parcourir les voitures disponibles</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={booking.car.image || '/placeholder-car.jpg'}
                  alt={`${booking.car.brand} ${booking.car.model}`}
                  fill
                  className="object-cover"
                />
                <Badge 
                  className={`absolute top-2 right-2 ${getStatusColor(booking.status)}`}
                >
                  {getStatusText(booking.status)}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  {booking.car.brand} {booking.car.model}
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarRange className="h-5 w-5 text-primary" />
                    <span>
                      Du {format(new Date(booking.startDate), 'dd MMMM yyyy', { locale: fr })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarRange className="h-5 w-5 text-primary" />
                    <span>
                      Au {format(new Date(booking.endDate), 'dd MMMM yyyy', { locale: fr })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CarIcon className="h-5 w-5 text-primary" />
                    <span>{booking.car.price}€ / jour</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-lg">
                    <Euro className="h-5 w-5 text-primary" />
                    <span>Total: {booking.totalPrice}€</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                {booking.status === "pending" && (
                  <Button 
                    variant="destructive" 
                    onClick={() => handleCancelBooking(booking.id)}
                    className="w-full"
                  >
                    Annuler la réservation
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 