import { test, expect } from '@playwright/test'

test.beforeAll(async ({page}) => {
  await page.goto('https://xmc-monitors-2200.vercel.app/forms');
});

test('Can Submit Form Successfully', async ({ page }) => {
  
  // Fill Up Full Name
  await page.getByPlaceholder('Full name').fill('Test Name');
  // Fill Up Email
  await page.getByPlaceholder('Email').fill('test@example.com');
  // Fill Up Phone Number
  await page.getByLabel('Selected country').click();
  await page.getByPlaceholder('Search').fill('Malaysia');
  await page.getByText('Malaysia').click();
  await page.getByPlaceholder('Full name').fill('Test Name');
  await page.getByPlaceholder('-345 6789').fill('0123456789');
  // Press Submit
  await page.getByRole('button', { name: 'Get access today!' }).click();

  await expect(page.getByText('Form has been submitted')).toBeVisible({timeout: 10000});
});

test('Email Verification', async ({ page }) => {
  await page.getByPlaceholder('Full name').fill('Test Name');
  // Incomplete Email
  await page.getByPlaceholder('Email').fill('justEmail');
  await page.getByRole('button', { name: 'Get access today!' }).click();
  await expect(page.getByText('Email address must follow the')).toBeVisible({timeout: 10000});
});

test('Phone Validation', async ({ page }) => {
  await page.getByPlaceholder('Full name').fill('Test Name');
  await page.getByPlaceholder('Email').fill('test@example.com');
  // Incomplete Phone Number
  await page.getByPlaceholder('-345 6789').fill('02222');
  await page.getByRole('button', { name: 'Get access today!' }).click();
  await expect(page.getByText('Phone number must follow the')).toBeVisible({timeout: 10000});
});

