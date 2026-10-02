import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";
import { clearAuth, setAuth } from "@/lib/auth";

describe("useAuth", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("retorna null quando não autenticado", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.token).toBeNull();
    expect(result.current.ongName).toBeNull();
  });

  it("guarda token e nome (não o ID) e re-renderiza na mesma aba", () => {
    const { result } = renderHook(() => useAuth());
    act(() => setAuth("header.payload.assinatura", "ONG Teste"));
    expect(result.current.token).toBe("header.payload.assinatura");
    expect(result.current.ongName).toBe("ONG Teste");
    expect(localStorage.getItem("ongId")).toBeNull();
  });

  it("clearAuth com aviso desloga e deixa a mensagem para o logon", () => {
    setAuth("t", "ONG");
    const { result } = renderHook(() => useAuth());
    act(() => clearAuth("Sua sessão expirou."));
    expect(result.current.token).toBeNull();
    expect(result.current.notice).toBe("Sua sessão expirou.");

    // Logar de novo apaga o aviso.
    act(() => setAuth("t2", "ONG"));
    expect(result.current.notice).toBeNull();
  });
});
