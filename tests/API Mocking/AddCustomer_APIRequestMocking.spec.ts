import { test, expect } from '@playwright/test';

test.describe('API Mocking: Add Customer', () => {
  test('Test 1: APIRequest Mock Success Response - create customer shows success message when API returns success', async ({ page }) => {
    await page.route('**/api/customers', async route => {
      const body = { message: 'Customer added successfully with customer id :123', customerId: 123 };
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(body) });
    });

    await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/addCust');
    await page.waitForSelector('input[ng-model="fName"]');
    await page.fill('input[ng-model="fName"]', 'Mike');
    await page.fill('input[ng-model="lName"]', 'Wilson');
    await page.fill('input[ng-model="postCd"]', 'WN1 1AA');
    await page.click('button[type=submit]');

    let alertMessage = '';
    page.once('dialog', async dialog => {
      alertMessage = dialog.message();
      expect(alertMessage).toContain('Customer added successfully with customer id :123');
      const customerId = alertMessage.match(/customer id :(\d+)/)?.[1];
      if (customerId) {
        console.log(`Alert message: ${alertMessage}`);
        console.log(`Customer ID captured: ${customerId}`);
      }
      await dialog.accept();

      // Click Customers button and validate new customer
      await page.getByRole('button', { name: 'Customers' }).click();
      await expect(page).toHaveURL(/.*list/, { timeout: 5000 });
      
      // Validate newly entered customer is present
      const customerRow = await page.locator('table').locator('tbody tr').filter({ hasText: 'Subathra' }).first();
      await expect(customerRow).toBeVisible({ timeout: 5000 });
      console.log('Newly entered customer Subathra is present in the customer list.');
    });
  });

  test('Test 2: APIRequest Mock Error Response - create customer shows validation error when API returns 400', async ({ page }) => {
  await page.route('**/api/customers', async route => {
    const body = { error: 'First Name is required' };
    await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify(body) });
  });

  await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/addCust');
  // Intentionally leave first name blank
  await page.fill('input[ng-model="lName"]', 'Carr');
  await page.fill('input[ng-model="postCd"]', 'WN1 1AA');
  await page.click('button[type=submit]');

    const firstNameInput = await page.locator('input[ng-model="fName"]');
    const firstNameError = await firstNameInput.evaluate((input: HTMLInputElement) => input.validationMessage);
    expect(firstNameError).toBe('Please fill in this field.');
});

test('Test 3: APIRequest Mock duplicate customer response -  create customer shows duplicate message when API returns duplicate', async ({ page }) => {
  await page.route('**/api/customers', async route => {
    const body = { message: 'Please check the details. Customer may be duplicate.' };
    await route.fulfill({ status: 409, contentType: 'application/json', body: JSON.stringify(body) });
  });

  await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/addCust');
    await page.waitForSelector('input[ng-model="fName"]');
    await page.fill('input[ng-model="fName"]', 'Neville');
    await page.fill('input[ng-model="lName"]', 'Longbottom');
    await page.fill('input[ng-model="postCd"]', 'E89898');
    await page.click('button[type=submit]');

  page.once('dialog', async dialog => {
    const alertMessage = dialog.message();
    expect(alertMessage).toContain('Please check the details. Customer may be duplicate.');
    await dialog.accept();
  });
});

});
