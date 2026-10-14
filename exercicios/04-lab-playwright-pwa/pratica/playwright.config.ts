import { defineConfig, devices } from '@playwright/test';

// Os testes rodam contra o BUILD (vite preview), não contra o dev server —
// Service Worker só existe no build, e os desafios de PWA/offline dependem dele.
//
// Porta 4174 (e não 4173): este lab tem a própria porta. Assim ele nunca
// "reaproveita" um servidor de outro lab que ficou aberto no seu computador.
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['json', { outputFile: 'playwright-results.json' }], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:4174',
    trace: 'on-first-retry',
    // Ver o teste rodando devagar: SLOWMO=800 npx playwright test --headed
    launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4174',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    // 1º: o setup loga UMA vez pela UI e salva o storageState.
    { name: 'setup', testMatch: /auth\.setup\.ts/ },

    // 2º: os desafios rodam já autenticados, reaproveitando o estado salvo.
    // (Desafios que precisam começar DESLOGADOS zeram com test.use — veja o D2.)
    {
      name: 'chromium',
      testIgnore: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
});
