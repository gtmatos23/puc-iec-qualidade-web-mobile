import { test, expect } from '@playwright/test';

test('codegen test', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByTestId('login-email-input').click();
  await page.getByTestId('auth-mode-toggle').click();
  await page.getByTestId('register-name-input').click();
  await page.getByTestId('register-name-input').press('CapsLock');
  await page.getByTestId('register-name-input').fill('G');
  await page.getByTestId('register-name-input').press('CapsLock');
  await page.getByTestId('register-name-input').fill('Gustav');
  await page.getByTestId('register-name-input').press('Tab');
  await page.getByTestId('register-email-input').fill('npx playwright codegen http://localhost:4173/qa');
  await page.getByTestId('register-email-input').press('ControlOrMeta+z');
  await page.getByTestId('register-email-input').fill('1669372@pucminas.edu.br');
  await page.getByTestId('register-password-input').click();
  await page.getByTestId('register-password-input').fill('123456');
  await page.getByTestId('register-submit-button').click();
  await page.getByTestId('discover-search-input').click();
  await page.getByTestId('discover-search-input').press('CapsLock');
  await page.getByTestId('discover-search-input').fill('F');
  await page.getByTestId('discover-search-input').press('CapsLock');
  await page.getByTestId('discover-search-input').fill('Filme');
  await page.getByTestId('discover-search-input').press('Enter');
});