import { test, expect } from "@playwright/test";

test.describe("Logon", () => {
  test("exibe formulário de login", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByPlaceholder("Sua ID")).toBeVisible();
    await expect(page.getByRole("button", { name: /entrar/i })).toBeVisible();
    await expect(page.getByText("Faça seu logon")).toBeVisible();
    await expect(page.getByRole("link", { name: /não tenho cadastro/i })).toBeVisible();
  });

  test("mostra erro ao submeter ID vazio", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /entrar/i }).click();
    await expect(page.getByText(/ID é obrigatório/i)).toBeVisible();
  });

  test("redireciona para profile após login com sucesso", async ({ page }) => {
    await page.route(/localhost:3333\/sessions/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ name: "ONG Teste" }),
      });
    });

    await page.goto("/");
    await page.getByPlaceholder("Sua ID").fill("abc12345");
    await page.getByRole("button", { name: /entrar/i }).click();

    await expect(page).toHaveURL("/profile");
    await expect(page.getByText(/bem vinda, ONG Teste/i)).toBeVisible();
  });

  test("mostra erro quando login falha", async ({ page }) => {
    await page.route(/localhost:3333\/sessions/, async (route) => {
      await route.fulfill({ status: 400 });
    });

    await page.goto("/");
    await page.getByPlaceholder("Sua ID").fill("id-invalido");
    await page.getByRole("button", { name: /entrar/i }).click();

    await expect(page.getByText(/falha no login/i)).toBeVisible();
  });
});
