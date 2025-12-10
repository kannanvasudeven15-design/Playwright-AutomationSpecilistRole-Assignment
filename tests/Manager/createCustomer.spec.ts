import { test, expect } from '../../fixture/pagesFixture';
test.use({ browserName: 'chromium' });
test.use({ browserName: 'webkit' });
test.use({ browserName: 'firefox' });
import path from 'path';
import fs from 'fs';
import { readExcel } from '../../utils/excelUtils';
import { readCsvSets } from '../../utils/csvUtils';
import { urls } from '../../utils/config';

const csvPath = require('path').resolve(process.cwd(), 'test-data/AddCustomerFieldValidation.csv');
const customerSets = readCsvSets(csvPath);

test.describe('JIRA 1 - Create Customer', () => {

test('Test 1: End to End Flow scenario - should create a new customer and show success message', async ({ page, managerPage }) => {
  
  console.log('Starting Test 1: End to End Flow scenario - should create a new customer and show success message');
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
       
      } else {
        
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

test('Test 2: Duplicate Customer scenario - should show duplicate message when customer already exists',{ tag: ['@PlaywrightWithGitHubActions'] }, async ({ page, managerPage }) => {
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

  for (const set of customerSets) {
    test(`Test 3: Field Validation scenario: ${set.scenario}`, async ({ managerPage, basePage }) => {
      await basePage.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
      await managerPage.loginAsManager();
      await managerPage.clickAddCustomer();
      await managerPage.fillCustomerDetails(set['First Name'], set['Last Name'], set['Post Code']);
      await managerPage.submitAddCustomerForm();
      // Validate all required fields are filled
      if (!set['First Name']) {
        const validationMessage = await basePage.getValidationMessageForTextbox('First Name');
        expect([
          'Please fill in this field.',
          'Fill out this field'
        ]).toContain(validationMessage);
      }
      if (!set['Last Name']) {
        const validationMessage = await basePage.getValidationMessageForTextbox('Last Name');
        expect([
          'Please fill in this field.',
          'Fill out this field'
        ]).toContain(validationMessage);
      }
      if (!set['Post Code']) {
        const validationMessage = await basePage.getValidationMessageForTextbox('Post Code');
        expect([
          'Please fill in this field.',
          'Fill out this field'
        ]).toContain(validationMessage);
      }
      await basePage.clickByRole('button', 'Home');
      await basePage.expectUrlMatch(/BankingProject\/\#\/login/);
    });
  }
});


