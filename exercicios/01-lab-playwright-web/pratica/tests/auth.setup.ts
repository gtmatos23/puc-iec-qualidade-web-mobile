// 📘 MODELO (já resolvido) — storageState: logar UMA vez e reusar em todos os testes.
// Roda antes de tudo (projeto "setup" do playwright.config.ts) e salva a sessão em playwright/.auth/.
// Você NÃO edita este arquivo — leia pra entender como os testes já começam logados.

import { test as setup, expect } from '@playwright/test';

const AUTH_FILE = 'playwright/.auth/user.json';

setup('autentica e salva o storageState', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('login-email-input').fill('aluno@puc.br');
  await page.getByTestId('login-password-input').fill('1234');
  await page.getByTestId('login-submit-button').click();

  // Só salva a sessão DEPOIS de provar que o login funcionou.
  await page.waitForURL((url) => !url.pathname.startsWith('/login'));
  await expect(page.locator('html')).toHaveAttribute('data-app-ready', 'true');

  await page.context().storageState({ path: AUTH_FILE });
});
