// tests/e2e/02-busca-mock.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// ✅ AVALIATIVO — network mocking com page.route()
//
// O catálogo do CineFav vem de GET /api/movies.json. Interceptando essa rota
// você controla o "backend" sem backend: injeta dados inventados, simula
// erro de rede, testa estados que o dado real nunca produziria.
//
// Legenda:  🧑‍🏫 = professor faz no screencast · 🧑‍💻 = você faz sozinho
//           FÁCIL = arrange/act prontos, você escreve o expect
//           🔴 DESAFIO = você escreve o teste inteiro
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from '@playwright/test';

// ⚠️ PITFALL REAL: o CineFav é uma PWA — o Service Worker intercepta os fetch
// e responde do cache. Requisição que o SW responde NUNCA chega no page.route!
// Pra testar network mocking, desligamos o SW neste arquivo.
// (Sem esta linha, o teste 2 falha de um jeito misterioso. Guarde esse pitfall.)
test.use({ serviceWorkers: 'block' });

test.describe('Busca + network mocking', () => {
  // 🧑‍🏫 1. FÁCIL — busca real (sem mock): dado do catálogo aparece
  test('1. buscar "Matrix" mostra o resultado', async ({ page }) => {
    await page.goto('/search');
    await page.getByTestId('search-input').fill('Matrix');

    // TODO: espere o resultado da busca ficar visível.
    // Dica: o testID de resultado é search-result-<id> e o id do Matrix é 603.
    // await expect(page.getByTestId('search-result-603'))....
  });

  // 🧑‍💻 2. FÁCIL — mock: o "backend" devolve um filme que NÃO existe no catálogo
  test('2. route() com fulfill injeta um filme inventado', async ({ page }) => {
    // Intercepta ANTES do goto — rota registrada tarde não intercepta nada.
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

    // TODO: verifique que o resultado search-result-999 está visível
    // TODO: verifique que o título "O Filme Que Só Existe No Mock" aparece
  });

  // 🧑‍💻 3. 🔴 DESAFIO — erro de rede: catálogo indisponível
  test('3. falha na API mostra estado de erro com retry', async ({ page }) => {
    // TODO: intercepte '**/api/movies.json' com route.abort()
    // TODO: navegue pra '/qa' (o catálogo mockado — "/" hoje é o Discover, TMDB real)
    // TODO: espere o estado de erro: testID movielist-error
    // TODO: agora "conserte a rede": page.unroute('**/api/movies.json')
    // TODO: clique em movielist-retry-button e espere movielist-grid aparecer
  });

  // 🧑‍💻 4. 🔴 DESAFIO — busca vazia
  test('4. busca sem resultado mostra estado vazio', async ({ page }) => {
    // TODO: sem mock nenhum, busque um título que não existe (ex.: "xyzw")
    // TODO: espere o testID search-empty ficar visível
  });
});
