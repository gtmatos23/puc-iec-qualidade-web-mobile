// tests/e2e/06-discover-tmdb.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// Specs da tela principal ("/", dado real do TMDB) — network mocking num
// domínio EXTERNO de verdade. Não entra na rubrica dos 20pts (isso roda
// em /qa, specs 01-05) — é prática extra sobre a mesma técnica.
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

  test('3. abre o detalhe e "Ver comentários" mocka /movie/:id/reviews', async ({ page }) => {
    await page.route('**/movie/popular*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [{ id: 42, title: 'Filme com Reviews', overview: '', release_date: '2026-01-01', vote_average: 8 }],
        }),
      }),
    );
    // Detalhe (GET /movie/42) é uma rota DIFERENTE de /movie/popular — cuidado
    // pra não casar as duas com o mesmo padrão genérico '**/movie/**'.
    await page.route('**/movie/42?*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 42,
          title: 'Filme com Reviews',
          overview: 'Sinopse mockada.',
          release_date: '2026-01-01',
          vote_average: 8,
          poster_path: null,
        }),
      }),
    );
    await page.route('**/movie/42/reviews*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              id: 'rev1',
              author: 'Crítico Mockado',
              content: 'Comentário de teste, interceptado antes da rede de verdade.',
              author_details: { rating: 9 },
            },
          ],
        }),
      }),
    );

    await page.goto('/discover');
    await page.getByTestId('discover-card-42').click();
    await expect(page.getByTestId('discover-detail-title')).toHaveText('Filme com Reviews');

    await page.getByTestId('discover-reviews-button').click();
    await expect(page.getByTestId('discover-reviews-list')).toBeVisible();
    await expect(page.getByTestId('discover-review-rev1')).toContainText('Crítico Mockado');
  });
});
