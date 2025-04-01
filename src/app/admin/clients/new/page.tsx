import { ClientForm } from '../components/client-form';

export default function AddClientPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Ajouter un nouveau client</h1>
      <ClientForm />
    </div>
  );
} 