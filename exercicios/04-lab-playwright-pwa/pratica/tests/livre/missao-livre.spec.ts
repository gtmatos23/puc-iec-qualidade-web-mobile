import { test, expect } from '@playwright/test';

test.describe('Missão livre — comentários no detalhe do filme', () => {
  test('feliz: deve postar um comentário em um filme e exibi-lo imediatamente na lista', async ({ page }) => {
    await page.goto('/movie/603');
    await expect(page.getByTestId('detail-title')).toHaveText('Matrix');

    await page.getByTestId('comment-input').fill('Uma história que continua atual.');
    await page.getByTestId('comment-submit-button').click();

    const comment = page.locator('[data-testid^="comment-item-"]').first();
    await expect(comment).toContainText('Uma história que continua atual.');
    await expect(page.locator('[data-testid^="comment-item-"]')).toHaveCount(1);
  });

  test('negativo: não deve permitir submeter comentário em branco ou com erro simulado de rede (botão desabilitado ou mensagem de erro)', async ({
    page,
  }) => {
    await page.goto('/movie/603');
    await expect(page.getByTestId('detail-title')).toHaveText('Matrix');

    const input = page.getByTestId('comment-input');
    const submit = page.getByTestId('comment-submit-button');
    await expect(submit).toBeDisabled();

    await input.fill('   ');
    await expect(submit).toBeDisabled();
    await expect(page.getByTestId('comments-empty')).toBeVisible();
    await expect(page.locator('[data-testid^="comment-item-"]')).toHaveCount(0);
  });

  test('borda: deve tratar comentário longo no limite de caracteres ou caracteres especiais (XSS/emojis) sem quebrar o layout', async ({
    page,
  }) => {
    const prefix = '<script>alert(1)</script> ';
    const comment = `${prefix}${'😀'.repeat((280 - prefix.length) / 2)}`;
    expect(comment).toHaveLength(280);

    await page.goto('/movie/603');
    await expect(page.getByTestId('detail-title')).toHaveText('Matrix');

    const input = page.getByTestId('comment-input');
    await expect(input).toHaveAttribute('maxlength', '280');
    await input.fill(comment);
    await expect(input).toHaveValue(comment);
    await page.getByTestId('comment-submit-button').click();

    const commentText = page.locator('[data-testid^="comment-item-"]').first().locator('p');
    await expect(commentText).toBeVisible();
    await expect(commentText).toHaveText(comment);
  });
});
