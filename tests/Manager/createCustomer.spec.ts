import { test, expect } from '../../fixture/pagesFixture';
import path from 'path';
import fs from 'fs';
import { readExcel } from '../../utils/excelUtils';
import { readCsvSets, CustomerSet } from '../../utils/csvUtils';
import { urls } from '../../utils/config';

test.describe('JIRA 1 - Create Customer', () => {

test('Test 1: End to End Flow scenario - should create a new customer and show success message', async ({ page, managerPage }) => {
  // Read test data from Excel
  const excelPath = path.resolve(process.cwd(), 'test-data/AddNewCusotmer_TestData.xlsx');
  const customers = readExcel(excelPath);

  for (const customer of customers) {
    await managerPage.goto(urls.login);
    await managerPage.expectUrlMatch(/BankingProject\/#\/login/);
    await page.getByRole('button', { name: 'Home' }).click();
    await managerPage.loginAsManager();
    await managerPage.clickAddCustomer();
    await managerPage.fillCustomerDetails(
      (customer as any).firstName,
      (customer as any).lastName,
      (customer as any).postCode
    );
    page.once('dialog', async dialog => {
      expect(dialog.message()).toMatch(/^Customer added successfully with customer id :\d+$/);
      const match = dialog.message().match(/Customer added successfully with customer id :(\d+)/);
      if (match) {
        const customerId = match[1];
        // ...existing code...
      } else {
        // ...existing code...
      }
      await dialog.accept();
    });
    // Use a more specific selector for the Add Customer button to avoid strict mode violation
    const addCustomerBtn = await page.getByRole('form').locator('button[type="submit"]:has-text("Add Customer")');
    await addCustomerBtn.waitFor({ state: 'visible', timeout: 10000 });
    await addCustomerBtn.click();
    await managerPage.clickCustomers();
    const customerRowSelector = `tr:has(td:text-is("${(customer as any).firstName}")):has(td:text-is("${(customer as any).lastName}")):has(td:text-is("${(customer as any).postCode}"))`;
    const newCustomerRow = page.locator(customerRowSelector);
    await expect(newCustomerRow).toBeVisible({ timeout: 5000 });
    // ...existing code...
  }
});

test('Test 2: Duplicate Customer scenario - should show duplicate message when customer already exists', async ({ page, managerPage }) => {
  await managerPage.goto(urls.login);
  await managerPage.expectUrlMatch(/BankingProject\/#\/login/);
  await managerPage.loginAsManager();
  await managerPage.clickCustomers();

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
  const testDataPath = path.resolve(process.cwd(), 'test-data/duplicateCustomer-TestData.json');
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

    await managerPage.clickAddCustomer();
    await managerPage.fillCustomerDetails(cust.firstName, cust.lastName, cust.postCode);

    page.once('dialog', async dialog => {
      if (isDuplicate) {
        expect(dialog.message()).toBe('Please check the details. Customer may be duplicate.');
        // ...existing code...
      } else {
        expect(dialog.message()).toMatch(/^Customer added successfully with customer id :\d+$/);
        // ...existing code...
      }
      await dialog.accept();
    });
    const addCustomerBtn2 = await page.getByRole('form').locator('button[type="submit"]:has-text("Add Customer")');
    await addCustomerBtn2.waitFor({ state: 'visible', timeout: 10000 });
    await addCustomerBtn2.click();
    await managerPage.clickCustomers();
  }
});

test('Test 3: Field validation scenario - should require firstname lastname postcode for adding customer', async ({ page, managerPage }) => {
  const csvPath = path.resolve(process.cwd(), 'test-data/AddCustomerFieldValidation.csv');
  const customerSets = readCsvSets(csvPath);
  for (const customerData of customerSets) {
    await managerPage.goto(urls.login);
    await managerPage.expectUrlMatch(/BankingProject\/#\/login/);
    await managerPage.loginAsManager();
    await managerPage.clickAddCustomer();

    // 1. Fill only Last Name and Postcode. Attempt to submit the form without filling First Name.
    await page.getByRole('form').waitFor({ state: 'visible', timeout: 10000 });
    await managerPage.fillCustomerDetails('', customerData['Last Name'], customerData['Post Code']);
    const addBtn1 = page.getByRole('form').locator('button[type="submit"]:has-text("Add Customer")');
    await addBtn1.waitFor({ state: 'visible', timeout: 10000 });
    await addBtn1.click();
    const firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    await firstNameInput.waitFor({ state: 'visible', timeout: 10000 });
    const firstNameError = await firstNameInput.evaluate(input => (input as HTMLInputElement).validationMessage);
    expect(firstNameError).toBe('Please fill in this field.');
    // Reset form for next attempt
    await managerPage.clickAddCustomer();



    // 2. Fill only First Name and Postcode. Attempt to submit the form without filling Last Name.
    await managerPage.fillCustomerDetails(customerData['First Name'], '', customerData['Post Code']);
    const addBtn2 = page.getByRole('form').locator('button[type="submit"]:has-text("Add Customer")');
    await addBtn2.waitFor({ state: 'visible', timeout: 10000 });
    await addBtn2.click();
    const lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    await lastNameInput.waitFor({ state: 'visible', timeout: 10000 });
    const lastNameError = await lastNameInput.evaluate(input => (input as HTMLInputElement).validationMessage);
    expect(lastNameError).toBe('Please fill in this field.');
    // Reset form for next attempt
    await managerPage.clickAddCustomer();

    // 3. Fill only First Name and Last Name. Attempt to submit the form without filling Postcode.
    await managerPage.fillCustomerDetails(customerData['First Name'], customerData['Last Name'], '');
    const addBtn3 = page.getByRole('form').locator('button[type="submit"]:has-text("Add Customer")');
    await addBtn3.waitFor({ state: 'visible', timeout: 10000 });
    await addBtn3.click();
    const postCodeInput = page.getByRole('textbox', { name: 'Post Code' });
    await postCodeInput.waitFor({ state: 'visible', timeout: 10000 });
    const postCodeError = await postCodeInput.evaluate(input => (input as HTMLInputElement).validationMessage);
    expect(postCodeError).toBe('Please fill in this field.');

  }
});

});


