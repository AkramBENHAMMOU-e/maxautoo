"use client";

import { useState } from "react";
import { Car } from "@prisma/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Stats {
  all: number;
  available: number;
  unavailable: number;
}

interface CarsClientProps {
  cars: Car[];
  stats: Stats;
  searchQuery?: string;
  currentStatus?: string;
}

export function CarsClient({
  cars,
  stats,
  searchQuery = "",
  currentStatus = "",
}: CarsClientProps) {
  const router = useRouter();
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filterCarsByLocalSearch = (cars: Car[]) => {
    if (!localSearch) return cars;
    
    const searchTerm = localSearch.toLowerCase();
    return cars.filter((car) => {
      return (
        car.brand.toLowerCase().includes(searchTerm) ||
        car.model.toLowerCase().includes(searchTerm) ||
        car.type.toLowerCase().includes(searchTerm)
      );
    });
  };

  const filteredCars = filterCarsByLocalSearch(cars);

  const toggleCarSelection = (carId: string) => {
    setSelectedCars((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCars.length === filteredCars.length) {
      setSelectedCars([]);
    } else {
      setSelectedCars(filteredCars.map((car) => car.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedCars.length === 0) return;
    setIsDeleting(true);

    try {
      const response = await fetch("/api/admin/cars/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedCars }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.activeCarIds) {
          toast.error(
            "Certaines voitures ne peuvent pas être supprimées car elles sont actuellement louées."
          );
        } else {
          toast.error(data.error || "Une erreur est survenue lors de la suppression des voitures");
        }
        return;
      }

      toast.success(`${selectedCars.length} voiture(s) supprimée(s) avec succès`);
      setSelectedCars([]);
      router.refresh();
    } catch (error) {
      toast.error("Une erreur est survenue lors de la suppression des voitures");
      console.error(error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleTabChange = (value: string) => {
    let newUrl = "/admin/cars";
    const params = new URLSearchParams();
    
    if (value !== "") {
      params.set("status", value);
    }
    
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    
    const queryString = params.toString();
    if (queryString) {
      newUrl += `?${queryString}`;
    }
    
    router.push(newUrl);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let newUrl = "/admin/cars";
    const params = new URLSearchParams();
    
    if (currentStatus) {
      params.set("status", currentStatus);
    }
    
    if (localSearch) {
      params.set("search", localSearch);
    }
    
    const queryString = params.toString();
    if (queryString) {
      newUrl += `?${queryString}`;
    }
    
    router.push(newUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-2">
          <Button asChild>
            <Link href="/admin/cars/add">Ajouter une voiture</Link>
          </Button>
          {selectedCars.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Supprimer ({selectedCars.length})
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 p-4 border rounded-lg bg-card">
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-2xl font-bold">{stats.all}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Disponibles</span>
            <span className="text-2xl font-bold">{stats.available}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground">Indisponibles</span>
            <span className="text-2xl font-bold">{stats.unavailable}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <Input
            placeholder="Rechercher une voiture..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="max-w-lg"
          />
          <Button type="submit">Rechercher</Button>
        </form>

        <Tabs
          value={currentStatus}
          onValueChange={handleTabChange}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
            <TabsTrigger value="">Toutes</TabsTrigger>
            <TabsTrigger value="available">Disponibles</TabsTrigger>
            <TabsTrigger value="rented">Louées</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredCars.length > 0 && (
        <div className="bg-muted/40 p-2 rounded-md flex items-center gap-2">
          <Checkbox
            checked={
              selectedCars.length > 0 &&
              selectedCars.length === filteredCars.length
            }
            onCheckedChange={toggleSelectAll}
            aria-label="Sélectionner toutes les voitures"
          />
          <span className="text-sm text-muted-foreground">
            {selectedCars.length === 0
              ? "Sélectionner tout"
              : selectedCars.length === filteredCars.length
              ? "Tout désélectionner"
              : `${selectedCars.length} sélectionné(s)`}
          </span>
        </div>
      )}

      {filteredCars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground">Aucune voiture trouvée</p>
          <Button
            variant="link"
            onClick={() => {
              setLocalSearch("");
              router.push("/admin/cars");
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCars.map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <div className="relative">
                <Checkbox
                  checked={selectedCars.includes(car.id)}
                  onCheckedChange={() => toggleCarSelection(car.id)}
                  className="absolute top-2 left-2 z-10"
                />
                <div className="aspect-video relative">
                  <Image
                    src={car.image || "/placeholder-car.jpg"}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{car.brand} {car.model}</h3>
                    <p className="text-sm text-muted-foreground">{car.year} · {car.type}</p>
                  </div>
                  <Badge
                    variant={
                      car.status === "available"
                        ? "success"
                        : car.status === "rented"
                        ? "warning"
                        : "destructive"
                    }
                    className="ml-2"
                  >
                    {car.status === "available"
                      ? "Disponible"
                      : car.status === "rented"
                      ? "Louée"
                      : "Maintenance"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Transmission:</span>
                    <p>{car.transmission}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Places:</span>
                    <p>{car.seats}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-lg font-bold">{car.price} DH<span className="text-xs font-normal text-muted-foreground"> / jour</span></p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/cars/${car.id}`}>Voir</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/admin/cars/edit/${car.id}`}>Modifier</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {selectedCars.length} voiture(s) ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 