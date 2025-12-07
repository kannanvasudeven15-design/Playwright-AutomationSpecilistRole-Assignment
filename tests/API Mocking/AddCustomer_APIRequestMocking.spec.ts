import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const csvPath = path.resolve(__dirname, '../../test-data/APIRequest-TestData.csv');
const csvData = fs.readFileSync(csvPath, 'utf-8');

function parseCSV(data: string): Array<Record<string, string>> {
  const [header, ...rows] = data.trim().split('\n');
  const keys = header.split(',');
  return rows.map((row: string) => {
    const values = row.split(',');
    return keys.reduce((obj: Record<string, string>, key: string, i: number) => {
      obj[key] = values[i] === 'N/A' ? '' : values[i];
      return obj;
    }, {} as Record<string, string>);
  });
}

const testCases = parseCSV(csvData);

test.describe('API Mocking: Add Customer (CSV Driven)', () => {
  
  // Test 1: Success Response
  for (const tc of testCases.filter(tc => tc.expectedStatus === '201')) {
    test(`APIRequest Success for ${tc.firstName} ${tc.lastName}`, async ({ page }) => {
      await page.route('**/api/customers', async route => {
        const body = { message: tc.expectedAlert, customerId: 123 };
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(body) });
      });
      await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/addCust');
      await page.waitForSelector('input[ng-model="lName"]');
      await page.fill('input[ng-model="fName"]', tc.firstName);
      await page.fill('input[ng-model="lName"]', tc.lastName);
      await page.fill('input[ng-model="postCd"]', tc.postCode);
      await page.click('button[type=submit]');
      page.once('dialog', async dialog => {
        const alertMessage = dialog.message();
        expect(alertMessage).toContain(tc.expectedAlert);
        await dialog.accept();
        if (tc.expectedCustomerPresent === 'true') {
          await page.getByRole('button', { name: 'Customers' }).click();
          await expect(page).toHaveURL(/.*list/, { timeout: 5000 });
          const customerRow = await page.locator('table').locator('tbody tr').filter({ hasText: tc.firstName }).first();
          await expect(customerRow).toBeVisible({ timeout: 5000 });
          console.log(`Newly entered customer ${tc.firstName} is present in the customer list.`);
        }
      });
    });
  }

  // Test 2: Error Response
  for (const tc of testCases.filter(tc => tc.expectedStatus === '400')) {
    test(`APIRequest Error for ${tc.lastName} ${tc.postCode}`, async ({ page }) => {
      await page.route('**/api/customers', async route => {
        const body = { error: tc.expectedAlert };
        await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify(body) });
      });
      await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/addCust');
      await page.waitForSelector('input[ng-model="lName"]');
      // Intentionally leave first name blank
      await page.fill('input[ng-model="lName"]', tc.lastName);
      await page.fill('input[ng-model="postCd"]', tc.postCode);
      await page.click('button[type=submit]');
      const firstNameInput = await page.locator('input[ng-model="fName"]');
      const firstNameError = await firstNameInput.evaluate((input: HTMLInputElement) => input.validationMessage);
      expect(firstNameError).toBe(tc.expectedAlert);
    });
  }

  // Test 3: Duplicate Response
  for (const tc of testCases.filter(tc => tc.expectedStatus === '409')) {
    test(`APIRequest Duplicate for ${tc.firstName} ${tc.lastName}`, async ({ page }) => {
      await page.route('**/api/customers', async route => {
        const body = { message: tc.expectedAlert };
        await route.fulfill({ status: 409, contentType: 'application/json', body: JSON.stringify(body) });
      });
      await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/addCust');
      await page.waitForSelector('input[ng-model="lName"]');
      await page.fill('input[ng-model="fName"]', tc.firstName);
      await page.fill('input[ng-model="lName"]', tc.lastName);
      await page.fill('input[ng-model="postCd"]', tc.postCode);
      await page.click('button[type=submit]');
      page.once('dialog', async dialog => {
        const alertMessage = dialog.message();
        expect(alertMessage).toContain(tc.expectedAlert);
        await dialog.accept();
      });
    });
  }
});