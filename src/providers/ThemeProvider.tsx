"use client";

import { createContext, useContext } from "react";

const ThemeCtx = createContext({ theme: "dark" as const });

export function useTheme() {
  return useContext(ThemeCtx);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeCtx.Provider value={{ theme: "dark" }}>
      {children}
    </ThemeCtx.Provider>
  );
}
