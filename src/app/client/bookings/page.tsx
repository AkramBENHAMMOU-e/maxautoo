"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarRange, Car as CarIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CancelBookingButton from '@/components/CancelBookingButton';

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  car: {
    id: string;
    brand: string;
    model: string;
    image: string;
    price: number;
  };
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-500";
    case "confirmed":
      return "bg-green-500";
    case "cancelled":
      return "bg-red-500";
    case "completed":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "En attente";
    case "confirmed":
      return "Confirmée";
    case "cancelled":
      return "Annulée";
    case "completed":
      return "Terminée";
    default:
      return status;
  }
};

async function getBookings(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return [];
  }

  return prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      car: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login?callbackUrl=/client/bookings");
  }

  const bookings = await getBookings(session.user.email);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes réservations</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Vous n'avez pas encore de réservations.
          </p>
          <Link
            href="/client/cars"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Parcourir les voitures disponibles
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative h-48 md:h-full">
                  <img
                    src={booking.car.image || "/placeholder-car.jpg"}
                    alt={`${booking.car.brand} ${booking.car.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:col-span-3">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold">
                        {booking.car.brand} {booking.car.model}
                      </h2>
                      <p className="text-gray-600">
                        {format(new Date(booking.startDate), "d MMMM yyyy", {
                          locale: fr,
                        })}{" "}
                        -{" "}
                        {format(new Date(booking.endDate), "d MMMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.status === "pending"
                        ? "En attente"
                        : booking.status === "confirmed"
                        ? "Confirmée"
                        : booking.status === "cancelled"
                        ? "Annulée"
                        : booking.status}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{booking.car.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Places</p>
                      <p className="font-medium">{booking.car.seats}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="font-medium">{booking.car.transmission}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prix total</p>
                      <p className="font-medium">{booking.totalPrice.toFixed(2)} €</p>
                    </div>
                  </div>
                  {booking.status === "pending" && (
                    <div className="flex gap-4">
                      <CancelBookingButton bookingId={booking.id} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 