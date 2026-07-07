"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

// Class-based theming so the CSS-variable tokens in Retro.css swap under `.dark`.
// Light "aged paper" is the flagship retro look; dark is the night-sepia variant.
// A manual toggle lives in the header, and OS preference is still honored.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
