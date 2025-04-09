import { Outfit } from "next/font/google";
import "../globals.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/toaster";
import WhatsAppButton from "@/components/WhatsAppButton";

const outfit = Outfit({ subsets: ["latin"] });

// Désactiver la mise en cache pour les pages client
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      
      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
      
      <Toaster />
    </>
  );
}
