'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Check, X, Edit, Trash, Eye } from 'lucide-react';

interface Booking {
  id: string;
  status: string;
  carId: string;
}

interface BookingActionsProps {
  booking: Booking;
}

export default function BookingActions({ booking }: BookingActionsProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOutsideClick = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  const confirmBooking = async () => {
    if (booking.status !== 'pending') return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'confirmed' }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la confirmation de la réservation');
      }

      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la confirmation de la réservation');
    } finally {
      setIsLoading(false);
      setIsDropdownOpen(false);
    }
  };

  const cancelBooking = async () => {
    if (booking.status === 'cancelled') return;
    
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation de la réservation');
      }

      // Mise à jour de la disponibilité de la voiture
      await fetch(`/api/admin/cars/${booking.carId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'available' }),
      });

      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'annulation de la réservation');
    } finally {
      setIsLoading(false);
      setIsDropdownOpen(false);
    }
  };

  const deleteBooking = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cette réservation ?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la réservation');
      }

      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de la réservation');
    } finally {
      setIsLoading(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="text-gray-400 hover:text-gray-600"
        disabled={isLoading}
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
      
      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={handleOutsideClick}
          ></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
            <div className="py-1">
              <Link
                href={`/admin/bookings/${booking.id}`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Eye className="h-4 w-4 mr-3" />
                Voir les détails
              </Link>
              
              <Link
                href={`/admin/bookings/${booking.id}/edit`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="h-4 w-4 mr-3" />
                Modifier
              </Link>
              
              {booking.status === 'pending' && (
                <button
                  onClick={confirmBooking}
                  className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                >
                  <Check className="h-4 w-4 mr-3" />
                  Confirmer
                </button>
              )}
              
              {booking.status !== 'cancelled' && (
                <button
                  onClick={cancelBooking}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                >
                  <X className="h-4 w-4 mr-3" />
                  Annuler
                </button>
              )}
              
              <button
                onClick={deleteBooking}
                className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
              >
                <Trash className="h-4 w-4 mr-3" />
                Supprimer
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 