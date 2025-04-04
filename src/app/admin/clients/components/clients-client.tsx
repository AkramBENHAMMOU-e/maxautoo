"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, UserPlus, Download, RefreshCw } from 'lucide-react';
import ClientActions from '@/components/admin/ClientActions';
import { format } from 'date-fns';

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
      <div className="flex flex-wrap items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestion des clients</h1>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4" />
            Nouveau client
          </Link>
          
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Exporter
          </button>
          
          <Link
            href="/admin/clients"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4" />
            Réinitialiser
          </Link>
        </div>
      </div>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Nombre de clients</h3>
          <p className="text-3xl font-bold">{stats.totalClients}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Réservations totales</h3>
          <p className="text-3xl font-bold">{stats.totalBookings}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-500 mb-2">Réservations / client</h3>
          <p className="text-3xl font-bold">{stats.avgBookingsPerClient}</p>
        </div>
      </div>
      
      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-grow max-w-md">
            <form className="relative" method="GET">
              <input
                type="text"
                name="search"
                placeholder="Rechercher par email..."
                className="pl-12 pr-4 py-3 border border-blue-200 focus:border-blue-500 rounded-lg w-full bg-blue-50/50 focus:bg-white transition-all shadow-sm focus:shadow focus:outline-none"
                defaultValue={searchQuery}
              />
              <button
                type="submit"
                className="absolute left-0 top-0 h-full px-3 text-blue-500 hover:text-blue-700 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>
          
          <div>
            <form className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Trier par:
              </label>
              <select
                id="sort"
                name="sort"
                className="rounded-lg border-blue-200 bg-blue-50/50 focus:bg-white focus:border-blue-500 shadow-sm py-3 px-4 text-gray-700 font-medium transition-all focus:outline-none focus:shadow"
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
      
      {/* Tableau des clients */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
    </div>
  );
} 