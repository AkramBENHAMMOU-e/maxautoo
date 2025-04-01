"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut({ redirect: false });
        // Redirection vers la page d'accueil après déconnexion
        router.push("/");
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        router.push("/");
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Déconnexion en cours...</h1>
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    </div>
  );
} 