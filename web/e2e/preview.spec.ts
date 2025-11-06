import { test, expect } from '@playwright/test';

test('home renders and shows starter text', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('To get started, edit the page.tsx file.')).toBeVisible();
});

// Checks the NextAuth signin endpoint responds (no actual login)
test('signin endpoint is reachable', async ({ request }) => {
  const res = await request.get('/api/auth/signin');
  expect(res.status()).toBeLessThan(500);
});
