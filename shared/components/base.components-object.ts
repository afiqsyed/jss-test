import { Locator, Page } from '@playwright/test';

export class BaseComponentObject {
  constructor(
    protected page: Page,
    protected locator: string,
  ) {}

  async waitFor(options?: {
    state?: 'attached' | 'detached' | 'visible' | 'hidden';
    selector?: string;
    timeout?: number;
  }): Promise<void> {
    if (options?.selector) {
      await this.page
        .locator(`${this.locator} ${options?.selector}`)
        .waitFor({ state: options?.state, timeout: options?.timeout });
    } else {
      await this.page.locator(this.locator).waitFor({ state: options?.state, timeout: options?.timeout });
    }
  }

  async waitForAll(options?: {
    state?: 'attached' | 'detached' | 'visible' | 'hidden';
    selector?: string;
    timeout?: number;
  }): Promise<void> {
    await Promise.all(
      (await this.getListOfLocators({ selector: options?.selector })).map(async (locator) => {
        await locator.waitFor({ state: options?.state, timeout: options?.timeout });
      }),
    );
  }

  async getListOfLocators(options?: { selector?: string }): Promise<Locator[]> {
    let locators: Locator[];
    if (options?.selector) {
      locators = await this.page.locator(`${this.locator} ${options?.selector}`).all();
    } else {
      locators = await this.page.locator(this.locator).all();
    }
    return locators;
  }

  async hoverOnElement(options?: { selector?: string }): Promise<void> {
    if (options?.selector) {
      await this.page.locator(`${this.locator} ${options?.selector}`).hover();
    } else {
      await this.page.locator(this.locator).hover();
    }
  }

  async clickOnElement(options?: {
    selector?: string;
    force?: boolean;
    timeout?: number;
    scrollIntoView?: boolean;
  }): Promise<void> {
    let pageLocator = this.page.locator(this.locator);
    if (options?.selector) {
      pageLocator = this.page.locator(`${this.locator} ${options?.selector}`);
      if (options?.scrollIntoView) {
        await pageLocator.evaluate((x) => x.scrollIntoView());
      }
      await pageLocator.click({ force: options?.force, timeout: options?.timeout });
    } else {
      if (options?.scrollIntoView) {
        await pageLocator.evaluate((x) => x.scrollIntoView());
      }
      await pageLocator.click({ force: options?.force, timeout: options?.timeout });
    }
  }

  async getTextContent(options?: { selector?: string; timeout?: number }): Promise<string> {
    if (options?.selector) {
      return (await this.page.locator(`${options.selector}`).textContent({ timeout: options?.timeout })) as string;
    } else {
      return (await this.page.locator(this.locator).textContent({ timeout: options?.timeout })) as string;
    }
  }

  getLocatorByText(options: { text: string; selector?: string }): Locator {
    if (options.selector) {
      return this.page.locator(`${this.locator} ${options.selector}`).getByText(options.text);
    } else {
      return this.page.locator(this.locator).getByText(options.text);
    }
  }

  async getTextAndTrim(options?: { selector?: string; timeout?: number }): Promise<string> {
    const text = await this.getTextContent({ selector: options?.selector, timeout: options?.timeout });
    return text.trim();
  }

  isEnabled(options?: { selector?: string }): Promise<boolean> {
    if (options?.selector) {
      return this.page.locator(`${this.locator} ${options.selector}`).isEnabled();
    } else {
      return this.page.locator(this.locator).isEnabled();
    }
  }

  isVisible(options?: { selector?: string }): Promise<boolean> {
    if (options?.selector) {
      return this.page.locator(`${this.locator} ${options.selector}`).isVisible();
    } else {
      return this.page.locator(this.locator).isVisible();
    }
  }

  isHidden(options?: { selector?: string }): Promise<boolean> {
    if (options?.selector) {
      return this.page.locator(`${this.locator} ${options.selector}`).isHidden();
    } else {
      return this.page.locator(this.locator).isHidden();
    }
  }
}
