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
  X,
  Mail
} from "lucide-react";
import { UserButton } from '@/components/UserButton';
import { Button } from '@/components/ui/button';

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [status, session, router]);

  useEffect(() => {
    // Fonction pour récupérer le nombre de messages non lus
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/contact/unread');
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.count);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre de messages non lus:', error);
      }
    };

    // Charger le nombre de messages non lus au démarrage
    if (!loading) {
      fetchUnreadCount();
    }

    // Recharger le nombre toutes les 5 minutes
    const interval = setInterval(fetchUnreadCount, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [loading]);

  // Fonction de déconnexion
  const handleLogout = async () => {
    router.push('/auth/logout');
  };

  // Fermer le menu mobile lors d'un changement de page
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
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
    { name: 'Messages', href: '/admin/messages', icon: Mail, badge: unreadCount > 0 ? unreadCount : null },
  ];

  // Check if a navigation item is active
  const isActive = (href: string) => {
    // Pour l'URL /admin, on vérifie si le pathname est exactement /admin
    if (href === '/admin') {
      return pathname === '/admin';
    }
    // Pour les autres URLs, on vérifie si le pathname commence par href
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80] bg-white border-r">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <div className="flex items-center justify-center h-16">
            <h1 className="text-2xl font-bold">MaxAuto Admin</h1>
          </div>
          <div className="mt-5 flex-1 flex flex-col px-3">
            <nav className="flex-1 space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      active
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        active
                          ? 'text-blue-700'
                          : 'text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserButton />
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <span className="flex items-center gap-1">
                  <LogOut size={16} />
                  <span>Déconnexion</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header and sidebar */}
      <div className="md:hidden">
        {/* Mobile header */}
        <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
              >
                {mobileSidebarOpen ? (
                  <X size={24} className="text-gray-600" />
                ) : (
                  <Menu size={24} className="text-gray-600" />
                )}
              </button>
              <h1 className="text-lg font-bold">MaxAuto Admin</h1>
            </div>
            <UserButton />
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <div className={`fixed top-16 left-0 z-40 h-[calc(100vh-64px)] w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-3">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                        active
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          active
                            ? 'text-blue-700'
                            : 'text-gray-500'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={handleLogout}
              >
                <span className="flex items-center justify-center gap-2">
                  <LogOut size={16} />
                  <span>Déconnexion</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 pt-20 md:pt-6 md:ml-64 overflow-y-auto bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
