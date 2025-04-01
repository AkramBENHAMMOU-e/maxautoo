"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  CarFront, 
  TrendingUp,
  CircleDollarSign,
} from 'lucide-react';

interface AdminClientProps {
  stats: {
    totalUsers: number;
    totalCars: number;
    availableCars: number;
    totalBookings: number;
    pendingBookings: number;
    revenue: number;
    recentBookings: Array<{
      id: string;
      totalPrice: number;
      status: string;
      createdAt: Date;
      user: {
        email: string;
      };
      car: {
        brand: string;
        model: string;
      };
    }>;
  };
}

export function AdminClient({ stats }: AdminClientProps) {
  // Statistiques en cartes
  const statCards = [
    {
      title: 'Clients',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/clients'
    },
    {
      title: 'Véhicules',
      value: `${stats.availableCars}/${stats.totalCars}`,
      icon: CarFront,
      color: 'bg-green-500',
      link: '/admin/cars'
    },
    {
      title: 'Réservations',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-purple-500',
      link: '/admin/bookings'
    },
    {
      title: 'Revenu total',
      value: `${stats.revenue.toFixed(2)} €`,
      icon: CircleDollarSign,
      color: 'bg-yellow-500',
      link: '/admin/bookings'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link key={index} href={stat.link} className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-gray-500 font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Réservations en attente */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Réservations en attente</h2>
            <div className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm font-medium">
              {stats.pendingBookings} en attente
            </div>
          </div>
        </div>
        <div className="p-6">
          {stats.pendingBookings > 0 ? (
            <p className="text-gray-600">
              Vous avez {stats.pendingBookings} réservation(s) en attente de traitement.
            </p>
          ) : (
            <p className="text-gray-600">Aucune réservation en attente.</p>
          )}
          <div className="mt-4">
            <Link
              href="/admin/bookings"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Voir toutes les réservations
            </Link>
          </div>
        </div>
      </div>
      
      {/* Réservations récentes */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Réservations récentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {booking.car.brand} {booking.car.model}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {booking.totalPrice.toFixed(2)} €
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status === 'confirmed'
                        ? 'Confirmée'
                        : booking.status === 'pending'
                        ? 'En attente'
                        : 'Annulée'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
              {stats.recentBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucune réservation récente.
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