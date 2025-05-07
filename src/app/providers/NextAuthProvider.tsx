"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

export const NextAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider refetchInterval={5} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
};
