import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-white text-base md:text-lg font-semibold mb-3 md:mb-4">À Propos</h3>
            <p className="text-gray-400 mb-3 md:mb-4 text-sm md:text-base">
              MaxiAuto est votre partenaire de confiance pour la location de voitures au Maroc. Notre flotte diversifiée répond à tous vos besoins de déplacement dans tout le Royaume.
            </p>
            <div className="flex space-x-3 md:space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={18} className="md:h-5 md:w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={18} className="md:h-5 md:w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={18} className="md:h-5 md:w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={18} className="md:h-5 md:w-5" />
              </a>
            </div>
          </div>

          {/* Liens Rapides */}
          <div>
            <h3 className="text-white text-base md:text-lg font-semibold mb-3 md:mb-4">Liens Rapides</h3>
            <ul className="space-y-1.5 md:space-y-2 text-sm md:text-base">
              <li>
                <Link href="/client/cars" className="text-gray-400 hover:text-white transition-colors">
                  Notre Flotte
                </Link>
              </li>
              <li>
                <Link href="/client/booking" className="text-gray-400 hover:text-white transition-colors">
                  Mes Réservations
                </Link>
              </li>
              <li>
                <Link href="/client/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contactez-nous
                </Link>
              </li>
              <li>
                <Link href="/client/about" className="text-gray-400 hover:text-white transition-colors">
                  À Propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-base md:text-lg font-semibold mb-3 md:mb-4">Nos Services</h3>
            <ul className="space-y-1.5 md:space-y-2 text-sm md:text-base">
              <li>
                <Link href="/client/services/insurance" className="text-gray-400 hover:text-white transition-colors">
                  Assurance Tous Risques
                </Link>
              </li>
              <li>
                <Link href="/client/services/delivery" className="text-gray-400 hover:text-white transition-colors">
                  Livraison à l'Hôtel
                </Link>
              </li>
              <li>
                <Link href="/client/services/airport" className="text-gray-400 hover:text-white transition-colors">
                  Service Aéroport
                </Link>
              </li>
              <li>
                <Link href="/client/services/corporate" className="text-gray-400 hover:text-white transition-colors">
                  Location Longue Durée
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-base md:text-lg font-semibold mb-3 md:mb-4">Contact</h3>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 md:h-5 md:w-5" />
                <span className="text-gray-400">
                  27 Avenue Hassan II<br />
                  Casablanca, 20000<br />
                  Maroc
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 md:h-5 md:w-5" />
                <span className="text-gray-400">+212 522 123 456</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 md:h-5 md:w-5" />
                <span className="text-gray-400">contact@maxiauto.ma</span>
              </li>
              <li className="flex items-center">
                <Clock size={16} className="mr-2 md:h-5 md:w-5" />
                <span className="text-gray-400">
                  Lun-Sam: 8h30-20h00<br />
                  Dim: 9h00-17h00
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre de séparation */}
        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
              © {new Date().getFullYear()} MaxiAuto. Tous droits réservés. RC: 123456 - IF: 87654321 - CNSS: 9876543
            </p>
            <div className="flex space-x-4 md:space-x-6 mt-3 md:mt-0">
              <Link href="/client/privacy" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors">
                Politique de Confidentialité
              </Link>
              <Link href="/client/terms" className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors">
                Conditions d'Utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
