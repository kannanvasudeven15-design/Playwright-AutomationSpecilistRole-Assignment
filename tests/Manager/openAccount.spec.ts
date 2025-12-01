import { test, expect } from '@playwright/test';
import { getTestData } from '../../utils/csvUtils';


test.describe('JIRA 2 - Open Customer Account', () => {
  const testData: { [key: string]: string }[] = getTestData();
  testData.forEach((data) => {
    const Name = data['Name'];
    const Currency = data['Currency'];
    test(`Test 1: Open Customer Account - should create account for ${Name} with ${Currency} currency and update Customer Record`, async ({ page }) => {
     
      // Navigate to login page
      await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
     
      // Click Bank Manager Login
      await page.getByRole('button', { name: 'Bank Manager Login' }).click();
      await expect(page).toHaveURL(/.*manager/, { timeout: 5000 });
      
      // Click Open Account
      await page.getByRole('button', { name: 'Open Account' }).click();
      await expect(page).toHaveURL(/.*openAccount/, { timeout: 5000 });
      
      // Select customer and currency from test data
      await page.locator('select').first().selectOption({ label: Name });
      await page.locator('select').nth(1).selectOption({ label: Currency });
     
      // Click Process and handle alert
      page.once('dialog', async dialog => {
        const message = dialog.message();
        expect(message).toMatch(/Account created successfully with account Number :\d+/);
        const accountNumber = message.match(/Account Number :(\d+)/)?.[1];
        console.log(`Alert message: ${message}`);
        if (accountNumber) {
          console.log(`Account number ${accountNumber} has been added for the customer ${Name}.`);
        }
        await dialog.accept();
      });
      await page.getByRole('button', { name: 'Process' }).click();
      
      // Click Customers button
      await page.getByRole('button', { name: 'Customers' }).click();
      await expect(page).toHaveURL(/.*list/, { timeout: 5000 });
      
      // Find customer row and verify account number
      const row = await page.locator('table').locator('tbody tr').filter({ hasText: Name }).first();
      const accountCell = await row.locator('td').nth(3).textContent();
      expect(accountCell).toMatch(/\d+/);
      console.log(`Account number(s) for ${Name}: ${accountCell}`);
    });
  });

  test('Test 2: Verify available currencies - should list all available currencies', async ({ page }) => {
  
    // Navigate to login page
    await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
   
    // Click Bank Manager Login
    await page.getByRole('button', { name: 'Bank Manager Login' }).click();
    await expect(page).toHaveURL(/.*manager/, { timeout: 5000 });

    // Click Open Account
    await page.getByRole('button', { name: 'Open Account' }).click();
    await expect(page).toHaveURL(/.*openAccount/, { timeout: 5000 });

    // Get all currency values using live selector
    const currencyOptions = await page.locator('select').nth(1).locator('option').allTextContents();

    // Filter out placeholder
    const currencies = currencyOptions.filter(c => c !== '---Currency---');

    // Assert expected currencies with timeout
    expect(currencies.length).toBeGreaterThan(0);
    expect(currencies).toEqual(expect.arrayContaining(['Dollar', 'Pound', 'Rupee']));

    // Display currencies in console
    console.log('Available currencies under Currency field:');
    currencies.forEach(c => console.log(c));

  });
});
