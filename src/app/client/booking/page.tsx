import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ClientBookingPage from "./client-booking";

// Composant serveur pour vérifier l'authentification
export default async function BookingPage() {
  // Vérifier l'authentification côté serveur
  const session = await getServerSession(authOptions);
  
  // Rediriger si l'utilisateur n'est pas connecté
  if (!session) {
    redirect('/auth/login?callbackUrl=/client/booking');
  }
  
  // Rendre le composant client seulement si l'utilisateur est authentifié
  return <ClientBookingPage />;
}
