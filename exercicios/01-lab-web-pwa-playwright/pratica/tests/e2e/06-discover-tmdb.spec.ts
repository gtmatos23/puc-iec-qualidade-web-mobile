// tests/e2e/06-discover-tmdb.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// 🎁 BÔNUS (não pontua) — network mocking num domínio EXTERNO de verdade.
//
// Diferença do spec 02 (02-busca-mock.spec.ts): lá o fetch é same-origin
// (/api/movies.json, o próprio servidor do Vite). Aqui o app chama
// https://api.themoviedb.org de verdade — page.route() intercepta ANTES da
// requisição sair pra rede. Você nunca precisa do token pra RODAR o teste
// (o route() nunca deixa a chamada real acontecer) — só pra usar a tela
// manualmente fora do teste.
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from '@playwright/test';

test.describe('Discover — TMDB real (mockado no teste)', () => {
  test('1. intercepta api.themoviedb.org e mostra o filme mockado', async ({ page }) => {
    // Repara: o padrão da URL é o domínio de verdade, não localhost.
    await page.route('**/api.themoviedb.org/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              id: 9999,
              title: 'Filme Mockado do TMDB',
              overview: 'Interceptado antes de bater na rede de verdade.',
              release_date: '2026-01-01',
              vote_average: 7.5,
            },
          ],
        }),
      }),
    );

    await page.goto('/discover');
    await expect(page.getByTestId('discover-title-9999')).toHaveText('Filme Mockado do TMDB');
  });

  test('2. TMDB fora do ar (abort) mostra estado de erro com retry', async ({ page }) => {
    await page.route('**/api.themoviedb.org/**', (route) => route.abort());

    await page.goto('/discover');
    await expect(page.getByTestId('discover-error')).toBeVisible();

    // "Conserta a rede" e tenta de novo.
    await page.unroute('**/api.themoviedb.org/**');
    await page.route('**/api.themoviedb.org/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              id: 1,
              title: 'Rede Voltou',
              overview: '',
              release_date: '2026-01-01',
              vote_average: 6,
            },
          ],
        }),
      }),
    );
    await page.getByTestId('discover-retry-button').click();
    await expect(page.getByTestId('discover-title-1')).toHaveText('Rede Voltou');
  });
});
