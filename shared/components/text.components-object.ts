import { Page } from '@playwright/test';
import { BaseComponentObject } from '../components';

export class TextComponentObject extends BaseComponentObject {
  constructor(page: Page, locator: string) {
    super(page, locator);
  }
}
