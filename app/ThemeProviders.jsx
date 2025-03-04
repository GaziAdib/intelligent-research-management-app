"use client";

import { ThemeProvider } from "next-themes";

export const ThemeProviders = ({ children }) => {
    return <ThemeProvider attribute="class">{children}</ThemeProvider>;
  };