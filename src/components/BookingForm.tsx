'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { differenceInDays, addDays } from 'date-fns';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { useSession } from 'next-auth/react';

interface Car {
  id: string;
  brand: string;
  model: string;
  price: number;
  image: string;
}

interface BookingFormProps {
  car: Car;
}

export default function BookingForm({ car }: BookingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Vérifier l'authentification de l'utilisateur
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Rediriger vers la page de connexion si non connecté
      router.push('/auth/login?callbackUrl=' + encodeURIComponent('/client/cars/' + car.id));
      toast({
        title: 'Connexion requise',
        description: 'Vous devez être connecté pour effectuer une réservation.',
        variant: 'destructive',
      });
    }
  }, [status, router, car.id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Vérifier que l'utilisateur est connecté
    if (status !== 'authenticated' || !session) {
      setIsLoading(false);
      setError('Vous devez être connecté pour effectuer une réservation.');
      toast({
        title: 'Connexion requise',
        description: 'Vous devez être connecté pour effectuer une réservation.',
        variant: 'destructive',
      });
      router.push('/auth/login?callbackUrl=' + encodeURIComponent('/client/cars/' + car.id));
      return;
    }

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
        // Si l'erreur est liée à l'authentification, rediriger vers la page de connexion
        if (response.status === 401) {
          toast({
            title: 'Session expirée',
            description: 'Votre session a expiré. Veuillez vous reconnecter.',
            variant: 'destructive',
          });
          router.push('/auth/login?callbackUrl=' + encodeURIComponent('/client/cars/' + car.id));
          return;
        }
        
        // Si l'erreur est liée à l'utilisateur manquant dans la base de données
        if (data.error === "Utilisateur non trouvé dans la base de données") {
          toast({
            title: 'Erreur de session',
            description: 'Problème avec votre compte. Veuillez vous déconnecter et vous reconnecter.',
            variant: 'destructive',
          });
          router.push('/auth/login?callbackUrl=' + encodeURIComponent('/client/cars/' + car.id));
          return;
        }
        
        throw new Error(data.error || 'Erreur lors de la création de la réservation');
      }

      // Afficher un toast de succès
      toast({
        title: 'Réservation réussie',
        description: 'Votre réservation a été créée avec succès.',
      });

      // Préparer et stocker les données pour la page de confirmation
      const startDateFormatted = start.toLocaleDateString('fr-FR');
      const endDateFormatted = end.toLocaleDateString('fr-FR');
      
      // Stocker les données dans sessionStorage
      sessionStorage.setItem('bookingData', JSON.stringify({
        carBrand: car.brand,
        carModel: car.model,
        startDate: startDateFormatted,
        endDate: endDateFormatted,
        totalPrice,
        bookingId: data.id
      }));

      // Rediriger vers la page de confirmation
      router.push('/client/booking/confirmation?success=true');
      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      
      // Message personnalisé pour l'erreur de période déjà réservée
      if (errorMessage.includes('déjà réservée pour cette période')) {
        setError('Cette voiture est déjà réservée pour la période sélectionnée. Veuillez choisir d\'autres dates.');
        toast({
          title: 'Période non disponible',
          description: 'Cette voiture n\'est pas disponible aux dates sélectionnées. Veuillez essayer d\'autres dates.',
          variant: 'destructive',
        });
      } else {
        setError(errorMessage);
        toast({
          title: 'Erreur',
          description: errorMessage,
          variant: 'destructive',
        });
      }
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

  // Ne pas afficher le formulaire si l'utilisateur n'est pas connecté
  if (status === 'unauthenticated') {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
        <p className="text-amber-800 font-medium">Vous devez être connecté pour effectuer une réservation.</p>
        <Button 
          onClick={() => router.push('/auth/login?callbackUrl=' + encodeURIComponent('/client/cars/' + car.id))}
          className="mt-2 bg-amber-600 hover:bg-amber-700"
        >
          Se connecter
        </Button>
      </div>
    );
  }

  // Afficher un spinner pendant le chargement de la session
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="startDate">Date de début</Label>
        <Input
          type="date"
          id="startDate"
          name="startDate"
          min={minDate}
          max={maxDate}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="endDate">Date de fin</Label>
        <Input
          type="date"
          id="endDate"
          name="endDate"
          min={startDate || minDate}
          max={maxDate}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="mt-1"
        />
      </div>

      {estimatedPrice !== null && (
        <div className="text-lg font-semibold">
          Prix total estimé : {estimatedPrice.toFixed(2)} DH
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Réservation en cours...' : 'Réserver maintenant'}
      </Button>
    </form>
  );
} 