import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LogonPage from "@/app/page";
import { Providers } from "@/components/Providers";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/lib/api", () => ({
  apiPost: vi.fn(),
}));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ setAuth: vi.fn(), notice: null }),
}));
vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={props.src} alt={props.alt} />
  ),
}));

describe("Logon", () => {
  it("exibe erro quando ID está vazio ao submeter", async () => {
    // A página usa React Query (useMutation), então precisa do QueryClientProvider.
    render(<LogonPage />, { wrapper: Providers });
    const submitBtn = screen.getByRole("button", { name: /entrar/i });
    fireEvent.click(submitBtn);
    expect(await screen.findByText(/ID é obrigatório/i)).toBeInTheDocument();
  });
});
