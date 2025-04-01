'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CloudinaryUploadWidget } from '@/components/CloudinaryUploadWidget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddCarPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    console.log('État actuel de imageUrl:', imageUrl);
  }, [imageUrl]);

  const handleImageUpload = (url: string) => {
    console.log('URL reçue du widget:', url);
    if (url && typeof url === 'string' && url.trim() !== '') {
      const cleanUrl = url.trim();
      console.log('URL nettoyée:', cleanUrl);
      setImageUrl(cleanUrl);
      
      toast({
        title: 'Image uploadée',
        description: 'L\'image a été uploadée avec succès',
      });
    } else {
      console.error('URL invalide reçue:', url);
      toast({
        title: 'Erreur',
        description: 'L\'URL de l\'image est invalide',
        variant: 'destructive',
      });
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      console.log('Vérification de l\'image avant envoi:', {
        imageUrl,
        'imageUrl vide?': !imageUrl,
        'type:': typeof imageUrl
      });

      if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
        throw new Error('Veuillez sélectionner une image');
      }

      const carData = {
        brand: formData.get('brand'),
        model: formData.get('model'),
        year: parseInt(formData.get('year') as string),
        type: formData.get('type'),
        transmission: formData.get('transmission'),
        seats: parseInt(formData.get('seats') as string),
        price: parseFloat(formData.get('price') as string),
        imageUrl: imageUrl.trim(),
        description: formData.get('description'),
      };

      console.log('Données envoyées:', carData);

      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création de la voiture');
      }

      const result = await response.json();
      console.log('Réponse du serveur:', result);

      toast({
        title: 'Succès',
        description: 'La voiture a été ajoutée avec succès',
      });

      router.push('/admin/dashboard/cars');
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'ajout de la voiture',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une nouvelle voiture</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="brand" className="block text-sm font-medium mb-1">
                  Marque
                </label>
                <Input
                  id="brand"
                  name="brand"
                  required
                  placeholder="Ex: Renault"
                />
              </div>
              
              <div>
                <label htmlFor="model" className="block text-sm font-medium mb-1">
                  Modèle
                </label>
                <Input
                  id="model"
                  name="model"
                  required
                  placeholder="Ex: Clio"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="year" className="block text-sm font-medium mb-1">
                  Année
                </label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  required
                  min="1900"
                  max="2024"
                  placeholder="Ex: 2023"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">
                  Type
                </label>
                <Input
                  id="type"
                  name="type"
                  required
                  placeholder="Ex: Citadine"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="transmission" className="block text-sm font-medium mb-1">
                  Transmission
                </label>
                <select
                  id="transmission"
                  name="transmission"
                  required
                  className="w-full border rounded-md p-2"
                >
                  <option value="Manuelle">Manuelle</option>
                  <option value="Automatique">Automatique</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="seats" className="block text-sm font-medium mb-1">
                  Nombre de places
                </label>
                <Input
                  id="seats"
                  name="seats"
                  type="number"
                  required
                  min="1"
                  max="9"
                  placeholder="Ex: 5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Prix par jour (€)
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="Ex: 50.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Image
              </label>
              <CloudinaryUploadWidget onUpload={handleImageUpload} />
              {imageUrl && (
                <div className="mt-2">
                  <Image
                    src={imageUrl}
                    alt="Aperçu"
                    width={128}
                    height={128}
                    className="object-cover rounded"
                  />
                  <p className="text-sm text-green-600 mt-1">
                    Image sélectionnée : {imageUrl}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="Description détaillée de la voiture..."
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading || !imageUrl}>
                {loading ? 'Ajout en cours...' : 'Ajouter la voiture'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/dashboard/cars')}
              >
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 