import { Locator, Page, expect } from '@playwright/test'

export class EligibilityPage {
  readonly page: Page
  readonly residentialYes: Locator
  readonly residentialNo: Locator
  readonly categorical: Locator
  readonly previouslyEnrolled: Locator
  readonly adjunctive: Locator

  constructor(page: Page) {
    this.page = page
    this.residentialYes = page.locator('[for=residential-yes]')
    this.residentialNo = page.locator('[for=residential-no]')
    //   this.getStartedLink = page.locator('a', { hasText: 'Get started' });
    //   this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });
    //   this.pomLink = page.locator('li', { hasText: 'Guides' }).locator('a', { hasText: 'Page Object Model' });
    //   this.tocList = page.locator('article div.markdown ul > li > a');
  }

  async goto() {
    await this.page.goto('/eligibility')
  }

  async fillResidential(yes: boolean) {
    if (yes) {
      await this.residentialYes.click()
    } else {
      await this.residentialNo.click()
    }
  }
  async fillCategorical() {}
  async fillPreviouslyEnrolled() {}
  async fillAdjunctiveMatch() {}
  async fillAdjunctiveNone() {}
  async fillAllMatch() {}
  async fillAllNone() {}
  async fillAndSubmit() {}

  // async getStarted() {
  //   await this.getStartedLink.first().click();
  //   await expect(this.gettingStartedHeader).toBeVisible();
  // }

  // async pageObjectModel() {
  //   await this.getStarted();
  //   await this.pomLink.click();
  // }
}
