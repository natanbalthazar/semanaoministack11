import { test, expect } from "@playwright/test";

test.describe("Profile (autenticado)", () => {
  test.beforeEach(async ({ page }) => {
    // Mock da API - usa regex para só bater em localhost:3333, não na rota Next.
    // Como o backend real, só responde 200 com o Bearer token certo (senão 401).
    await page.route(/localhost:3333\/profile/, async (route) => {
      const authorization = await route.request().headerValue("authorization");
      if (authorization !== "Bearer e2e.token.valido") {
        return route.fulfill({ status: 401, contentType: "application/json", body: "{}" });
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            title: "Caso de teste",
            description: "Descrição do caso",
            value: "100",
          },
        ]),
      });
    });

    // Garante estar no mesmo origin antes de setar localStorage
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("token", "e2e.token.valido");
      localStorage.setItem("ongName", "ONG Teste");
    });
    await page.goto("/profile");
  });

  test("exibe header com nome da ONG", async ({ page }) => {
    await expect(page.getByText(/bem vinda, ONG Teste/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /cadastrar novo caso/i })).toBeVisible();
  });

  test("lista incidentes cadastrados", async ({ page }) => {
    await expect(page.getByText("Carregando...")).toBeHidden({ timeout: 10000 });
    await expect(page.getByText("Casos cadastrados")).toBeVisible();
    await expect(page.getByText("Caso de teste")).toBeVisible();
    await expect(page.getByText("Descrição do caso")).toBeVisible();
  });
});

test.describe("Profile (token expirado)", () => {
  test("token expirado → volta para o login com aviso", async ({ page }) => {
    // O backend recusa o token (expirou ou foi adulterado) → 401.
    await page.route(/localhost:3333\/profile/, (route) =>
      route.fulfill({ status: 401, contentType: "application/json", body: "{}" }),
    );

    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("token", "e2e.token.expirado");
      localStorage.setItem("ongName", "ONG Teste");
    });
    await page.goto("/profile");

    await expect(page).toHaveURL("/");
    await expect(page.getByText(/sua sessão expirou/i)).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("token"))).toBeNull();
  });
});

test.describe("Profile (não autenticado)", () => {
  test("redireciona para / quando não autenticado", async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto("/profile");
    await expect(page).toHaveURL("/");
  });
});
