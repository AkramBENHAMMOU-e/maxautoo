"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import { fr } from "date-fns/locale";

interface Car {
  id: string;
  brand: string;
  model: string;
  price: number;
  status: string;
}

interface BookingFormProps {
  car: Car;
}

export default function BookingForm({ car }: BookingFormProps) {
  const router = useRouter();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date?.from || !date?.to) {
      setError("Veuillez sélectionner les dates de location");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carId: car.id,
          startDate: date.from,
          endDate: date.to,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      // Rediriger vers la page des réservations
      router.push("/client/bookings");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculer le nombre de jours
  const days =
    date?.from && date?.to
      ? Math.ceil(
          (date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

  // Calculer le prix total
  const totalPrice = days * car.price;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dates de location
        </label>
        <Calendar
          mode="range"
          selected={date}
          onSelect={setDate}
          locale={fr}
          disabled={{ before: new Date() }}
          className="rounded-md border"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Prix par jour</span>
          <span>{car.price}€</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Nombre de jours</span>
          <span>{days}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span>{totalPrice}€</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !date?.from || !date?.to}
      >
        {isLoading ? "Réservation en cours..." : "Réserver maintenant"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        En cliquant sur Réserver, vous acceptez nos conditions générales de
        location.
      </p>
    </form>
  );
} 