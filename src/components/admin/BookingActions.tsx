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
        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
        disabled={isLoading}
        aria-label="Options de réservation"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
      
      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={handleOutsideClick}
          ></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-100 overflow-hidden">
            <div className="py-1">
              <Link
                href={`/admin/bookings/${booking.id}`}
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Eye className="h-4 w-4 mr-3 text-blue-500" />
                Voir les détails
              </Link>
              
              <Link
                href={`/admin/bookings/${booking.id}/edit`}
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Edit className="h-4 w-4 mr-3 text-amber-500" />
                Modifier
              </Link>
              
              {booking.status === 'pending' && (
                <button
                  onClick={confirmBooking}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-green-700 hover:bg-gray-100"
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 mr-3 text-green-500" />
                  {isLoading ? 'En cours...' : 'Confirmer'}
                </button>
              )}
              
              {booking.status !== 'cancelled' && (
                <button
                  onClick={cancelBooking}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-red-700 hover:bg-gray-100"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-3 text-red-500" />
                  {isLoading ? 'En cours...' : 'Annuler'}
                </button>
              )}
              
              <button
                onClick={deleteBooking}
                className="flex items-center w-full px-4 py-2.5 text-sm text-red-700 hover:bg-gray-100 border-t border-gray-100"
                disabled={isLoading}
              >
                <Trash className="h-4 w-4 mr-3 text-red-500" />
                {isLoading ? 'En cours...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 