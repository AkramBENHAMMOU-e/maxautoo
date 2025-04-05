'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Edit, Trash, Eye, MessageSquare } from 'lucide-react';

interface Client {
  id: string;
  email: string;
}

interface ClientActionsProps {
  client: Client;
}

export default function ClientActions({ client }: ClientActionsProps) {
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

  const deleteClient = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.email} ? Cette action supprimera également toutes ses réservations.`)) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/clients/${client.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du client');
      }

      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression du client');
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
        aria-label="Options du client"
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
                href={`/admin/clients/${client.id}`}
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Eye className="h-4 w-4 mr-3 text-blue-500" />
                Voir le profil
              </Link>
              
              <Link
                href={`/admin/clients/${client.id}/edit`}
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Edit className="h-4 w-4 mr-3 text-amber-500" />
                Modifier
              </Link>
              
              <Link
                href={`/admin/bookings?search=${client.email}`}
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <MessageSquare className="h-4 w-4 mr-3 text-green-500" />
                Voir les réservations
              </Link>
              
              <button
                onClick={deleteClient}
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