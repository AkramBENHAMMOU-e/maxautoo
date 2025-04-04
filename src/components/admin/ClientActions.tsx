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
                href={`/admin/clients/${client.id}`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Eye className="h-4 w-4 mr-3" />
                Voir le profil
              </Link>
              
              <Link
                href={`/admin/clients/${client.id}/edit`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="h-4 w-4 mr-3" />
                Modifier
              </Link>
              
              <Link
                href={`/admin/bookings?search=${client.email}`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <MessageSquare className="h-4 w-4 mr-3" />
                Voir les réservations
              </Link>
              
              <button
                onClick={deleteClient}
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