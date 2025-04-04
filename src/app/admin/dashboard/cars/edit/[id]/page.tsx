'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudinaryUploadWidget } from '@/components/CloudinaryUploadWidget';

export default function EditCarPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [car, setCar] = useState<Car | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchCar();
  }, [params.id]);

  async function fetchCar() {
    try {
      const response = await fetch(`/api/cars/${params.id}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération de la voiture');
      const data = await response.json();
      setCar(data);
      setImageUrl(data.image);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les informations de la voiture',
        variant: 'destructive',
      });
      router.push('/admin/dashboard/cars');
    }
  }

  const handleImageUpload = (url: string) => {
    console.log('URL de l\'image reçue:', url);
    setImageUrl(url);
    toast({
      title: 'Succès',
      description: 'L\'image a été téléchargée avec succès',
    });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);

      // Mettre à jour la voiture
      const response = await fetch(`/api/cars/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand: formData.get('brand'),
          model: formData.get('model'),
          year: Number(formData.get('year')),
          type: formData.get('type'),
          transmission: formData.get('transmission'),
          seats: Number(formData.get('seats')),
          price: Number(formData.get('price')),
          image: imageUrl,
          description: formData.get('description'),
          status: car?.status,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la voiture');
      }

      toast({
        title: 'Succès',
        description: 'La voiture a été mise à jour avec succès',
      });

      router.push('/admin/dashboard/cars');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la mise à jour de la voiture',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  if (!car) {
    return <div className="flex justify-center p-6">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Modifier la voiture</CardTitle>
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
                  defaultValue={car.brand}
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
                  defaultValue={car.model}
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
                  defaultValue={car.year}
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  className="w-full border rounded-md p-2"
                  defaultValue={car.type}
                >
                  <option value="economy">Économique</option>
                  <option value="luxury">Luxe</option>
                  <option value="suv">SUV</option>
                  <option value="sport">Sport</option>
                </select>
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
                  defaultValue={car.transmission}
                >
                  <option value="manual">Manuelle</option>
                  <option value="automatic">Automatique</option>
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
                  defaultValue={car.seats}
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
                defaultValue={car.price}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                required
                defaultValue={car.description}
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Image
              </label>
              <div className="space-y-2">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Aperçu"
                    className="w-40 h-40 object-cover rounded"
                  />
                )}
                <CloudinaryUploadWidget onUpload={handleImageUpload} />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
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