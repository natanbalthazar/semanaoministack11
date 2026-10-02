import { describe, it, expect, vi, beforeEach } from "vitest";
import { setAuth } from "@/lib/auth";

describe("lib/api", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("rotas protegidas enviam Authorization: Bearer <token>", async () => {
    setAuth("meu.token.jwt", "ONG");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => Response.json([]));
    const { apiGet } = await import("@/lib/api");

    await apiGet("profile", { auth: true });
    const sentAuth = (call: number) => new Headers(fetchMock.mock.calls[call][1]?.headers).get("Authorization");
    expect(sentAuth(0)).toBe("Bearer meu.token.jwt");

    await apiGet("incidents");
    expect(sentAuth(1)).toBeNull();
  });

  it("401 numa rota protegida encerra a sessão com aviso", async () => {
    setAuth("expirado", "ONG");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 401 }));
    const { apiGet, SESSION_EXPIRED_MESSAGE } = await import("@/lib/api");

    await expect(apiGet("profile", { auth: true })).rejects.toThrow();
    expect(localStorage.getItem("token")).toBeNull();
    expect(sessionStorage.getItem("authNotice")).toBe(SESSION_EXPIRED_MESSAGE);
  });
});
