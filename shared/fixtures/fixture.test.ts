import { Page, test as baseTest } from '@playwright/test';
import { HomePageObject } from '../pages/home.page-object';
import { HeaderPageObject } from '../pages/header.page-object';

export interface TestsFixtures {
    homePage: HomePageObject;
    headerPage: HeaderPageObject;
}

export const test = baseTest.extend<TestsFixtures>({ 
    homePage: ({ page }, use) => createPageFixture(page, use, () => new HomePageObject(page)),
    headerPage: ({ page }, use) => createPageFixture(page, use, () => new HeaderPageObject(page)),
});

async function createPageFixture<T>(page: Page, use: (r: T) => Promise<void>, factory: (p: any) => T): Promise<T> {
    const po = factory(page);
    await use(po);
    return po;
}
