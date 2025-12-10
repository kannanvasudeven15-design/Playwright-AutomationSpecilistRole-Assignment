import { test, expect } from '@playwright/test';


test.describe('Bank Manager Customer Page Visual Test', () => {
  test('should navigate to Customer page and take screenshot', async ({ page }) => {
    
    // Navigate to login page
    await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
   
    // Click on Bank Manager Login (role-based selector)
    await page.getByRole('button', { name: 'Bank Manager Login' }).click();
    
    // Wait for navigation to manager dashboard
    await expect(page.getByRole('button', { name: 'Add Customer' })).toBeVisible({ timeout: 5000 });
    
    // Click on Customers button
    await page.getByRole('button', { name: 'Customers' }).click();
    
    // Wait for Customer table to be visible
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 });

   
    // Take screenshot of Customer page for Visual test
    await expect(page).toHaveScreenshot('customer-page.png', { fullPage: true });
    
    // Click on Add Customer and add details
    await page.getByRole('button', { name: 'Add Customer' }).click();
    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Duke');
    await page.getByPlaceholder('Post Code').fill('WN50JR');
    await page.locator('form').getByRole('button', { name: 'Add Customer' }).click();

    // Click on Customers button
    await page.getByRole('button', { name: 'Customers' }).click();

    // Scroll the customer table into view to ensure the newly added customer is visible
    const customerTable = await page.getByRole('table');
    await customerTable.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    

    //Compare screenshot after adding customer
    await expect(page).toHaveScreenshot('customer-page.png', { fullPage: true }); 

  });
});
