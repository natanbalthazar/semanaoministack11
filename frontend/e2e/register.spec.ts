import { test, expect } from "@playwright/test";

test.describe("Register", () => {
  test("exibe formulário de cadastro", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByPlaceholder("Nome da ONG")).toBeVisible();
    await expect(page.getByPlaceholder("E-mail")).toBeVisible();
    await expect(page.getByPlaceholder("WhatsApp")).toBeVisible();
    await expect(page.getByPlaceholder("Cidade")).toBeVisible();
    await expect(page.getByPlaceholder("UF")).toBeVisible();
    await expect(page.getByRole("button", { name: /cadastrar/i })).toBeVisible();
  });

  test("redireciona para login após cadastro com sucesso", async ({ page }) => {
    let alertMessage = "";
    page.on("dialog", (dialog) => {
      alertMessage = dialog.message();
      dialog.accept();
    });

    await page.route(/localhost:3333\/ongs/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "abc12345" }),
      });
    });

    await page.goto("/register");
    await page.getByPlaceholder("Nome da ONG").fill("ONG do Bem");
    await page.getByPlaceholder("E-mail").fill("contato@ong.com");
    await page.getByPlaceholder("WhatsApp").fill("11987654321");
    await page.getByPlaceholder("Cidade").fill("São Paulo");
    await page.getByPlaceholder("UF").fill("SP");
    await page.getByRole("button", { name: /cadastrar/i }).click();

    await expect(page).toHaveURL("/");
    expect(alertMessage).toContain("abc12345");
  });
});
