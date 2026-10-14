import { defineConfig, devices } from '@playwright/test';

// Os testes GERADOS pelo pipeline rodam contra o CineFav Web (Lab Playwright PWA).
// Pré-requisito: ter instalado o Lab Playwright PWA antes
//   cd ../../04-lab-playwright-pwa/pratica && npm ci
export default defineConfig({
  testDir: './generated',
  timeout: 30_000,
  reporter: [['json', { outputFile: 'results.json' }], ['list']],
  use: {
    baseURL: 'http://localhost:4174',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm --prefix ../../04-lab-playwright-pwa/pratica run build && npm --prefix ../../04-lab-playwright-pwa/pratica run preview',
    url: 'http://localhost:4174',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
