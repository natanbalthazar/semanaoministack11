import { test, expect } from "@playwright/test";

test.describe("Cadastrar novo caso (não autenticado)", () => {
  test("redireciona para / quando não autenticado", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/incidents/new");
    await expect(page).toHaveURL("/");
  });
});

test.describe("Cadastrar novo caso (autenticado)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("ongId", "test12345");
      localStorage.setItem("ongName", "ONG Teste");
    });
    await page.goto("/incidents/new");
  });

  test("exibe formulário de cadastro de caso", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /cadastrar novo caso/i })).toBeVisible();
    await expect(page.getByPlaceholder("Título do caso")).toBeVisible();
    await expect(page.getByPlaceholder("Descrição")).toBeVisible();
    await expect(page.getByPlaceholder("Valor em reais")).toBeVisible();
    await expect(page.getByRole("button", { name: /cadastrar/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /voltar para home/i })).toBeVisible();
  });

  test("mostra erro ao submeter com campos vazios", async ({ page }) => {
    await page.getByRole("button", { name: /cadastrar/i }).click();
    await expect(page.getByText("Título é obrigatório")).toBeVisible();
    await expect(page.getByText("Descrição é obrigatória")).toBeVisible();
    await expect(page.getByText("Valor deve ser maior que 0")).toBeVisible();
  });

  test("redireciona para profile após cadastrar com sucesso", async ({ page }) => {
    await page.route(/localhost:3333\/incidents/, async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ id: 1 }),
        });
      } else {
        await route.continue();
      }
    });

    await page.getByPlaceholder("Título do caso").fill("Cachorro atropelado");
    await page.getByPlaceholder("Descrição").fill("Precisa de cirurgia urgente.");
    await page.getByPlaceholder("Valor em reais").fill("150");
    await page.getByRole("button", { name: /cadastrar/i }).click();

    await expect(page).toHaveURL("/profile");
  });

  test("mostra erro quando a API falha", async ({ page }) => {
    await page.route(/localhost:3333\/incidents/, async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({ status: 500 });
      } else {
        await route.continue();
      }
    });

    await page.getByPlaceholder("Título do caso").fill("Caso teste");
    await page.getByPlaceholder("Descrição").fill("Descrição do caso.");
    await page.getByPlaceholder("Valor em reais").fill("100");
    await page.getByRole("button", { name: /cadastrar/i }).click();

    await expect(page.getByText(/erro ao cadastrar caso/i)).toBeVisible();
    await expect(page).toHaveURL("/incidents/new");
  });

  test("link Voltar para home leva ao profile", async ({ page }) => {
    await page.getByRole("link", { name: /voltar para home/i }).click();
    await expect(page).toHaveURL("/profile");
  });
});
