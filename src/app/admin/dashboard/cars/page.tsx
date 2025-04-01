"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Edit, Trash2, Filter, ArrowUpDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  transmission: string;
  seats: number;
  price: number;
  image: string;
  description: string;
  status: string;
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  let badgeStyle = "px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  switch (status) {
    case 'available':
      badgeStyle += " bg-green-100 text-green-800";
      return <span className={badgeStyle}>Disponible</span>;
    case 'rented':
      badgeStyle += " bg-blue-100 text-blue-800";
      return <span className={badgeStyle}>Louée</span>;
    case 'maintenance':
      badgeStyle += " bg-orange-100 text-orange-800";
      return <span className={badgeStyle}>En maintenance</span>;
    default:
      badgeStyle += " bg-gray-100 text-gray-800";
      return <span className={badgeStyle}>{status}</span>;
  }
}

export default function AdminCarsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    try {
      const response = await fetch('/api/cars');
      if (!response.ok) throw new Error('Erreur lors de la récupération des voitures');
      const data = await response.json();
      setCars(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les voitures',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  // Filter cars based on search and active tab
  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      (car.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (car.model?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (car.type?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
      (activeTab === "available" && car.status === "available") ||
      (activeTab === "unavailable" && car.status !== "available");
    
    return matchesSearch && matchesTab;
  });

  // Toggle car selection
  const toggleCarSelection = (carId: string) => {
    if (selectedCars.includes(carId)) {
      setSelectedCars(selectedCars.filter(id => id !== carId));
    } else {
      setSelectedCars([...selectedCars, carId]);
    }
  };

  // Select/deselect all cars
  const toggleSelectAll = () => {
    if (selectedCars.length === filteredCars.length) {
      setSelectedCars([]);
    } else {
      setSelectedCars(filteredCars.map(car => car.id));
    }
  };

  // Delete selected cars
  async function handleDeleteSelected() {
    try {
      await Promise.all(
        selectedCars.map(id =>
          fetch(`/api/cars/${id}`, { method: 'DELETE' })
        )
      );

      toast({
        title: 'Succès',
        description: 'Voitures supprimées avec succès',
      });

      setSelectedCars([]);
      fetchCars();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression des voitures',
        variant: 'destructive',
      });
    }
  }

  // Toggle car status
  async function handleToggleStatus(car: Car) {
    try {
      const newStatus = car.status === 'available' ? 'maintenance' : 'available';
      
      const response = await fetch(`/api/cars/${car.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...car,
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      toast({
        title: 'Succès',
        description: 'Statut mis à jour avec succès',
      });

      fetchCars();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
    }
  }

  if (loading) {
    return <div className="flex justify-center p-6">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Voitures</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => router.push('/admin/dashboard/cars/add')}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une voiture
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par marque, modèle ou type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-[400px] grid-cols-3">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="available">Disponibles</TabsTrigger>
          <TabsTrigger value="unavailable">Indisponibles</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="select-all"
            className="mr-2 h-4 w-4"
            checked={selectedCars.length > 0 && selectedCars.length === filteredCars.length}
            onChange={toggleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Tout sélectionner
          </label>

          {selectedCars.length > 0 && (
            <div className="ml-4 flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                {selectedCars.length} sélectionnée(s)
              </span>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <Card key={car.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative h-48">
                <Image
                  src={car.image || '/placeholder-car.jpg'}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover"
                />
                <input
                  type="checkbox"
                  className="absolute top-2 left-2 h-4 w-4"
                  checked={selectedCars.includes(car.id)}
                  onChange={() => toggleCarSelection(car.id)}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white"
                    onClick={() => router.push(`/admin/dashboard/cars/edit/${car.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">
                  {car.brand} {car.model}
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Année</span>
                    <span>{car.year}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type</span>
                    <span>{car.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Prix/jour</span>
                    <span>{car.price}€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Statut</span>
                    <StatusBadge status={car.status} />
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleToggleStatus(car)}
                  >
                    {car.status === 'available' ? 'Marquer indisponible' : 'Marquer disponible'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}