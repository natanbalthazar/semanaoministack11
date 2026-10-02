import { test, expect } from "@playwright/test";

// Regressão de layout: em celular nenhuma página pode ter rolagem horizontal
// (conteúdo mais largo que a tela). 320px = celulares pequenos; 390px = iPhone atual.
const pages = [
  { path: "/", ready: "Faça seu logon" },
  { path: "/register", ready: "Cadastro" },
  { path: "/profile", ready: "Casos cadastrados" },
  { path: "/incidents/new", ready: "Cadastrar novo caso" },
];

for (const width of [320, 390]) {
  test.describe(`sem rolagem horizontal em ${width}px`, () => {
    test.use({ viewport: { width, height: 800 } });

    test.beforeEach(async ({ page }) => {
      // Perfil com um caso de texto longo, para pegar quebra de linha também.
      await page.route(/localhost:3333\/profile/, (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            { id: 1, title: "Reforma do abrigo com um título bem comprido", description: "Descrição ".repeat(30), value: "15000" },
          ]),
        }),
      );
      await page.goto("/");
      await page.evaluate(() => {
        localStorage.setItem("token", "e2e.token.valido");
        localStorage.setItem("ongName", "ONG Teste");
      });
    });

    for (const { path, ready } of pages) {
      test(path, async ({ page }) => {
        await page.goto(path);
        await expect(page.getByRole("heading", { name: ready })).toBeVisible();
        const { scrollWidth, innerWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        }));
        expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
      });
    }
  });
}
