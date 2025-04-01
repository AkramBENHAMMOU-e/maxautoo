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
  detail: { collapsed: boolean };
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
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-blue-600">MaxiAuto Admin</h2>
            <p className="text-sm text-gray-500">Gestion de location au Maroc</p>
          </div>
          <nav className="flex-1 py-6 px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={async () => {
                await signOut({ redirect: false });
                router.push('/');
              }}
              className="flex items-center p-3 w-full text-left text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-4 md:p-8">{children}</main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
