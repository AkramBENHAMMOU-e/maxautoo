import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ClientForm } from '@/app/admin/clients/components/client-form';

// Page d'édition d'un client
export default async function EditClientPage({ params }: { params: { id: string } }) {
  // Récupérer les informations du client
  const client = await prisma.user.findUnique({
    where: { id: params.id },
  });

  // Si le client n'existe pas, afficher une page 404
  if (!client) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href={`/admin/clients/${client.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Modifier le client</h1>
      </div>

      <ClientForm client={client} />
    </div>
  );
} 