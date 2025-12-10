import { test, expect } from '@playwright/test';


test.describe('Bank Manager Open Account Page Visual Test', () => {
  test('should navigate to Open Account page and take screenshot', async ({ page }) => {
    
    // Navigate to login page
    await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
   
    // Click on Bank Manager Login (role-based selector)
    await page.getByRole('button', { name: 'Bank Manager Login' }).click();
    
    // Wait for navigation to manager dashboard
    await expect(page.getByRole('button', { name: 'Open Account' })).toBeVisible({ timeout: 5000 });
    
    // Click on Customers button
    await page.getByRole('button', { name: 'Customers' }).click();
    
    // Wait for Customer table to be visible
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 });

    // Take screenshot of Customer page for Visual test
    await expect(page).toHaveScreenshot('customer-account-page.png', { fullPage: true });

    //Click on Open Account button
    await page.getByRole('button', { name: 'Open Account' }).click();

    // Wait for Open Account form to be visible
    await expect(page.getByRole('form')).toBeVisible({ timeout: 5000 });

    // Select Harry Potter as Customer
    await page.locator('label:text("Customer :") + select').selectOption({ label: 'Harry Potter' });

    // Select Rupee as Currency
    await page.locator('label:text("Currency :") + select').selectOption({ label: 'Rupee' });

    // Listen for dialog and accept it
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Account created successfully');
      await dialog.accept();
    });

    // Click on Process button
    await page.getByRole('button', { name: 'Process' }).click();

    // Click on Customers button
    await page.getByRole('button', { name: 'Customers' }).click();
    
    // Wait for Customer table to be visible
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 });
    
    // Compare the  screenshot
    await expect(page).toHaveScreenshot('customer-account-page.png', { fullPage: true });
  });
});
