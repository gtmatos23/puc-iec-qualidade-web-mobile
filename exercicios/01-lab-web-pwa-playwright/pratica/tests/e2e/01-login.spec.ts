// tests/e2e/01-login.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// 📘 MODELO (resolvido) — locators recomendados + fluxo de login
//
// Este arquivo já vem pronto: é o exemplo que o professor resolve no
// screencast. Leia com atenção — os padrões daqui (getByTestId, getByRole,
// web-first assertions, zero sleep) são o que você replica nos specs 02–05.
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from '@playwright/test';

// Este spec TESTA o login — então não pode começar logado.
// test.use sobrescreve o storageState do projeto só neste arquivo.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('1. usuário sem sessão é redirecionado pra /login', async ({ page }) => {
    await page.goto('/');
    // Rota protegida sem auth → guard manda pro login.
    await expect(page.getByTestId('login-screen')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('2. login com credenciais válidas leva à tela principal', async ({ page }) => {
    await page.goto('/login');

    // getByTestId: seletor estável, imune a mudança de texto/CSS.
    await page.getByTestId('login-email-input').fill('aluno@puc.br');
    await page.getByTestId('login-password-input').fill('1234');
    await page.getByTestId('login-submit-button').click();

    // Web-first assertion: espera + verifica num passo só (auto-waiting).
    // NUNCA page.waitForTimeout(3000) — é assim que nasce suíte flaky.
    //
    // Repara: NÃO asserta um filme específico — "/" hoje é a tela Discover
    // (dado real do TMDB, muda sempre). Testar a TELA (estrutural) em vez
    // do CONTEÚDO (variável) é o que mantém esse teste estável. Pra dado
    // fixo e determinístico, veja o ambiente QA em '/qa' (specs 02-05).
    await expect(page.getByTestId('discover-screen')).toBeVisible();
  });

  test('3. senha errada mostra mensagem de erro e NÃO navega', async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('login-email-input').fill('aluno@puc.br');
    await page.getByTestId('login-password-input').fill('senha-errada');
    await page.getByTestId('login-submit-button').click();

    // role=alert: acessibilidade e teste usando o MESMO contrato.
    await expect(page.getByRole('alert')).toHaveText('E-mail ou senha inválidos');
    await expect(page).toHaveURL(/\/login/);
  });
});
