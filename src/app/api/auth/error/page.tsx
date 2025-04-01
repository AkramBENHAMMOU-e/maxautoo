"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "Une erreur est survenue lors de l'authentification";

  if (error === "CredentialsSignin") {
    errorMessage = "Email ou mot de passe incorrect";
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center text-red-600 mb-6">
          <AlertCircle className="h-8 w-8 mr-3" />
          <h1 className="text-2xl font-bold">Erreur d'authentification</h1>
        </div>
        
        <p className="text-gray-700 mb-6">{errorMessage}</p>
        
        <div className="flex justify-center">
          <Link 
            href="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Retour à la page de connexion
          </Link>
        </div>
      </div>
    </div>
  );
} 