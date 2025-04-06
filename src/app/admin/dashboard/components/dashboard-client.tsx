"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingsList } from '@/app/admin/dashboard/bookings/BookingsList';
import { CalendarDateRangePicker } from '@/app/admin/dashboard/components/date-range-picker';
import { FaCar, FaUsers, FaCalendarAlt, FaDollarSign, FaEnvelope } from 'react-icons/fa';
import { Booking, User, Car } from "@prisma/client";
import { useState, useEffect } from "react";

// Type pour les réservations avec relations
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

// Props pour le composant client
interface DashboardClientProps {
  carsCount: number;
  usersCount: number;
  bookingsCount: number;
  bookings: BookingWithRelations[];
  totalRevenue: number;
}

export function DashboardClient({ 
  carsCount, 
  usersCount, 
  bookingsCount, 
  bookings, 
  totalRevenue 
}: DashboardClientProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si l'écran est de taille mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Vérifier au chargement
    checkIfMobile();
    
    // Ajouter un événement pour vérifier lors du redimensionnement
    window.addEventListener('resize', checkIfMobile);
    
    // Nettoyer l'événement
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-4 md:pt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Tableau de bord</h2>
        <div className="flex items-center space-x-2">
          <div className="hidden md:block">
          <CalendarDateRangePicker />
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full md:w-auto grid grid-cols-4 md:flex">
          <TabsTrigger value="overview" className="text-xs md:text-sm">Aperçu</TabsTrigger>
          <TabsTrigger value="bookings" className="text-xs md:text-sm">Réservations</TabsTrigger>
          <TabsTrigger value="cars" className="text-xs md:text-sm">Véhicules</TabsTrigger>
          <TabsTrigger value="users" className="text-xs md:text-sm">Clients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Vue pour les statistiques sur mobile */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Véhicules
                </CardTitle>
                <FaCar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="text-xl md:text-2xl font-bold">{carsCount}</div>
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  Total des véhicules
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Clients
                </CardTitle>
                <FaUsers className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="text-xl md:text-2xl font-bold">{usersCount}</div>
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  Clients actifs
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Réservations
                </CardTitle>
                <FaCalendarAlt className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="text-xl md:text-2xl font-bold">{bookingsCount}</div>
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  Total réservations
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium">
                  Revenus
                </CardTitle>
                <FaDollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="text-xl md:text-2xl font-bold">{totalRevenue} DH</div>
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  Revenus totaux
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg font-bold">Réservations récentes</CardTitle>
              </CardHeader>
            <CardContent className="p-0 md:p-4">
              {isMobile ? (
                <div className="space-y-2">
                  {bookings.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">Aucune réservation trouvée</p>
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-md p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-sm font-medium">{booking.car.brand} {booking.car.model}</div>
                            <div className="text-xs text-gray-500">{booking.user.email}</div>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status === 'pending' ? 'En attente' :
                             booking.status === 'confirmed' ? 'Confirmée' :
                             booking.status === 'completed' ? 'Terminée' :
                             'Annulée'}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-1">
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">{booking.totalPrice} DH</div>
                          <Link 
                            href={`/admin/bookings/${booking.id}`}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                          >
                            Détails
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <BookingsList bookings={bookings} />
              )}
              </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-bold">Gestion des réservations</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-gray-500 mb-4">
                Accédez à l'interface complète de gestion des réservations pour consulter, modifier ou créer des réservations.
              </p>
              <Link 
                href="/admin/bookings"
                className="block w-full p-2 text-center rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Voir toutes les réservations
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cars" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-bold">Gestion des véhicules</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-gray-500 mb-4">
                Gérez votre flotte de véhicules, ajoutez de nouveaux modèles ou modifiez les informations des véhicules existants.
              </p>
              <Link
                href="/admin/cars"
                className="block w-full p-2 text-center rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Gérer les véhicules
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-bold">Gestion des clients</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-gray-500 mb-4">
                Consultez et gérez les informations de vos clients, leurs historiques de réservation et leurs préférences.
              </p>
              <Link 
                href="/admin/clients"
                className="block w-full p-2 text-center rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Gérer les clients
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation rapide pour mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t grid grid-cols-4 py-2 px-1 gap-1 z-10">
        <Link href="/admin/bookings" className="flex flex-col items-center justify-center">
          <FaCalendarAlt className="h-5 w-5 text-blue-600" />
          <span className="text-[10px] mt-1">Réservations</span>
        </Link>
        <Link href="/admin/cars" className="flex flex-col items-center justify-center">
          <FaCar className="h-5 w-5 text-blue-600" />
          <span className="text-[10px] mt-1">Véhicules</span>
        </Link>
        <Link href="/admin/clients" className="flex flex-col items-center justify-center">
          <FaUsers className="h-5 w-5 text-blue-600" />
          <span className="text-[10px] mt-1">Clients</span>
        </Link>
        <Link href="/admin/messages" className="flex flex-col items-center justify-center">
          <FaEnvelope className="h-5 w-5 text-blue-600" />
          <span className="text-[10px] mt-1">Messages</span>
        </Link>
      </div>
      
      {/* Ajouter de l'espace en bas pour la barre de navigation mobile */}
      <div className="md:hidden h-16"></div>
    </div>
  );
} 