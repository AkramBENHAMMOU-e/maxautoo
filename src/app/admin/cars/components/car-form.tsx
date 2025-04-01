'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Car } from "@prisma/client";

interface CarFormProps {
  car?: Car;
  isEditing?: boolean;
}

export function CarForm({ car, isEditing = false }: CarFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brand: car?.brand || '',
    model: car?.model || '',
    year: car?.year?.toString() || '2023',
    type: car?.type || '',
    transmission: car?.transmission || 'Manuelle',
    seats: car?.seats?.toString() || '5',
    price: car?.price?.toString() || '',
    image: '',
    description: car?.description || '',
    status: car?.status || 'available',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Récupérer l'image si elle existe
      const fileInput = document.querySelector<HTMLInputElement>('input[name="image"]');
      console.log('File input:', fileInput);
      console.log('Files:', fileInput?.files);
      
      let imageUrl = '';
      
      // Si nous avons un fichier image, uploader via notre propre API
      if (fileInput?.files?.[0]) {
        const file = fileInput.files[0];
        console.log('Image sélectionnée:', { 
          name: file.name, 
          type: file.type, 
          size: file.size 
        });
        
        try {
          // Créer formData pour l'upload vers notre API
          const uploadData = new FormData();
          uploadData.append('file', file);
          
          // Utiliser notre propre API d'upload
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadData
          });
          
          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Erreur upload:', errorText);
            // En cas d'erreur, utiliser l'image par défaut
            imageUrl = 'https://cdn-icons-png.flaticon.com/512/741/741407.png';
            toast.warning("Impossible d'uploader l'image, utilisation d'une image par défaut");
          } else {
            const uploadResult = await uploadResponse.json();
            if (uploadResult.success) {
              imageUrl = uploadResult.url;
              console.log('Image uploadée avec succès:', imageUrl);
            } else {
              imageUrl = 'https://cdn-icons-png.flaticon.com/512/741/741407.png';
              toast.warning("Impossible d'uploader l'image, utilisation d'une image par défaut");
            }
          }
        } catch (uploadError) {
          console.error('Erreur d\'upload:', uploadError);
          // En cas d'erreur, utiliser l'image par défaut
          imageUrl = 'https://cdn-icons-png.flaticon.com/512/741/741407.png';
          toast.warning("Impossible d'uploader l'image, utilisation d'une image par défaut");
        }
      } else if (isEditing && car?.image) {
        // En mode édition, conserver l'image existante
        imageUrl = car.image;
      } else {
        // Image par défaut si aucune image fournie
        imageUrl = 'https://cdn-icons-png.flaticon.com/512/741/741407.png';
      }
      
      // Préparer les données pour l'API
      const carData = {
        ...formData,
        image: imageUrl,
        year: parseInt(formData.year),
        seats: parseInt(formData.seats),
        price: parseFloat(formData.price)
      };
      
      console.log('Données de voiture à envoyer:', carData);
      
      // Déterminer l'URL et la méthode en fonction du mode édition ou création
      const url = isEditing ? `/api/cars/${car?.id}` : '/api/cars';
      const method = isEditing ? 'PUT' : 'POST';
      
      console.log(`Envoi de la requête: ${method} ${url}`);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(carData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur réponse:', errorText);
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      toast.success(isEditing ? 'Voiture mise à jour avec succès' : 'Voiture ajoutée avec succès');
      router.push('/admin/cars');
      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Marque */}
        <div className="space-y-2">
          <label htmlFor="brand" className="text-sm font-medium">
            Marque
          </label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Ex: Renault"
            required
          />
        </div>

        {/* Modèle */}
        <div className="space-y-2">
          <label htmlFor="model" className="text-sm font-medium">
            Modèle
          </label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Ex: Clio"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Année */}
        <div className="space-y-2">
          <label htmlFor="year" className="text-sm font-medium">
            Année
          </label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            min="1990"
            max="2030"
            placeholder="Ex: 2023"
            required
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium">
            Type
          </label>
          <Select
            name="type"
            value={formData.type}
            onValueChange={(value) => handleSelectChange('type', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Citadine">Citadine</SelectItem>
              <SelectItem value="Berline">Berline</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
              <SelectItem value="4x4">4x4</SelectItem>
              <SelectItem value="Coupé">Coupé</SelectItem>
              <SelectItem value="Cabriolet">Cabriolet</SelectItem>
              <SelectItem value="Utilitaire">Utilitaire</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Places */}
        <div className="space-y-2">
          <label htmlFor="seats" className="text-sm font-medium">
            Places
          </label>
          <Input
            id="seats"
            name="seats"
            type="number"
            value={formData.seats}
            onChange={handleChange}
            min="1"
            max="9"
            placeholder="Ex: 5"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Transmission */}
        <div className="space-y-2">
          <label htmlFor="transmission" className="text-sm font-medium">
            Transmission
          </label>
          <Select
            name="transmission"
            value={formData.transmission}
            onValueChange={(value) => handleSelectChange('transmission', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Manuelle">Manuelle</SelectItem>
              <SelectItem value="Automatique">Automatique</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prix par jour */}
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">
            Prix par jour (DH)
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Ex: 50.00"
            required
          />
        </div>

        {/* Statut */}
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Statut
          </label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="rented">Louée</SelectItem>
              <SelectItem value="maintenance">En maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Image */}
      <div className="space-y-2">
        <label htmlFor="image" className="text-sm font-medium">
          {isEditing ? 'Nouvelle image (optionnel)' : 'Image'}
        </label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          required={!isEditing}
        />
        {isEditing && car?.image && (
          <div className="mt-2">
            <span className="text-sm text-gray-500">Image actuelle: </span>
            <a 
              href={car.image} 
              target="_blank" 
              rel="noreferrer" 
              className="text-sm text-blue-500 hover:underline"
            >
              Voir l'image
            </a>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description détaillée de la voiture..."
          rows={5}
          required
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Traitement en cours...' : isEditing ? 'Mettre à jour' : 'Ajouter la voiture'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/admin/cars')}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
} 