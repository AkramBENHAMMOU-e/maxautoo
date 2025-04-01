'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { differenceInDays, addDays } from 'date-fns';

interface Car {
  id: string;
  brand: string;
  model: string;
  price: number;
}

interface BookingFormProps {
  car: Car;
  userEmail: string | null | undefined;
}

export default function BookingForm({ car, userEmail }: BookingFormProps) {
  const router = useRouter();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validation des dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        throw new Error('La date de début doit être aujourd\'hui ou après');
      }

      if (end <= start) {
        throw new Error('La date de fin doit être après la date de début');
      }

      // Calcul du prix total
      const days = differenceInDays(end, start) + 1;
      const totalPrice = days * car.price;

      // Envoi de la réservation
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId: car.id,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      // Redirection vers la page des réservations
      router.push('/client/bookings');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcul du prix total estimé
  const calculateEstimatedPrice = () => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = differenceInDays(end, start) + 1;
    return days > 0 ? days * car.price : null;
  };

  const estimatedPrice = calculateEstimatedPrice();

  // Date minimum = aujourd'hui
  const minDate = new Date().toISOString().split('T')[0];
  // Date maximum = dans 6 mois
  const maxDate = addDays(new Date(), 180).toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Date de début
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          min={minDate}
          max={maxDate}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          Date de fin
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          min={startDate || minDate}
          max={maxDate}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {estimatedPrice !== null && (
        <div className="text-lg font-semibold">
          Prix total estimé : {estimatedPrice.toFixed(2)} €
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Réservation en cours...' : 'Réserver maintenant'}
      </button>
    </form>
  );
} 