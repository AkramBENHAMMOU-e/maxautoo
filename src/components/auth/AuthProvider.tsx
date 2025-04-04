"use client";

import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Ce composant doit être exécuté uniquement côté client
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <SessionProvider>{children}</SessionProvider>;
} 