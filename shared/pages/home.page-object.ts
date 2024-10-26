import { Page } from '@playwright/test';
import { TextComponentObject } from '../components';
import { BasePageObject } from './base.page-object';

export class HomePageObject extends BasePageObject {
  protected homePageTitle: TextComponentObject;
  constructor(page: Page) {
    super(page);
    this.homePageTitle = new TextComponentObject(page, 'h2.contentTitle');
  }
  async getHomePageTitle(): Promise<string> {
    var test = await this.homePageTitle.getTextContent();
    return test;
  }
}
