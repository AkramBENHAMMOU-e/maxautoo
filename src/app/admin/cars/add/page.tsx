import { CarForm } from '../components/car-form';

export default function AddCarPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Ajouter une nouvelle voiture</h1>
      <CarForm />
    </div>
  );
} 