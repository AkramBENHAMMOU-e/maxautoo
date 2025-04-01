'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CloudinaryUploadWidget } from '@/components/CloudinaryUploadWidget';
import { toast } from 'react-hot-toast';

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

export default function EditCarPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${params.id}`);
        if (!response.ok) throw new Error('Voiture non trouvée');
        const data = await response.json();
        setCar(data);
        setImageUrl(data.image);
        setLoading(false);
      } catch (error) {
        toast.error('Erreur lors du chargement de la voiture');
        router.push('/admin/dashboard/cars');
      }
    };

    fetchCar();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!car) return;

    try {
      const formData = new FormData(e.currentTarget);
      const carData = {
        ...car,
        brand: formData.get('brand'),
        model: formData.get('model'),
        year: Number(formData.get('year')),
        type: formData.get('type'),
        transmission: formData.get('transmission'),
        seats: Number(formData.get('seats')),
        price: Number(formData.get('price')),
        description: formData.get('description'),
        status: formData.get('status'),
        image: imageUrl,
      };

      const response = await fetch(`/api/cars/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });

      if (!response.ok) throw new Error('Erreur lors de la modification');

      toast.success('Voiture modifiée avec succès');
      router.push('/admin/dashboard/cars');
      router.refresh();
    } catch (error) {
      toast.error('Erreur lors de la modification de la voiture');
    }
  };

  const handleImageUpload = (url: string) => {
    console.log('URL de l\'image reçue:', url);
    setImageUrl(url);
    toast.success('Image mise à jour avec succès');
  };

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  if (!car) {
    return <div className="p-4">Voiture non trouvée</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier la voiture</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Marque</label>
          <input
            type="text"
            name="brand"
            defaultValue={car.brand}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Modèle</label>
          <input
            type="text"
            name="model"
            defaultValue={car.model}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Année</label>
          <input
            type="number"
            name="year"
            defaultValue={car.year}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Type</label>
          <select
            name="type"
            defaultValue={car.type}
            className="w-full p-2 border rounded"
            required
          >
            <option value="economy">Économique</option>
            <option value="luxury">Luxe</option>
            <option value="suv">SUV</option>
            <option value="sport">Sport</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Transmission</label>
          <select
            name="transmission"
            defaultValue={car.transmission}
            className="w-full p-2 border rounded"
            required
          >
            <option value="manual">Manuelle</option>
            <option value="automatic">Automatique</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Nombre de places</label>
          <input
            type="number"
            name="seats"
            defaultValue={car.seats}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Prix par jour (€)</label>
          <input
            type="number"
            name="price"
            defaultValue={car.price}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            defaultValue={car.description}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block mb-2">Statut</label>
          <select
            name="status"
            defaultValue={car.status}
            className="w-full p-2 border rounded"
            required
          >
            <option value="available">Disponible</option>
            <option value="rented">Louée</option>
            <option value="maintenance">En maintenance</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Image</label>
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
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Enregistrer les modifications
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
} 