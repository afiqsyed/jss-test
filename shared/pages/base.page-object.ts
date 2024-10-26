import { Locator, Page } from '@playwright/test';
import { TextComponentObject } from '../components';
import { APPLICATION_BASE_URL } from '../urls';

export class BasePageObject {  
  constructor(protected page: Page) {
  }

  async navigateToHome(): Promise<void> {
    await this.page.goto(APPLICATION_BASE_URL);
    await this.waitForNetworkIdle();
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForNavigation() {
    await this.page.waitForNavigation();
  }

  getByText(text: string): Locator {
    return this.page.getByText(text);
  }

  async reloadPage(): Promise<void> {
    await this.page.reload();
  }

  async getPageUrl(): Promise<string> {
    await this.waitForNavigation();
    return this.page.url();
  }
}
