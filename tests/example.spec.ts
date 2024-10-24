import { test, expect } from '@playwright/test'

test('JSS Site Is Up and Running', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.getByRole('heading', { name: 'Welcome to Sitecore JSS' })).toBeVisible();
});

