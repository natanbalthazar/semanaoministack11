import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";

vi.mock("@/lib/auth", () => ({
  getOngId: vi.fn(),
  getOngName: vi.fn(),
  setAuth: vi.fn(),
  clearAuth: vi.fn(),
}));

const auth = await import("@/lib/auth");

describe("useAuth", () => {
  beforeEach(() => {
    vi.mocked(auth.getOngId).mockReturnValue(null);
    vi.mocked(auth.getOngName).mockReturnValue(null);
  });

  it("retorna null quando não autenticado", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.ongId).toBeNull();
    expect(result.current.ongName).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("retorna valores corretos quando autenticado", () => {
    vi.mocked(auth.getOngId).mockReturnValue("abc12345");
    vi.mocked(auth.getOngName).mockReturnValue("ONG Teste");
    const { result } = renderHook(() => useAuth());
    expect(result.current.ongId).toBe("abc12345");
    expect(result.current.ongName).toBe("ONG Teste");
    expect(result.current.isAuthenticated).toBe(true);
  });
});
