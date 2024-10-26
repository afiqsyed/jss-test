import { expect } from '@playwright/test';
import { test } from '../shared/fixtures/fixture.test';

test('Verify JSS Site Is Up and Running', async ({ homePage, headerPage }) => {
  await test.step('verify home page is up and running', async () => {
    await homePage.navigateToHome();
    expect(await homePage.getHomePageTitle()).toEqual('Welcome to Sitecore JSS');
  });

  await test.step('should open each of the navigation menu header', async () => {
    
    const menuItems = {
      documentation: 'Documentation',
      styleguide: 'Styleguide',
      graphql: 'GraphQL'
    };
    
    await headerPage.clickMenuItem(menuItems.styleguide);
    expect(await homePage.getPageUrl()).toContain('\/styleguide');

    await homePage.navigateToHome();
    
    await headerPage.clickMenuItem(menuItems.graphql);
    expect(await homePage.getPageUrl()).toContain('\/graphql');

  });
});
