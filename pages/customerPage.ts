import { Page } from '@playwright/test';

export class CustomerPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToCustomerLogin() {
    await this.page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
    await this.page.getByRole('button', { name: 'Customer Login' }).click();
  }

  async makeDeposit(amount: number) {
    await this.page.click('button[ng-click="deposit()"]');
    await this.page.fill('input[ng-model="amount"]', amount.toString());
    await this.page.click('button[type="submit"]');
  }

  async getDepositSuccessMessage() {
    return await this.page.textContent('.message'); // Replace with actual selector if needed
  }

  async withdrawAmount(amount: number) {
    await this.page.click('button[ng-click="withdrawl()"]');
    await this.page.fill('input[ng-model="amount"]', amount.toString());
    await this.page.click('button[type="submit"]');
  }

  async getBalance() {
    // Select the balance value after the 'Balance :' label
    const balanceValue = this.page.locator('text=Balance :').locator('xpath=following-sibling::strong[1]');
    if (await balanceValue.count() > 0) {
      return (await balanceValue.first().textContent())?.trim() || null;
    }
    // fallback: find the strong tag after 'Balance :' in the DOM structure
    const fallback = this.page.locator('//text()[contains(.,"Balance :")]/following-sibling::strong[1]');
    if (await fallback.count() > 0) {
      return (await fallback.first().textContent())?.trim() || null;
    }
    return null;
  }
}
