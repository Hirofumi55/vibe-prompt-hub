import { expect, test, type Page } from '@playwright/test';

async function loadWithActiveServiceWorker(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    await navigator.serviceWorker.ready;
    return Boolean(navigator.serviceWorker.controller);
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('ホームのカテゴリカードから絞り込み済み一覧へ遷移できる', async ({ page }) => {
  const category = 'コードレビュー';

  await loadWithActiveServiceWorker(page, '/');
  await page.locator(`[data-home-category-card="${category}"]`).click();

  await expect(page).toHaveURL(/\/prompts\/\?category=/);
  await expect(page.getByRole('heading', { name: 'プロンプト一覧' })).toBeVisible();
  await expect(page.locator(`[data-filter-category][data-value="${category}"][data-active="true"]`)).toBeVisible();

  const currentUrl = new URL(page.url());
  expect(currentUrl.pathname).toBe('/prompts/');
  expect(currentUrl.searchParams.get('category')).toBe(category);
});

test('一覧の詳細リンクから個別ページへ遷移できる', async ({ page }) => {
  await loadWithActiveServiceWorker(page, '/prompts/');

  const detailLink = page.locator('[data-prompt-detail-link]').first();
  const href = await detailLink.getAttribute('href');

  expect(href).toBeTruthy();
  await detailLink.click();

  await expect(page).toHaveURL(new RegExp(escapeRegExp(href ?? '')));
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: /このプロンプトをコピー/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: '関連プロンプト' })).toBeVisible();
});

test('コピーとお気に入り保存が localStorage に反映される', async ({ page }) => {
  await page.goto('/prompts/');
  await page.waitForLoadState('networkidle');

  const firstCard = page.locator('[data-prompt-card]').first();
  const promptId = await firstCard.getAttribute('data-prompt-id');
  const copyButton = firstCard.locator('[data-copy-prompt]');
  const favoriteButton = firstCard.locator('[data-favorite-button]');

  expect(promptId).toBeTruthy();

  await copyButton.click();
  await expect(page.locator('#app-toast-message')).toContainText('コピーしました');

  const recent = await page.evaluate(() => JSON.parse(localStorage.getItem('prompt-hub:recent') ?? '[]'));
  expect(recent[0]).toBe(promptId);

  await favoriteButton.click();
  await expect(page.locator('#app-toast-message')).toContainText('お気に入りに追加しました');

  const favorites = await page.evaluate(() => JSON.parse(localStorage.getItem('prompt-hub:favorites') ?? '[]'));
  expect(favorites).toContain(promptId);
});
