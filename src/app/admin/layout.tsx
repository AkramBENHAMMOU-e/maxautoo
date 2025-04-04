"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Users, 
  CalendarRange, 
  Car, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";

// Define the custom event type
interface SidebarToggleEvent extends Event {
  detail?: {
    open?: boolean;
  };
}

// Declare the custom event for TypeScript
declare global {
  interface WindowEventMap {
    sidebarToggle: SidebarToggleEvent;
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    if (status === 'authenticated') {
      if (session?.user?.role !== 'ADMIN') {
        router.push('/auth/login');
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  // Fonction de déconnexion
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    );
  }

  // Ne pas rendre le contenu tant que l'authentification n'est pas terminée
  if (status !== 'authenticated' || session?.user?.role !== 'ADMIN') {
    return null;
  }

  const navigation = [
    { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
    { name: 'Réservations', href: '/admin/bookings', icon: CalendarRange },
    { name: 'Clients', href: '/admin/clients', icon: Users },
    { name: 'Véhicules', href: '/admin/cars', icon: Car },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 p-4 z-50">
        <button
          type="button"
          className="p-2 rounded-md text-gray-700 bg-white shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-6">
          <div className="text-xl font-bold text-gray-800">
            Car Rental Admin
          </div>
        </div>
        <nav className="mt-6 flex-grow">
          <ul className="space-y-2 px-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`flex items-center p-3 rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon
                      size={20}
                      className={isActive ? 'text-blue-600' : 'text-gray-400'}
                    />
                    <span className="ml-3">{item.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Bouton de déconnexion */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-md text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} className="text-red-500" />
            <span className="ml-3">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 min-h-screen">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
