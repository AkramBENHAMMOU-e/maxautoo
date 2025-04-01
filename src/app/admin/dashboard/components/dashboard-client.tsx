"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingsList } from '@/app/admin/dashboard/bookings/BookingsList';
import { CalendarDateRangePicker } from '@/app/admin/dashboard/components/date-range-picker';
import { FaCar, FaUsers, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import { Booking, User, Car } from "@prisma/client";

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
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="cars">Véhicules</TabsTrigger>
          <TabsTrigger value="users">Clients</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Flotte de Véhicules
                </CardTitle>
                <FaCar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{carsCount}</div>
                <p className="text-xs text-muted-foreground">
                  Total des véhicules en service
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Clients
                </CardTitle>
                <FaUsers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usersCount}</div>
                <p className="text-xs text-muted-foreground">
                  Base de clientèle active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Réservations
                </CardTitle>
                <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookingsCount}</div>
                <p className="text-xs text-muted-foreground">
                  Total des réservations
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenus
                </CardTitle>
                <FaDollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRevenue} DH</div>
                <p className="text-xs text-muted-foreground">
                  Revenus totaux des réservations complétées
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-7">
              <CardHeader>
                <CardTitle>Réservations récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingsList bookings={bookings} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les réservations</CardTitle>
            </CardHeader>
            <CardContent>
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
          <Card>
            <CardHeader>
              <CardTitle>Gestion des véhicules</CardTitle>
            </CardHeader>
            <CardContent>
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
          <Card>
            <CardHeader>
              <CardTitle>Gestion des clients</CardTitle>
            </CardHeader>
            <CardContent>
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
    </div>
  );
} 