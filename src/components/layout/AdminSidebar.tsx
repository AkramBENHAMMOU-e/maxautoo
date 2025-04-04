"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut } from "next-auth/react";
import {
  Car,
  CalendarClock,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutDashboard
} from "lucide-react";

// Create a custom event type for TypeScript
interface SidebarToggleEvent extends Event {
  detail: { collapsed: boolean };
}

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  // Emit an event when sidebar is toggled
  useEffect(() => {
    const event = new CustomEvent('sidebarToggle', {
      detail: { collapsed }
    }) as SidebarToggleEvent;
    window.dispatchEvent(event);
  }, [collapsed]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const isActivePath = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin");
  };

  const navItems = [
    {
      name: "Tableau de Bord",
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Voitures",
      href: "/admin/dashboard/cars",
      icon: <Car size={20} />,
    },
    {
      name: "Réservations",
      href: "/admin/dashboard/bookings",
      icon: <CalendarClock size={20} />,
    },
    {
      name: "Clients",
      href: "/admin/dashboard/customers",
      icon: <Users size={20} />,
    },
    {
      name: "Paramètres",
      href: "/admin/dashboard/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-gray-900 text-white min-h-screen transition-all duration-300 fixed left-0 top-0 z-40`}
    >
      <div className="flex justify-between items-center p-4">
        {!collapsed && (
          <Link href="/admin/dashboard" className="text-xl font-bold">
            DriveEasy
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-800"
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <Separator className="bg-gray-700" />

      <div className="py-4">
        <Link href="/" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 transition">
          <Home size={20} />
          {!collapsed && <span className="ml-3">Visiter le Site</span>}
        </Link>
      </div>

      <Separator className="bg-gray-700" />

      <nav className="mt-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 ${
                  isActivePath(item.href)
                    ? "bg-blue-700 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                } transition rounded-r-lg ${collapsed ? "justify-center" : ""}`}
              >
                {item.icon}
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-4 w-full">
        <Separator className="bg-gray-700 mb-4" />
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 w-full text-left text-gray-300 hover:bg-gray-800 transition rounded-r-lg"
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
