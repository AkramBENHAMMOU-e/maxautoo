import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, User, CalendarRange, Car, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BookingActions from '@/components/admin/BookingActions';

// Fonction pour traduire le statut en français
const translateStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' };
    case 'confirmed':
      return { label: 'Confirmée', color: 'bg-green-100 text-green-800' };
    case 'completed':
      return { label: 'Terminée', color: 'bg-blue-100 text-blue-800' };
    case 'cancelled':
      return { label: 'Annulée', color: 'bg-red-100 text-red-800' };
    default:
      return { label: status, color: 'bg-gray-100 text-gray-800' };
  }
};

// Page détail d'une réservation
export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  // Récupérer les informations de la réservation
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      car: true,
    },
  });

  // Si la réservation n'existe pas, afficher une page 404
  if (!booking) {
    notFound();
  }

  // Calculer la durée de la location en jours
  const durationInDays = Math.ceil(
    (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Obtenir le statut traduit et la couleur
  const status = translateStatus(booking.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/bookings">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Détails de la réservation</h1>
        </div>
        <BookingActions booking={booking} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informations de la réservation */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informations de la réservation</CardTitle>
            <CardDescription>Détails de la réservation #{booking.id.substring(0, 8).toUpperCase()}</CardDescription>
            <Badge className={status.color}>{status.label}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarRange className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Période de location</span>
                  </div>
                  <p>
                    {format(new Date(booking.startDate), 'dd MMMM yyyy', { locale: fr })} - {format(new Date(booking.endDate), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Durée: {durationInDays} jour{durationInDays > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Informations de paiement</span>
                  </div>
                  <div>
                    <p className="text-gray-600">Prix</p>
                    <p className="text-xl font-bold">{booking.totalPrice} DH</p>
                    <p className="text-sm text-gray-500">
                      Prix par jour: {(booking.totalPrice / durationInDays).toFixed(2)} DH
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Dates importantes</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-muted-foreground">Créée le:</p>
                    <p>{format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}</p>
                    <p className="text-muted-foreground">Mise à jour le:</p>
                    <p>{format(new Date(booking.updatedAt), 'dd/MM/yyyy HH:mm')}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">ID de réservation</span>
                  </div>
                  <p className="text-xs break-all bg-gray-100 p-2 rounded">{booking.id}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations du client */}
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{booking.user.email}</p>
                  <p className="text-sm text-muted-foreground">ID: {booking.user.id.substring(0, 8)}...</p>
                </div>
              </div>
              <Separator />
              <Button asChild variant="outline" className="w-full">
                <Link href={`/admin/clients/${booking.user.id}`}>
                  Voir le profil client
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Informations du véhicule */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Véhicule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative aspect-video w-full md:w-1/3 rounded-lg overflow-hidden">
                <Image
                  src={booking.car.image || "/placeholder-car.jpg"}
                  alt={`${booking.car.brand} ${booking.car.model}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {booking.car.brand} {booking.car.model}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Année</p>
                    <p>{booking.car.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p>{booking.car.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transmission</p>
                    <p>{booking.car.transmission}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Places</p>
                    <p>{booking.car.seats}</p>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between">
                      <p>Prix:</p>
                      <p>{booking.car.price} DH</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Statut</p>
                    <p>{booking.car.status === 'available' ? 'Disponible' : 'Non disponible'}</p>
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/admin/cars/${booking.car.id}`}>
                    Voir les détails du véhicule
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 