"use client";

import { useCallback } from "react";
import * as auth from "@/lib/auth";

export function useAuth() {
  const ongId = auth.getOngId();
  const ongName = auth.getOngName();
  const isAuthenticated = !!ongId;

  const setAuth = useCallback((id: string, name: string) => {
    auth.setAuth(id, name);
  }, []);

  const clearAuth = useCallback(() => {
    auth.clearAuth();
  }, []);

  return { ongId, ongName, isAuthenticated, setAuth, clearAuth };
}
