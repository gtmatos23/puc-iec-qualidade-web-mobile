// tests/e2e-bonus/pages/DiscoverDetailPage.ts
// ─────────────────────────────────────────────────────────────────────────────
// 🎁 BÔNUS — Page Object da tela de detalhe do Discover (dado real do TMDB).
// Encapsula os locators e a sequência "loading → conteúdo real" — o spec
// não deve conhecer testID nenhum, só chamar métodos daqui.
// ─────────────────────────────────────────────────────────────────────────────

import { type Page, type Locator, expect } from '@playwright/test';

export class DiscoverDetailPage {
  readonly page: Page;
  readonly loading: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    // TODO: aponte pro testID discover-detail-loading
    this.loading = page.getByTestId('TODO');
    // TODO: aponte pro testID discover-detail-title
    this.title = page.getByTestId('TODO');
  }

  async goto(movieId: number) {
    // TODO: navegue pra `/discover/${movieId}`
  }

  // Prova as DUAS pontas do loader: apareceu (não foi rápido demais pra
  // existir) E sumiu (não ficou girando pra sempre quando o dado chegou).
  async expectLoadingThenLoaded() {
    // TODO: espere this.loading ficar visível (toBeVisible)
    // TODO: espere this.loading SUMIR (toBeHidden) — só depois do delay que o teste injetou
    // TODO: espere this.title ficar visível
  }
}
