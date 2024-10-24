import { test, expect } from '@playwright/test'

test('JSS Site Is Up and Running', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000');
  await expect(page.getByRole('heading', { name: 'Welcome to Sitecore JSS' })).toBeVisible();
});

