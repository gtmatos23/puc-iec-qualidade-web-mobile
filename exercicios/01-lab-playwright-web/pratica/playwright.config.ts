import { defineConfig, devices } from '@playwright/test';

// Os testes rodam contra o BUILD (vite preview), não contra o dev server —
// Service Worker só existe no build, e o app é uma PWA.
//
// Porta 4173 (o Lab Playwright PWA usa a 4174): cada lab tem a sua. Se esta porta já estiver
// ocupada por outro servidor seu, o Playwright reaproveita o servidor errado — feche-o antes.
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['json', { outputFile: 'playwright-results.json' }], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    // Ver o teste rodando devagar: SLOWMO=800 npx playwright test --headed
    launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    // 1º: o setup loga UMA vez pela UI e salva o storageState.
    { name: 'setup', testMatch: /auth\.setup\.ts/ },

    // 2º: o teste roda já autenticado, reaproveitando o estado salvo.
    {
      name: 'chromium',
      testIgnore: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
});
