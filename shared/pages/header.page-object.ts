import { Page } from '@playwright/test';
import { TextComponentObject } from '../components';
import { BasePageObject } from './base.page-object';

export class HeaderPageObject extends BasePageObject {
  protected menuItem: TextComponentObject;
  constructor(page: Page, locator = 'div.d-flex') {
    super(page);
    this.menuItem = new TextComponentObject(page, locator);
  }
  
  async clickMenuItem(menuText:string): Promise<void> {
    await this.menuItem.clickOnElement({selector: this.menuItemSelector(menuText)});
  }

  private menuItemSelector(menuText: string) {
    return `a.p-2.text-dark:has-text("${menuText}")`;
  }
}
