"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Plus,
  CalendarClock,
  Car,
  User,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Phone,
  Mail
} from "lucide-react";
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { BookingsList } from './BookingsList';
import { 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

// Mock bookings data
const bookingsData = [
  {
    id: "BK-123456",
    customer: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567"
    },
    car: {
      id: "CAR-001",
      name: "Tesla Model 3",
      image: "https://same-assets.com/3da9e3ddce17a2ff8dfff77f56db8a44-image.png",
      licensePlate: "EV-1234"
    },
    startDate: "2025-04-15",
    endDate: "2025-04-20",
    pickupLocation: "Airport Terminal 1",
    returnLocation: "Airport Terminal 1",
    totalAmount: 445,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2025-03-10"
  },
  {
    id: "BK-123457",
    customer: {
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      phone: "+1 (555) 987-6543"
    },
    car: {
      id: "CAR-002",
      name: "BMW X5",
      image: "https://same-assets.com/f0c9dbbf7e7c02a15f2e73b0e93ef64d-image.png",
      licensePlate: "SUV-5678"
    },
    startDate: "2025-04-10",
    endDate: "2025-04-15",
    pickupLocation: "Downtown Office",
    returnLocation: "Downtown Office",
    totalAmount: 600,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2025-03-08"
  },
  {
    id: "BK-123458",
    customer: {
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "+1 (555) 456-7890"
    },
    car: {
      id: "CAR-006",
      name: "Audi Q7",
      image: "https://same-assets.com/e5301c1b44ca33f4ac59ec0bd988fc63-image.png",
      licensePlate: "SUV-1234"
    },
    startDate: "2025-04-08",
    endDate: "2025-04-12",
    pickupLocation: "North Station",
    returnLocation: "North Station",
    totalAmount: 540,
    status: "confirmed",
    paymentStatus: "pending",
    createdAt: "2025-03-05"
  },
  {
    id: "BK-123459",
    customer: {
      name: "Sarah Davis",
      email: "sarah.davis@example.com",
      phone: "+1 (555) 234-5678"
    },
    car: {
      id: "CAR-003",
      name: "Toyota Camry",
      image: "https://same-assets.com/8d3ebc7bb7ee33f38db8b90291e99d21-image.png",
      licensePlate: "HYB-9012"
    },
    startDate: "2025-04-05",
    endDate: "2025-04-10",
    pickupLocation: "South Station",
    returnLocation: "South Station",
    totalAmount: 325,
    status: "active",
    paymentStatus: "paid",
    createdAt: "2025-03-01"
  },
  {
    id: "BK-123460",
    customer: {
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
      phone: "+1 (555) 876-5432"
    },
    car: {
      id: "CAR-004",
      name: "Honda Civic",
      image: "https://same-assets.com/84b5fbe58aa72dc4c40c15c3bf2e7f15-image.png",
      licensePlate: "SDN-3456"
    },
    startDate: "2025-04-03",
    endDate: "2025-04-05",
    pickupLocation: "Airport Terminal 2",
    returnLocation: "Downtown Office",
    totalAmount: 110,
    status: "cancelled",
    paymentStatus: "refunded",
    createdAt: "2025-02-28"
  },
  {
    id: "BK-123461",
    customer: {
      name: "Jennifer Lee",
      email: "jennifer.lee@example.com",
      phone: "+1 (555) 345-6789"
    },
    car: {
      id: "CAR-005",
      name: "Ford Mustang",
      image: "https://same-assets.com/3b7b34f02ccbcb5be41c68a3878bc730-image.png",
      licensePlate: "SPT-7890"
    },
    startDate: "2025-04-20",
    endDate: "2025-04-25",
    pickupLocation: "Downtown Office",
    returnLocation: "Airport Terminal 1",
    totalAmount: 750,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2025-03-12"
  },
  {
    id: "BK-123462",
    customer: {
      name: "David Thompson",
      email: "david.thompson@example.com",
      phone: "+1 (555) 567-8901"
    },
    car: {
      id: "CAR-001",
      name: "Tesla Model 3",
      image: "https://same-assets.com/3da9e3ddce17a2ff8dfff77f56db8a44-image.png",
      licensePlate: "EV-1234"
    },
    startDate: "2025-04-02",
    endDate: "2025-04-03",
    pickupLocation: "South Station",
    returnLocation: "South Station",
    totalAmount: 89,
    status: "completed",
    paymentStatus: "paid",
    createdAt: "2025-03-01"
  }
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  let badgeStyle = "flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  let icon = null;

  if (status === "confirmed") {
    badgeStyle += " bg-blue-100 text-blue-800";
    icon = <Clock size={12} className="mr-1" />;
  } else if (status === "active") {
    badgeStyle += " bg-green-100 text-green-800";
    icon = <CheckCircle size={12} className="mr-1" />;
  } else if (status === "completed") {
    badgeStyle += " bg-gray-100 text-gray-800";
    icon = <CheckCircle size={12} className="mr-1" />;
  } else if (status === "cancelled") {
    badgeStyle += " bg-red-100 text-red-800";
    icon = <XCircle size={12} className="mr-1" />;
  } else if (status === "pending") {
    badgeStyle += " bg-yellow-100 text-yellow-800";
    icon = <AlertCircle size={12} className="mr-1" />;
  }

  return (
    <span className={badgeStyle}>
      {icon}
      {status}
    </span>
  );
}

