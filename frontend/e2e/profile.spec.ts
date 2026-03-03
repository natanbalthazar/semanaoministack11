import { test, expect } from "@playwright/test";

test.describe("Profile (autenticado)", () => {
  test.beforeEach(async ({ page }) => {
    // Mock da API - usa regex para só bater em localhost:3333, não na rota Next
    await page.route(/localhost:3333\/profile/, async (route) => {
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
      localStorage.setItem("ongId", "test12345");
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

test.describe("Profile (não autenticado)", () => {
  test("redireciona para / quando não autenticado", async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto("/profile");
    await expect(page).toHaveURL("/");
  });
});
