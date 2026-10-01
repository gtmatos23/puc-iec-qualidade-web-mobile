// tests/e2e/auth.setup.ts
// ─────────────────────────────────────────────────────────────────────────────
// 📘 MODELO (resolvido) — storageState: logar UMA vez, reusar em todos os specs
//
// Este arquivo roda antes da suíte (project "setup" no playwright.config.ts).
// Ele faz login pela UI e salva cookies + localStorage em playwright/.auth/.
// Os demais specs iniciam JÁ AUTENTICADOS — sem repetir login em cada teste.
// É o critério "auth state reuse" da rubrica do lab.
// ─────────────────────────────────────────────────────────────────────────────

import { test as setup, expect } from '@playwright/test';

const AUTH_FILE = 'playwright/.auth/user.json';

setup('autentica e salva o storageState', async ({ page }) => {
  await page.goto('/login');

  await page.getByTestId('login-email-input').fill('aluno@puc.br');
  await page.getByTestId('login-password-input').fill('1234');
  await page.getByTestId('login-submit-button').click();

  // Só salve o estado DEPOIS de provar que o login funcionou. Não assume
  // qual tela é "/" (hoje é Discover, dado real) — espera o sinal
  // route-agnostic que o App.tsx seta assim que monta (ver App.tsx).
  await page.waitForURL((url) => !url.pathname.startsWith('/login'));
  await expect(page.locator('html')).toHaveAttribute('data-app-ready', 'true');

  await page.context().storageState({ path: AUTH_FILE });
});