// Payment status badge component
function PaymentStatusBadge({ status }: { status: string }) {
  let badgeStyle = "px-2.5 py-0.5 rounded-full text-xs font-medium";

  if (status === "paid") {
    badgeStyle += " bg-green-100 text-green-800";
  } else if (status === "pending") {
    badgeStyle += " bg-yellow-100 text-yellow-800";
  } else if (status === "refunded") {
    badgeStyle += " bg-gray-100 text-gray-800";
  } else if (status === "failed") {
    badgeStyle += " bg-red-100 text-red-800";
  }

  return <span className={badgeStyle}>{status}</span>;
}

// Format date for display
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!session) {
    redirect('/login');
  }
  
  // Vérifier si l'utilisateur est un administrateur
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || '' },
  });

  if (!user || user.role !== 'ADMIN') {
    // Rediriger vers la page d'accueil si l'utilisateur n'est pas un administrateur
    redirect('/');
  }

  // Récupérer les réservations par statut
  const [pendingBookings, confirmedBookings, completedBookings, cancelledBookings] = await Promise.all([
    prisma.booking.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          }
        },
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            image: true,
          }
        }
      }
    }),
    prisma.booking.findMany({
      where: { status: 'confirmed' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          }
        },
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            image: true,
          }
        }
      }
    }),
    prisma.booking.findMany({
      where: { status: 'completed' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          }
        },
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            image: true,
          }
        }
      }
    }),
    prisma.booking.findMany({
      where: { status: 'cancelled' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          }
        },
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            image: true,
          }
        }
      }
    })
  ]);

  // Récupérer toutes les réservations pour l'onglet "Toutes"
  const allBookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        }
      },
      car: {
        select: {
          id: true,
          brand: true,
          model: true,
          image: true,
        }
      }
    }
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
    <div>
          <h1 className="text-3xl font-bold">Gestion des Réservations</h1>
          <p className="text-gray-500">Gérez les réservations de la plateforme</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Réservations</CardTitle>
          <CardDescription>
            Liste de toutes les réservations organisées par statut
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Toutes ({allBookings.length})</TabsTrigger>
              <TabsTrigger value="pending">En attente ({pendingBookings.length})</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmées ({confirmedBookings.length})</TabsTrigger>
              <TabsTrigger value="completed">Terminées ({completedBookings.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées ({cancelledBookings.length})</TabsTrigger>
        </TabsList>
            <TabsContent value="all" className="mt-4">
              <BookingsList bookings={allBookings} />
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <BookingsList bookings={pendingBookings} />
            </TabsContent>
            <TabsContent value="confirmed" className="mt-4">
              <BookingsList bookings={confirmedBookings} />
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <BookingsList bookings={completedBookings} />
            </TabsContent>
            <TabsContent value="cancelled" className="mt-4">
              <BookingsList bookings={cancelledBookings} />
            </TabsContent>
      </Tabs>
            </CardContent>
          </Card>
    </div>
  );
}
