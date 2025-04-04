"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          MaxiAuto
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/client" className="text-sm font-medium hover:text-primary">
            Accueil
          </Link>
          <Link href="/client/cars" className="text-sm font-medium hover:text-primary">
            Notre Flotte
          </Link>
          <Link href="/client/booking" className="text-sm font-medium hover:text-primary">
            Mes Réservations
          </Link>
          <Link href="/client/contact" className="text-sm font-medium hover:text-primary">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/admin">Espace Admin</Link>
          </Button>
        </div>
      </div>
    </header>
  );
} 