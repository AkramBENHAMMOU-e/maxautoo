import prisma from "@/lib/prisma";
import { CarForm } from "../../components/car-form";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditCarPageProps {
  params: {
    id: string;
  };
}

export default async function EditCarPage({ params }: EditCarPageProps) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/cars">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Modifier la voiture</h1>
        </div>
      </div>
      
      <CarForm car={car} isEditing={true} />
    </div>
  );
} 