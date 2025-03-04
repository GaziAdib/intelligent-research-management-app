"use client";

import { SessionProvider } from "next-auth/react"

export const SessionProviders = ({ children }) => {
    return <SessionProvider>{children}</SessionProvider>
}
