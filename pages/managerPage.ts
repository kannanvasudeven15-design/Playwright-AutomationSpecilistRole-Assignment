// ManagerPage: Playwright POM for Bank Manager actions
import { BasePage } from './basePage';
import { Page, expect } from '@playwright/test';

export class ManagerPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async loginAsManager() {
    await this.clickByRole('button', 'Bank Manager Login');
    await this.expectUrlMatch(/BankingProject\/\#\/manager/);
  }

  async clickAddCustomer() {
    // Use strict mode safe selector for Add Customer button inside form
    await this.clickByRole('button', 'Add Customer', 50000, { withinForm: true });
    await this.expectUrlMatch(/BankingProject\/\#\/manager\/addCust/);
  }

  async clickOpenAccount() {
    await this.clickByRole('button', 'Open Account');
    await this.expectUrlMatch(/BankingProject\/\#\/manager\/openAccount/);
  }

  async clickCustomers() {
    await this.clickByRole('button', 'Customers');
    await this.expectUrlMatch(/BankingProject\/\#\/manager\/list/);
  }

  async fillCustomerDetails(firstName: string, lastName: string, postCode: string) {
    await this.fillByRole('textbox', 'First Name', firstName);
    await this.fillByRole('textbox', 'Last Name', lastName);
    await this.fillByRole('textbox', 'Post Code', postCode);
  }

  async processOpenAccount(customer: string, currency: string) {
    await this.page.getByRole('combobox', { name: 'Customer' }).selectOption({ label: customer });
    await this.page.getByRole('combobox', { name: 'Currency' }).selectOption({ label: currency });
    await this.clickByRole('button', 'Process');
  }

  async getAllCurrencies(): Promise<string[]> {
    const currencyOptions = await this.page.getByRole('combobox', { name: 'Currency' }).locator('option').allTextContents();
    return currencyOptions;
  }
  async selectCustomer(name: string) {
    await this.page.getByRole('combobox', { name: 'Customer' }).selectOption({ label: name });
  }

  async selectCurrency(currency: string) {
    await this.page.getByRole('combobox', { name: 'Currency' }).selectOption({ label: currency });
  }

  async clickProcess() {
    await this.clickByRole('button', 'Process');
  }
}
