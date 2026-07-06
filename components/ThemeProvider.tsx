"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

// Class-based theming so the CSS-variable tokens in globals.css swap under `.dark`.
// Dark Premium is the flagship look; light is the pastel variant. A manual toggle
// lives in the header, and OS preference is still honored.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
