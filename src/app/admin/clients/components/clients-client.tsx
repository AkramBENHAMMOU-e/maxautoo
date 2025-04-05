"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, UserPlus, Download, RefreshCw, Mail, Calendar, BookOpen, Clock, ChevronDown } from 'lucide-react';
import ClientActions from '@/components/admin/ClientActions';
import { format } from 'date-fns';
import { useState } from 'react';

interface Client {
  id: string;
  email: string;
  createdAt: Date;
  _count: {
    bookings: number;
  };
  bookings: Array<{
    createdAt: Date;
  }>;
}

interface Stats {
  totalClients: number;
  totalBookings: number;
  avgBookingsPerClient: string;
}

interface ClientsClientProps {
  clients: Client[];
  stats: Stats;
  searchQuery: string;
  currentSort: string;
}

export function ClientsClient({ clients, stats, searchQuery, currentSort }: ClientsClientProps) {
  const router = useRouter();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleExport = () => {
    const headers = ['ID', 'Email', 'Date d\'inscription', 'Nombre de réservations', 'Dernière réservation'];
    
    const rows = clients.map((client) => [
      client.id,
      client.email,
      format(new Date(client.createdAt), 'dd/MM/yyyy'),
      client._count.bookings,
      client.bookings[0] 
        ? format(new Date(client.bookings[0].createdAt), 'dd/MM/yyyy') 
        : 'Jamais',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSortChange = (sort: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort', sort);
    router.push(url.toString());
  };

  const sortOptions = [
    { value: 'recent', label: 'Date d\'inscription' },
    { value: 'name', label: 'Email' },
    { value: 'bookings', label: 'Nombre de réservations' },
  ];

  return (
    <div>
      {/* En-tête avec actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Gestion des clients</h1>
        
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <UserPlus className="h-4 w-4" />
            <span className="md:inline hidden">Nouveau client</span>
            <span className="md:hidden inline">Nouveau</span>
          </Link>
          
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            <Download className="h-4 w-4" />
            <span className="md:inline hidden">Exporter</span>
          </button>
          
          <Link
            href="/admin/clients"
            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="md:inline hidden">Réinitialiser</span>
          </Link>

          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="md:hidden inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-sm ml-auto"
          >
            <Search className="h-4 w-4" />
            Filtres
            <ChevronDown className={`h-4 w-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h3 className="text-sm md:text-lg font-medium text-gray-500 mb-1 md:mb-2">Nombre de clients</h3>
          <p className="text-2xl md:text-3xl font-bold">{stats.totalClients}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h3 className="text-sm md:text-lg font-medium text-gray-500 mb-1 md:mb-2">Réservations totales</h3>
          <p className="text-2xl md:text-3xl font-bold">{stats.totalBookings}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h3 className="text-sm md:text-lg font-medium text-gray-500 mb-1 md:mb-2">Réservations / client</h3>
          <p className="text-2xl md:text-3xl font-bold">{stats.avgBookingsPerClient}</p>
        </div>
      </div>
      
      {/* Filtres */}
      <div className={`bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 ${isFiltersOpen ? 'block' : 'md:block hidden'}`}>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-grow max-w-full md:max-w-md">
            <form className="relative" method="GET">
              <input
                type="text"
                name="search"
                placeholder="Rechercher par email..."
                className="pl-10 pr-4 py-2 md:py-3 border border-blue-200 focus:border-blue-500 rounded-lg w-full bg-blue-50/50 focus:bg-white transition-all shadow-sm focus:shadow focus:outline-none"
                defaultValue={searchQuery}
              />
              <button
                type="submit"
                className="absolute left-0 top-0 h-full px-3 text-blue-500 hover:text-blue-700 transition-colors"
              >
                <Search className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </form>
          </div>
          
          <div className="w-full md:w-auto">
            <form className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700 hidden md:inline">
                Trier par:
              </label>
              <select
                id="sort"
                name="sort"
                className="w-full md:w-auto rounded-lg border-blue-200 bg-blue-50/50 focus:bg-white focus:border-blue-500 shadow-sm py-2 md:py-3 px-3 md:px-4 text-gray-700 font-medium transition-all focus:outline-none focus:shadow"
                defaultValue={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </form>
          </div>
        </div>
      </div>
      
      {/* Liste de clients pour mobile */}
      <div className="md:hidden space-y-4">
        {clients.length > 0 ? (
          clients.map((client) => (
            <div key={client.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">
                        {client.email}
                      </h3>
                      <p className="text-xs text-gray-500">
                        ID: {client.id.substring(0, 8)}
                      </p>
                    </div>
                  </div>
                  <ClientActions client={client} />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Inscrit le: {format(new Date(client.createdAt), 'dd/MM/yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Réservations: {client._count.bookings}</span>
                  </div>
                  {client.bookings[0] && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Dernière réservation: {format(new Date(client.bookings[0].createdAt), 'dd/MM/yyyy')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 flex justify-between items-center border-t">
                <Link
                  href={`/admin/bookings?search=${client.email}`}
                  className="text-blue-600 text-sm hover:text-blue-800"
                >
                  Voir les réservations
                </Link>
                <Link 
                  href={`/admin/clients/${client.id}`}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Détails
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            Aucun client trouvé.
          </div>
        )}
      </div>
      
      {/* Tableau des clients pour desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Réservations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière réservation
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.length > 0 ? (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {client.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(client.createdAt), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {client._count.bookings}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.bookings[0] 
                        ? format(new Date(client.bookings[0].createdAt), 'dd/MM/yyyy') 
                        : 'Jamais'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ClientActions client={client} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Aucun client trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bouton d'action flottant pour mobile */}
      <Link
        href="/admin/clients/new"
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg text-white"
      >
        <UserPlus size={24} />
      </Link>
    </div>
  );
} 