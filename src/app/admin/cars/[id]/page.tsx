import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface CarDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  // Extraire l'ID de façon sécurisée
  const { id } = params;
  
  // Récupérer la voiture par son ID
  const car = await prisma.car.findUnique({
    where: { id }
  });

  // Si la voiture n'existe pas, rediriger vers une page 404
  if (!car) {
    return notFound();
  }
  
  // Déterminer le statut pour l'affichage
  const statusDisplay = {
    available: { label: "Disponible", variant: "success" as const },
    rented: { label: "Louée", variant: "warning" as const },
    maintenance: { label: "Maintenance", variant: "destructive" as const }
  };

  const status = statusDisplay[car.status as keyof typeof statusDisplay] || 
    { label: car.status, variant: "default" as const };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/cars">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Détails du véhicule</h1>
        </div>
        <Link href={`/admin/cars/edit/${id}`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image
            src={car.image || "/placeholder-car.jpg"}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">
                {car.brand} {car.model}
              </h2>
              <p className="text-gray-500">
                {car.year} · {car.type}
              </p>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Transmission</p>
              <p>{car.transmission}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Places</p>
              <p>{car.seats}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Prix journalier</p>
              <p className="text-xl font-bold">{car.price} DH / jour</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ID</p>
              <p className="text-xs overflow-hidden text-ellipsis">{car.id}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
            <p className="text-gray-700">{car.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 