// tests/busca-mock.spec.ts — LAB PLAYWRIGHT WEB: busca + network mocking
// ─────────────────────────────────────────────────────────────────────────────
// Complete os 4 testes abaixo. Em cada um você troca a linha  falta('…')  por um
// `await expect(…)` de verdade. Enquanto a linha falta() existir o teste fica
// VERMELHO ("ainda não feito"); quando você escrever o teste, ele fica VERDE.
//
// A forma de um expect é sempre:   await expect( LOCATOR ).MATCHER( )
//   LOCATOR = onde olhar   (ex.: page.getByTestId('…'), page.getByText('…'))
//   MATCHER = o que conferir (ex.: está visível, tem o texto X, existe N)
// Todos os matchers: https://playwright.dev/docs/test-assertions
// Todos os testids do app: src/utils/testIDs.ts
//
// Rodar:   npx playwright test            (os 4)
//          npx playwright test -g "abrir"  (só o teste 1 — o texto é parte do título)
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from '@playwright/test';
import { falta } from './support/todo';

// O CineFav é uma PWA: o Service Worker responde do cache e o fetch do catálogo
// NUNCA chega no page.route(). Para o mock do teste 4 funcionar, este arquivo
// desliga o Service Worker com a linha abaixo. (Você verá isso em detalhe na aula de PWA.)
test.use({ serviceWorkers: 'block' });

test.describe('Busca + network mocking', () => {
  // ── Teste 1 · 🟢 fácil ──────────────────────────────────────────────────────
  // A tela de busca abriu?  LOCATOR: o testid  search-screen  ·  MATCHER: "está visível".
  test('1. abrir a tela de busca', async ({ page }) => {
    await page.goto('/search');

    // ✍️ sua vez: escreva o expect (e apague a linha abaixo)
    falta('Teste 1');
  });

  // ── Teste 2 · 🟢 fácil ──────────────────────────────────────────────────────
  // O título "Buscar" aparece?  Aqui o LOCATOR é por TEXTO:  page.getByText('Buscar')
  // MATCHER: "está visível".
  test('2. título da tela de busca aparece', async ({ page }) => {
    await page.goto('/search');

    // ✍️ sua vez
    falta('Teste 2');
  });

  // ── Teste 3 · 🟢 fácil ──────────────────────────────────────────────────────
  // Buscar "Matrix" mostra o resultado?  O digitar já está pronto.
  // LOCATOR: o testid  search-result-603  (603 é o id do Matrix) · MATCHER: "está visível".
  test('3. buscar "Matrix" mostra o resultado', async ({ page }) => {
    await page.goto('/search');
    await page.getByTestId('search-input').fill('Matrix');

    // ✍️ sua vez
    falta('Teste 3');
  });

  // ── Teste 4 · 🟡 médio ──────────────────────────────────────────────────────
  // MOCK: o "backend" (GET /api/movies.json) passa a devolver UM filme inventado,
  // que não existe no catálogo de verdade. O mock já está escrito — ele é registrado
  // ANTES do goto (rota registrada tarde não intercepta nada).
  // Falta conferir DUAS coisas:  1) o resultado  search-result-999  está visível
  //                              2) o texto "O Filme Que Só Existe No Mock" aparece
  // Mais sobre mock: https://playwright.dev/docs/mock
  test('4. route() com fulfill injeta um filme inventado', async ({ page }) => {
    await page.route('**/api/movies.json', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 999,
            title: 'O Filme Que Só Existe No Mock',
            overview: 'Prova de que o teste controla o backend.',
            release_date: '2026-01-01',
            vote_average: 9.9,
          },
        ]),
      }),
    );

    await page.goto('/search');
    await page.getByTestId('search-input').fill('mock');

    // ✍️ sua vez: os dois expects
    falta('Teste 4');
  });
});
