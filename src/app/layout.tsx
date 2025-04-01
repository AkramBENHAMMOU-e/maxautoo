import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClientLayout } from "@/components/ClientLayout";
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from "@/components/SessionProvider";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Location de voitures au Maroc | Toutes destinations touristiques",
  description: "Agence de location de voitures au Maroc. Service premium à prix abordable à Casablanca, Marrakech, Rabat, Tanger, Agadir et dans tout le Royaume",
};

const cloudinaryScript = `
  window.cloudinaryConfig = {
    cloudName: 'dnha4cj0w',
    uploadPreset: 'car_rental',
    styles: {
      palette: {
        window: "#FFFFFF",
        windowBorder: "#90A0B3",
        tabIcon: "#0078FF",
        menuIcons: "#5A616A",
        textDark: "#000000",
        textLight: "#FFFFFF",
        link: "#0078FF",
        action: "#FF620C",
        inactiveTabIcon: "#0E2F5A",
        error: "#F44235",
        inProgress: "#0078FF",
        complete: "#20B832",
        sourceBg: "#E4EBF1"
      }
    },
    options: {
      sources: ['local', 'url', 'camera'],
      multiple: false,
      maxFiles: 1,
      showAdvancedOptions: false,
      cropping: false,
      showPoweredBy: false,
      singleUploadAutoClose: false,
      showSkipCropButton: false
    }
  };
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: cloudinaryScript
          }}
        />
      </head>
      <body className={cn(inter.className, "min-h-screen flex flex-col")}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClientLayout>{children}</ClientLayout>
            <WhatsAppButton />
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
