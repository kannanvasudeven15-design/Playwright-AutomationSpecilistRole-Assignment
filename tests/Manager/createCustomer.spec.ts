import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { readExcel, Customer } from '../../utils/excelUtils';
import { readCsvSets, CustomerSet } from '../../utils/csvUtils';

test.describe('JIRA 1 - Create Customer', () => {

test('Test 1: End to End Flow scenario - should create a new customer and show success message', async ({ page }) => {
  // Read test data from Excel
  const excelPath = path.resolve(__dirname, '../../test-data/AddNewCusotmer_TestData.xlsx');
  const customers = readExcel(excelPath);

  for (const customerRaw of customers) {
    const customer = customerRaw as Customer;
    // Navigate to login page
    await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
    await expect(page).toHaveURL(/BankingProject\/\#\/login/, { timeout: 10000 });
    const managerLoginBtn = page.getByRole('button', { name: 'Bank Manager Login' });
    await expect(managerLoginBtn).toBeVisible({ timeout: 5000 });
    await managerLoginBtn.click();
    await expect(page).toHaveURL(/BankingProject\/\#\/manager/, { timeout: 10000 });
    const addCustomerBtn = page.getByRole('button', { name: 'Add Customer' });
    await expect(addCustomerBtn).toBeVisible({ timeout: 5000 });
    await addCustomerBtn.click();
    await expect(page).toHaveURL(/BankingProject\/\#\/manager\/addCust/, { timeout: 10000 });
    await page.getByRole('textbox', { name: 'First Name' }).fill(customer.firstName);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(customer.lastName);
    await page.getByRole('textbox', { name: 'Post Code' }).fill(customer.postCode);
    page.once('dialog', async dialog => {
      expect(dialog.message()).toMatch(/^Customer added successfully with customer id :\d+$/);
      const match = dialog.message().match(/Customer added successfully with customer id :(\d+)/);
      if (match) {
        const customerId = match[1];
        console.log(`Customer added successfully. Customer ID: ${customerId}`);
      } else {
        console.log('Alert Text:', dialog.message());
      }
      await dialog.accept();
    });
    await page.getByRole('form').getByRole('button', { name: 'Add Customer' }).click();

    // Click Customers button and verify
    const customersBtn = page.getByRole('button', { name: 'Customers' });
    await expect(customersBtn).toBeVisible({ timeout: 5000 });
    await customersBtn.click();
    await expect(page).toHaveURL(/BankingProject\/\#\/manager\/list/, { timeout: 10000 });
    const customerRowSelector = `tr:has(td:text-is("${customer.firstName}")):has(td:text-is("${customer.lastName}")):has(td:text-is("${customer.postCode}"))`;
    const newCustomerRow = page.locator(customerRowSelector);
    await expect(newCustomerRow).toBeVisible({ timeout: 5000 });
    console.log(`'${customer.firstName} ${customer.lastName}' is present in the Customer table.`);
  }
});

test('Test 2: Duplicate Customer scenario - should show duplicate message when customer already exists', async ({ page }) => {
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

    // Read customer details from test-data/duplicateCustomer-TestData.json
    const testDataPath = path.resolve(__dirname, '../../test-data/duplicateCustomer-TestData.json');
    const testDataRaw = fs.readFileSync(testDataPath, 'utf-8');
    const testData = JSON.parse(testDataRaw);
    const customersToTest = Object.values(testData);

    for (const customer of customersToTest) {
      const cust = customer as { firstName: string; lastName: string; postCode: string };
      const isDuplicate = existingCustomers.some(c =>
        c.firstName === cust.firstName &&
        c.lastName === cust.lastName &&
        c.postCode === cust.postCode
      );

      // Click Add Customer button
      const addCustomerBtn = page.getByRole('button', { name: 'Add Customer' });
      await expect(addCustomerBtn).toBeVisible({ timeout: 5000 });
      await addCustomerBtn.click();
      await expect(page).toHaveURL(/BankingProject\/\#\/manager\/addCust/, { timeout: 10000 });

      // Fill customer details
      await page.getByRole('textbox', { name: 'First Name' }).fill(cust.firstName);
      await page.getByRole('textbox', { name: 'Last Name' }).fill(cust.lastName);
      await page.getByRole('textbox', { name: 'Post Code' }).fill(cust.postCode);

      // Register dialog handler before clicking the button
      page.once('dialog', async dialog => {
        if (isDuplicate) {
          expect(dialog.message()).toBe('Please check the details. Customer may be duplicate.');
          console.log(`Customer '${cust.firstName} ${cust.lastName}' is already existing in the customer table.`);
        } else {
          expect(dialog.message()).toMatch(/^Customer added successfully with customer id :\d+$/);
          console.log(`Customer '${cust.firstName} ${cust.lastName}' added successfully.`);
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
  
test('Test 3: Field validation scenario - should require firstname lastname postcode for adding customer', async ({ page }) => {
  const csvPath = path.resolve(__dirname, '../../test-data/AddCustomerFieldValidation.csv');
  const customerSets = readCsvSets(csvPath);

  for (const customerData of customerSets) {
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
    await page.getByRole('textbox', { name: 'Last Name' }).fill(customerData['Last Name']);
    await page.getByRole('textbox', { name: 'Post Code' }).fill(customerData['Post Code']);
    await page.getByRole('form').getByRole('button', { name: 'Add Customer' }).click();
    const firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    const firstNameError = await firstNameInput.evaluate(input => (input as HTMLInputElement).validationMessage);
    expect(firstNameError).toBe('Please fill in this field.');

    // 2. Fill only First Name and Postcode. Attempt to submit the form without filling Last Name.
    await page.getByRole('textbox', { name: 'First Name' }).fill(customerData['First Name']);
    await page.getByRole('textbox', { name: 'Last Name' }).fill('');
    await page.getByRole('textbox', { name: 'Post Code' }).fill(customerData['Post Code']);
    await page.getByRole('form').getByRole('button', { name: 'Add Customer' }).click();
    const lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    const lastNameError = await lastNameInput.evaluate(input => (input as HTMLInputElement).validationMessage);
    expect(lastNameError).toBe('Please fill in this field.');

    // 3. Fill only First Name and Last Name. Attempt to submit the form without filling Postcode.
    await page.getByRole('textbox', { name: 'First Name' }).fill(customerData['First Name']);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(customerData['Last Name']);
    await page.getByRole('textbox', { name: 'Post Code' }).fill('');
    await page.getByRole('form').getByRole('button', { name: 'Add Customer' }).click();
    const postCodeInput = page.getByRole('textbox', { name: 'Post Code' });
    const postCodeError = await postCodeInput.evaluate(input => (input as HTMLInputElement).validationMessage);
    expect(postCodeError).toBe('Please fill in this field.');
  }
});


});

