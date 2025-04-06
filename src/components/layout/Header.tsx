"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 md:py-3 flex justify-between items-center">
        <Link href="/" className="text-xl md:text-2xl font-bold text-blue-600">
          DriveEasy
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
            Accueil
          </Link>
          <Link href="/client/cars" className="text-gray-700 hover:text-blue-600 transition">
            Nos Voitures
          </Link>
          <Link href="/client/booking" className="text-gray-700 hover:text-blue-600 transition">
            Mes Réservations
          </Link>
          <Link href="/client/contact" className="text-gray-700 hover:text-blue-600 transition">
            Contactez-nous
          </Link>
          <Button asChild variant="default" className="text-sm py-1.5 px-3 h-auto">
            <Link href="/admin">Connexion Admin</Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" className="md:hidden p-1" onClick={toggleMenu}>
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 shadow-md">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition px-2 py-2 text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/client/cars"
              className="text-gray-700 hover:text-blue-600 transition px-2 py-2 text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Nos Voitures
            </Link>
            <Link
              href="/client/booking"
              className="text-gray-700 hover:text-blue-600 transition px-2 py-2 text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Mes Réservations
            </Link>
            <Link
              href="/client/contact"
              className="text-gray-700 hover:text-blue-600 transition px-2 py-2 text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Contactez-nous
            </Link>
            <Button asChild variant="default" className="w-full py-1.5 h-auto text-sm">
              <Link href="/admin" onClick={() => setIsMenuOpen(false)}>Connexion Admin</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
