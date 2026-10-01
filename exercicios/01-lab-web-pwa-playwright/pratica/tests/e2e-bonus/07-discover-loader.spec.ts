// tests/e2e-bonus/07-discover-loader.spec.ts
// ─────────────────────────────────────────────────────────────────────────────
// 🎁 BÔNUS — não entra nos 20pts da rubrica. Roda SEPARADO da suíte
// avaliativa: `npm run test:bonus` (nunca `npm run test:e2e`). Por isso fica
// numa pasta própria (tests/e2e-bonus/) com config própria — esse desafio
// bate em rede REAL do TMDB, não pode fazer parte do critério eliminatório
// (3 runs 100% verde) nem do CI que corrige a Atividade.
//
// Precisa de internet E de VITE_TMDB_TOKEN válido no .env.local (ver
// .env.example) — esse teste usa route.continue(), a chamada é REAL. Sem
// token, o TMDB responde 401 e o teste falha — normal, não é bug seu.
// ─────────────────────────────────────────────────────────────────────────────

import { test, expect } from '@playwright/test';
import { DiscoverDetailPage } from './pages/DiscoverDetailPage';

const MOVIE_ID = 969681; // Homem-Aranha: Um Novo Dia — id real, existe no TMDB

test.describe('Discover detail — loader com rede real throttled', () => {
  test('1. loader aparece durante o atraso e some quando o filme real chega', async ({ page }) => {
    // TODO: page.route(`**/movie/${MOVIE_ID}*`, async (route) => { ... })
    //   dentro do handler:
    //   TODO: await new Promise((r) => setTimeout(r, 2000))  — atraso artificial
    //   TODO: await route.continue()  — deixa ir pra rede DE VERDADE, só depois do delay

    const detail = new DiscoverDetailPage(page);
    // TODO: await detail.goto(MOVIE_ID)
    // TODO: await detail.expectLoadingThenLoaded()
  });
});
