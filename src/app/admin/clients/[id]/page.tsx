import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, User, Calendar, Bookmark, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Page de détail d'un client
export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  // Récupérer les informations du client
  const client = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      bookings: {
        orderBy: { createdAt: 'desc' },
        include: {
          car: true,
        },
      },
    },
  });

  // Si le client n'existe pas, afficher une page 404
  if (!client) {
    notFound();
  }

  // Calculer quelques statistiques
  const totalBookings = client.bookings.length;
  const confirmedBookings = client.bookings.filter(booking => booking.status === 'confirmed').length;
  const pendingBookings = client.bookings.filter(booking => booking.status === 'pending').length;
  const cancelledBookings = client.bookings.filter(booking => booking.status === 'cancelled').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/clients">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Détails du client</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/clients/${client.id}/edit`}>
            <Button>
              Modifier
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informations du client */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>Détails du compte client</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="text-blue-500 h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-500">Rôle</p>
                  <p className="font-medium">{client.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Mail className="text-blue-500 h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Calendar className="text-blue-500 h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-500">Compte créé le</p>
                  <p className="font-medium">{format(new Date(client.createdAt), 'dd MMMM yyyy', { locale: fr })}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Bookmark className="text-blue-500 h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-500">Réservations</p>
                  <p className="font-medium">{totalBookings}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques et réservations */}
        <Card className="md:col-span-2">
          <CardHeader>
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stats">Statistiques</TabsTrigger>
                <TabsTrigger value="bookings">Réservations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium">Confirmées</p>
                    <p className="text-2xl font-bold">{confirmedBookings}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-sm text-yellow-600 font-medium">En attente</p>
                    <p className="text-2xl font-bold">{pendingBookings}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-600 font-medium">Annulées</p>
                    <p className="text-2xl font-bold">{cancelledBookings}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="bookings" className="mt-6 space-y-4">
                {client.bookings.length > 0 ? (
                  client.bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{booking.car.brand} {booking.car.model}</h3>
                          <p className="text-sm text-gray-500">
                            {format(new Date(booking.startDate), 'dd/MM/yyyy')} - {format(new Date(booking.endDate), 'dd/MM/yyyy')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {booking.status === 'confirmed' ? 'Confirmée' :
                             booking.status === 'pending' ? 'En attente' : 'Annulée'}
                          </Badge>
                          <p className="font-medium text-gray-900">{booking.totalPrice} DH</p>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Link href={`/admin/bookings/${booking.id}`}>
                          <Button variant="outline" size="sm">
                            Voir les détails
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    Ce client n'a pas encore effectué de réservations.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
} 