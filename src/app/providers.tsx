'use client';

import { ThemeProvider } from 'next-themes';
import { CloudinaryContext } from 'next-cloudinary';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CloudinaryContext uploadPreset="car_rental">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </CloudinaryContext>
  );
} 