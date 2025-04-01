"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CalendarClock, Fuel, Car as CarIcon, Users, Search, Filter } from "lucide-react";

// Type pour les voitures
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

export default function CarsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceSort, setPriceSort] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Récupérer les voitures depuis l'API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/cars");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des voitures");
        }
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("Erreur:", error);
        setError("Impossible de charger les voitures. Veuillez réessayer ultérieurement.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Filtrer les voitures en fonction du terme de recherche et du type
  const filteredCars = cars.filter((car) => {
    const searchString = `${car.brand} ${car.model} ${car.type}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || car.type === typeFilter;
    const isAvailable = car.status === "available";
    return matchesSearch && matchesType && isAvailable;
  });

  // Trier les voitures en fonction du prix
  const sortedCars = [...filteredCars].sort((a, b) => {
    if (priceSort === "low-to-high") {
      return a.price - b.price;
    } else if (priceSort === "high-to-low") {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Notre Flotte de Véhicules</h1>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un véhicule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:w-auto w-full"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <option value="default">Trier par : Défaut</option>
            <option value="low-to-high">Prix : Croissant</option>
            <option value="high-to-low">Prix : Décroissant</option>
          </select>
        </div>

        {/* Options de filtres étendues */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="all">Tous les types</option>
                <option value="economy">Économique</option>
                <option value="luxury">Prestige</option>
                <option value="suv">4x4 / SUV</option>
                <option value="sport">Sport</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transmission
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="all">Tous les types</option>
                <option value="manual">Manuelle</option>
                <option value="automatic">Automatique</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Places
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="all">Nombre indifférent</option>
                <option value="2">2 Places</option>
                <option value="4">4 Places</option>
                <option value="5">5 Places</option>
                <option value="7">7+ Places</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* État de chargement ou erreur */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Chargement des voitures...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Nombre de résultats */}
          <p className="text-gray-500 mb-6">
            {sortedCars.length} {sortedCars.length === 1 ? "voiture trouvée" : "voitures trouvées"}
          </p>

          {/* Grille de voitures */}
          {sortedCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCars.map((car) => (
                <Card key={car.id} className="overflow-hidden border border-gray-200 hover:shadow-lg transition">
                  <div className="aspect-video relative">
                    <img
                      src={car.image || '/placeholder-car.jpg'}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {car.type}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{car.brand} {car.model}</h3>
                      <div className="text-lg font-bold text-blue-600">{car.price}DH<span className="text-sm font-normal text-gray-500">/jour</span></div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users size={18} className="mr-1" />
                        {car.seats} Places
                      </div>
                      <div className="flex items-center">
                        <CarIcon size={18} className="mr-1" />
                        {car.transmission === 'manual' ? 'Manuelle' : 'Automatique'}
                      </div>
                      <div className="flex items-center">
                        <CalendarClock size={18} className="mr-1" />
                        {car.year}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex gap-4">
                    <Button asChild variant="outline" className="w-1/2">
                      <Link href={`/client/cars/${car.id}`}>Détails</Link>
                    </Button>
                    <Button asChild className="w-1/2">
                      <Link href={`/client/cars/${car.id}`}>Réserver</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Aucune voiture correspondant à vos critères.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
