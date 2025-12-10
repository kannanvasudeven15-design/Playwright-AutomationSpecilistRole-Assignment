import { Page, expect } from '@playwright/test';

export class BasePage {
    async expectTextVisible(text: string, timeout = 5000) {
      await expect(this.page.getByText(text)).toBeVisible({ timeout });
    }
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    try {
      await this.page.goto(url);
    } catch (error) {
      console.error(`Failed to navigate to ${url}:`, error);
      throw error;
    }
  }

  async clickByRole(role: string, name: string, timeout = 50000, options?: { withinForm?: boolean }) {
    let element;
    if (options?.withinForm) {
      
      element = this.page.getByRole('form').locator('button[type="submit"]:has-text("' + name + '")');
    } else {
      element = this.page.getByRole(role as any, { name });
    }
    await expect(element).toBeVisible({ timeout });
    await expect(element).toBeEnabled({ timeout });
    await element.click();
  }

  async fillByRole(role: string, name: string, value: string) {
    const element = this.page.getByRole(role as any, { name });
    await element.fill(value);
  }

  async expectUrlMatch(regex: RegExp, timeout = 10000) {
    await expect(this.page).toHaveURL(regex, { timeout });
  }

  async getValidationMessageForTextbox(name: string): Promise<string> {
    const input = await this.page.getByRole('textbox', { name });
    return input.evaluate((el) => (el instanceof HTMLInputElement ? el.validationMessage : ''));
  }
}
