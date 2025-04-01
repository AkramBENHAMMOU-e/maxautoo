'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Booking } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Type étendu pour les réservations avec les relations
type BookingWithRelations = Booking & {
  user: {
    id: string;
    email: string;
  };
  car: {
    id: string;
    brand: string;
    model: string;
    image?: string;
  };
};

// Fonction helper pour générer la classe CSS basée sur le statut
function getStatusClass(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'confirmed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

// Fonction helper pour traduire le statut en français
function translateStatus(status: string) {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'confirmed':
      return 'Confirmée';
    case 'completed':
      return 'Terminée';
    case 'cancelled':
      return 'Annulée';
    default:
      return status;
  }
}

interface BookingsListProps {
  bookings: BookingWithRelations[];
}

export function BookingsList({ bookings }: BookingsListProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  async function handleUpdateStatus(bookingId: string, newStatus: string) {
    setIsLoading(prev => ({ ...prev, [bookingId]: true }));
    
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }
      
      // Recharger la page après la mise à jour
      window.location.reload();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du statut de la réservation');
    } finally {
      setIsLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Aucune réservation trouvée</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Voiture</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                <Link href={`/admin/bookings/${booking.id}`} className="text-blue-600 hover:underline">
                  {booking.id.substring(0, 8)}...
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/admin/clients/${booking.userId}`} className="hover:underline">
                  {booking.user.email}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/admin/cars/${booking.carId}`} className="hover:underline">
                  {booking.car.brand} {booking.car.model}
                </Link>
              </TableCell>
              <TableCell>
                {format(new Date(booking.startDate), 'dd MMM', { locale: fr })} - {format(new Date(booking.endDate), 'dd MMM yyyy', { locale: fr })}
              </TableCell>
              <TableCell>{booking.totalPrice}€</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusClass(booking.status)}>
                  {translateStatus(booking.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={isLoading[booking.id]}>
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={() => handleUpdateStatus(booking.id, 'confirmed')}
                      disabled={booking.status === 'confirmed' || booking.status === 'completed'}
                    >
                      Confirmer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleUpdateStatus(booking.id, 'completed')}
                      disabled={booking.status === 'completed' || booking.status === 'cancelled'}
                    >
                      Marquer comme terminée
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleUpdateStatus(booking.id, 'cancelled')}
                      disabled={booking.status === 'cancelled' || booking.status === 'completed'}
                      className="text-red-600"
                    >
                      Annuler
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/bookings/${booking.id}`}>
                        Voir les détails
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 