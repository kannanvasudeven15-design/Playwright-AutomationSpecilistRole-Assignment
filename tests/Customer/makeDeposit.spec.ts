import { test, expect } from '../../fixture/pagesFixture';
test.use({ browserName: 'chromium' });
test.use({ browserName: 'webkit' });
test.use({ browserName: 'firefox' });
import path from 'path';
import fs from 'fs';

const testDataPath = path.resolve(process.cwd(), 'test-data/makeDeposit_TestData.json');
const testDataRaw = fs.readFileSync(testDataPath, 'utf-8');
const testData = JSON.parse(testDataRaw);


test.describe('JIRA 3: Customer Deposit Flow', () => {
  {
    for (const data of testData) {
      test(`Test 1: End to end flow - Deposit for ${data.customerName} - amount ${data.depositAmount}`,{ tag: ['@PlaywrightWithGitHubActions'] }, async ({ page, customerPage }) => {
        console.log(`Starting Test 1: End to end flow - Deposit for ${data.customerName} - amount ${data.depositAmount}`);
        await customerPage.navigateToCustomerLogin();
        await page.getByRole('combobox').selectOption({ label: data.customerName });
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.locator('strong', { hasText: data.expectedWelcomeMessage })).toBeVisible({ timeout: 5000 });

        // Capture initial balance
        const initialBalance = parseInt(await customerPage.getBalance() || '0', 10);

        // Deposit money
        await customerPage.makeDeposit(data.depositAmount);
        await expect(page.getByText('Deposit Successful')).toBeVisible({ timeout: 5000 });
        const successMessage = page.getByText('Deposit Successful');
        const color = await successMessage.evaluate((el) => getComputedStyle(el).color);
	      expect(color).toBe('rgb(255, 0, 0)');


        // Verify balance is updated
        const updatedBalance = parseInt(await customerPage.getBalance() || '0', 10);
        expect(updatedBalance).toBe(initialBalance + data.depositAmount);

        // Verify transaction in table
        await page.waitForTimeout(3000);
        await page.getByRole('button', { name: 'Transactions' }).click();
        const transactionTable = page.locator('table');
        await expect(transactionTable).toBeVisible({ timeout: 5000 });
        await page.waitForSelector('table tbody tr');

        // Print all transaction rows and cells
        const allRows = await transactionTable.locator('tr').all();
        for (const [i, row] of allRows.entries()) {
          const cells = await row.locator('td').allTextContents();
        }

        // Retry finding the transaction row 
        let found = false;
        for (let i = 0; i < 10; i++) {
          const rows = await transactionTable.locator('tr').all();
          for (const row of rows) {
            const cells = await row.locator('td').allTextContents();
            if (
              cells.includes(data.depositAmount.toString()) &&
              cells.includes(data.expectedTransactionType)
            ) {
              found = true;
              await expect(row).toBeVisible({ timeout: 5000 });
              break;
            }
          }
          if (found) break;
          await page.waitForTimeout(500);
        }
        expect(found).toBe(true);
      });
    }
  }

  test('Test 2: Amount field validation - should show required field tooltip when deposit amount is empty', async ({ page, customerPage }) => {
    
    const customerName = testData[0].customerName;
    await customerPage.navigateToCustomerLogin();
    await page.getByRole('combobox').selectOption({ label: customerName });
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText(`Welcome ${customerName} !!`)).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: 'Deposit' }).click();
    const depositButton = await page.getByRole('form').getByRole('button', { name: 'Deposit' });
    await depositButton.click();

    // Assert tooltip is displayed
    const amountInput = await page.getByRole('spinbutton');
    const validationMessage = await amountInput.evaluate((el) => (el as HTMLInputElement).validationMessage);
    expect(validationMessage).toContain("Please enter a number");
  });

});
