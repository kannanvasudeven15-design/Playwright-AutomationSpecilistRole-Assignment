import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('JIRA 1 - Create Customer', () => {
  test('Field validation scenario - should create a new customer and show success message', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
    await expect(page).toHaveURL(/BankingProject\/\#\/login/, { timeout: 10000 });

    // Click Bank Manager Login
    const managerLoginBtn = page.getByRole('button', { name: 'Bank Manager Login' });
    await expect(managerLoginBtn).toBeVisible({ timeout: 5000 });
    await managerLoginBtn.click();
    await expect(page).toHaveURL(/BankingProject\/\#\/manager/, { timeout: 10000 });

    // Click Add Customer Button
    const addCustomerBtn = page.getByRole('button', { name: 'Add Customer' });
    await expect(addCustomerBtn).toBeVisible({ timeout: 5000 });
    await addCustomerBtn.click();
    await expect(page).toHaveURL(/BankingProject\/\#\/manager\/addCust/, { timeout: 10000 });


    // 1. Fill only Last Name and Postcode. Attempt to submit the form without filling First Name.
    await page.getByRole('textbox', { name: 'First Name' }).fill('');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');
    await page.getByRole('textbox', { name: 'Post Code' }).fill('12345');
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Please fill out all the required fields!');
      console.log('Alert Text (no firstname):', dialog.message());
      await dialog.accept();
    });
    await page.getByRole('form').getByRole('button', { name: 'Add Customer' }).click();

    // 2. Fill only First Name and Postcode. Attempt to submit the form without filling Last Name.
    await page.getByRole('textbox', { name: 'First Name' }).fill('John');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('');
    await page.getByRole('textbox', { name: 'Post Code' }).fill('12345');
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Please fill out all the required fields!');
      console.log('Alert Text (no lastname):', dialog.message());
      await dialog.accept();
    });
    await page.getByRole('form').getByRole('button', { name: 'Add Customer' }).click();

    // 3. Fill only First Name and Last Name. Attempt to submit the form without filling Postcode.
    await page.getByRole('textbox', { name: 'First Name' }).fill('John');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');
    await page.getByRole('textbox', { name: 'Post Code' }).fill('');
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Please fill out all the required fields!');
      console.log('Alert Text (no postcode):', dialog.message());
      await dialog.accept();
    });
    await page.getByRole('form').getByRole('button', { name: 'Add Customer' }).click();
  });

  test('End to end flow scenario - should require firstname lastname postcode when adding customer', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
    await expect(page).toHaveURL(/BankingProject\/\#\/login/, { timeout: 10000 });

    // Verify header
    await expect(page.getByText('XYZ Bank')).toBeVisible({ timeout: 5000 });

    // Verify Home Button
    const homeBtn = page.getByRole('button', { name: 'Home' });
    await expect(homeBtn).toBeVisible({ timeout: 5000 });
    await expect(homeBtn).toHaveText('Home');

    // Verify Customer Login Button
    const customerLoginBtn = page.getByRole('button', { name: 'Customer Login' });
    await expect(customerLoginBtn).toBeVisible({ timeout: 5000 });
    await expect(customerLoginBtn).toHaveText('Customer Login');

    // Verify Bank Manager Login Button
    const managerLoginBtn = page.getByRole('button', { name: 'Bank Manager Login' });
    await expect(managerLoginBtn).toBeVisible({ timeout: 5000 });
    await expect(managerLoginBtn).toHaveText('Bank Manager Login');

    // Click Bank Manager Login
    await managerLoginBtn.click();
    await expect(page).toHaveURL(/BankingProject\/\#\/manager/, { timeout: 10000 });

    // Check for Add Customer Button
    const addCustomerBtn = page.getByRole('button', { name: 'Add Customer' });
    await expect(addCustomerBtn).toBeVisible({ timeout: 5000 });
    await addCustomerBtn.click();
    await expect(page).toHaveURL(/BankingProject\/\#\/manager\/addCust/, { timeout: 10000 });

    // Fill mandatory fields
    await page.getByRole('textbox', { name: 'First Name' }).fill('John');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');
    await page.getByRole('textbox', { name: 'Post Code' }).fill('12345');

    // Click Add Customer
    await page.getByRole('form').getByRole('button', { name: 'Add Customer' }).click();

      // Handle alert and capture text
      page.once('dialog', async dialog => {
        // Assert the alert message matches the expected format
        expect(dialog.message()).toMatch(/^Customer added successfully with customer id :\d+$/);
        // Extract and display the customer id from the alert text
        const match = dialog.message().match(/Customer added successfully with customer id :(\d+)/);
        if (match) {
          const customerId = match[1];
          console.log(`Customer added successfully. Customer ID: ${customerId}`);
        } else {
          console.log('Alert Text:', dialog.message());
        }
        await dialog.accept();
      });

    // Click Customers button
    const customersBtn = page.getByRole('button', { name: 'Customers' });
    await expect(customersBtn).toBeVisible({ timeout: 5000 });
    await customersBtn.click();
    await expect(page).toHaveURL(/BankingProject\/\#\/manager\/list/, { timeout: 10000 });

    // Verify newly added customer is present
    const customerFirstName = 'John';
    const customerLastName = 'Doe';
    const customerPostCode = '12345';
    const newCustomerRow = page.getByRole('row', { name: new RegExp(`${customerFirstName} ${customerLastName} ${customerPostCode}`) });
    await expect(newCustomerRow).toBeVisible({ timeout: 5000 });
    console.log(`'${customerFirstName} ${customerLastName}' is added to the Customer table.`);
  });

   test('Duplicate Customer scenario - should show duplicate message when customer already exists', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
    await expect(page).toHaveURL(/BankingProject\/\#\/login/, { timeout: 10000 });

    // Click Bank Manager Login
    const managerLoginBtn = page.getByRole('button', { name: 'Bank Manager Login' });
    await expect(managerLoginBtn).toBeVisible({ timeout: 5000 });
    await managerLoginBtn.click();
    await expect(page).toHaveURL(/BankingProject\/\#\/manager/, { timeout: 10000 });

    // Click Customers Button
    const customersBtn = page.getByRole('button', { name: 'Customers' });
    await expect(customersBtn).toBeVisible({ timeout: 5000 });
    await customersBtn.click();
    await expect(page).toHaveURL(/BankingProject\/\#\/manager\/list/, { timeout: 10000 });

    // Get all existing customer details
    const customerRows = await page.locator('table tbody tr').all();
    const existingCustomers = [];
    for (const row of customerRows) {
      const cells = await row.locator('td').allTextContents();
      if (cells.length >= 3) {
        existingCustomers.push({
          firstName: cells[0],
          lastName: cells[1],
          postCode: cells[2]
        });
      }
    }

    // Read customer details from config.json
    const configPath = path.resolve(__dirname, '../../config.json');
    const configRaw = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configRaw);
    const customersToTest = [config.existingCustomer, config.newCustomer];

    for (const customer of customersToTest) {
      const isDuplicate = existingCustomers.some(c =>
        c.firstName === customer.firstName &&
        c.lastName === customer.lastName &&
        c.postCode === customer.postCode
      );

      // Click Add Customer button
      const addCustomerBtn = page.getByRole('button', { name: 'Add Customer' });
      await expect(addCustomerBtn).toBeVisible({ timeout: 5000 });
      await addCustomerBtn.click();
      await expect(page).toHaveURL(/BankingProject\/\#\/manager\/addCust/, { timeout: 10000 });

      // Fill customer details
      await page.getByRole('textbox', { name: 'First Name' }).fill(customer.firstName);
      await page.getByRole('textbox', { name: 'Last Name' }).fill(customer.lastName);
      await page.getByRole('textbox', { name: 'Post Code' }).fill(customer.postCode);

      // Register dialog handler before clicking the button
      page.once('dialog', async dialog => {
        if (isDuplicate) {
          expect(dialog.message()).toBe('Please check the details. Customer may be duplicate.');
          console.log(`Customer '${customer.firstName} ${customer.lastName}' is already existing in the customer table.`);
        } else {
          expect(dialog.message()).toMatch(/^Customer added successfully with customer id :\d+$/);
          console.log(`Customer '${customer.firstName} ${customer.lastName}' added successfully.`);
        }
        await dialog.accept();
      });
      await page.getByRole('form').getByRole('button', { name: 'Add Customer' }).click();

      // Go back to Customers page for next iteration
      await page.getByRole('button', { name: 'Customers' }).click();
      await expect(page).toHaveURL(/BankingProject\/\#\/manager\/list/, { timeout: 10000 });
    }

    // All customer addition and duplicate detection logic is handled in the loop above.
  });
});

