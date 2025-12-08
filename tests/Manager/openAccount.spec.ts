import logger from '../../utils/logger';
import { test, expect } from '../../fixture/pagesFixture';
import { getTestData } from '../../utils/csvUtils';
import { urls } from '../../utils/config';


test.describe('JIRA 2 - Open Customer Account', () => {
  const testData: { [key: string]: string }[] = getTestData();
  testData.forEach((data) => {
    const Name = data['Name'];
    const Currency = data['Currency'];
    test(`Test 1: Open Customer Account - should create account for ${Name} with ${Currency} currency and update Customer Record`,{ tag: ['@PlaywrightWithGitHubActions'] }, async ({ page, managerPage }) => {
      console.log('test execution started for Open Account');
        logger.info('test execution started for Open Account');
      console.log('Test Data:', { Name, Currency });
        logger.info('Test Data:', { Name, Currency });
      if (!Currency) {
        throw new Error(`Currency is undefined for customer: ${Name}`);
      }
      await managerPage.goto(urls.login);
      await managerPage.loginAsManager();
      await managerPage.clickOpenAccount();
      await expect(page.locator('select').first()).toBeVisible({ timeout: 10000 });
      await expect(page.locator('select').nth(1)).toBeVisible({ timeout: 10000 });
      await page.locator('select').first().selectOption({ label: Name });
      await page.locator('select').nth(1).selectOption({ label: Currency });
      page.once('dialog', async dialog => {
        const message = dialog.message();
        expect(message).toMatch(/Account created successfully with account Number :\d+/);
        const accountNumber = message.match(/Account Number :(\d+)/)?.[1];
        logger.info(`Alert message: ${message}`);
        if (accountNumber) {
          logger.info(`Account number ${accountNumber} has been added for the customer ${Name}.`);
        }
        await dialog.accept();
      });
      await managerPage.clickProcess();
      await managerPage.clickCustomers();
      const row = await page.locator('table').locator('tbody tr').filter({ hasText: Name }).first();
      const accountCell = await row.locator('td').nth(3).textContent();
      expect(accountCell).toMatch(/\d+/);
      console.log(`Account number(s) for ${Name}: ${accountCell}`);
        logger.info(`Account number(s) for ${Name}: ${accountCell}`);
    });
  });

  test('Test 2: Verify available currencies - should list all available currencies',{ tag: ['@PlaywrightWithGitHubActions'] }, async ({ page, managerPage }) => {
    console.log('test execution started for Verify Available Currencies in Open Account');
        logger.info('test execution started for verify Available Currencies while Open Account');
    await managerPage.goto(urls.login);
    await managerPage.loginAsManager();
    await managerPage.clickOpenAccount();
    const currencyOptions = await page.locator('select').nth(1).locator('option').allTextContents();
    const currencies = currencyOptions.filter(c => c !== '---Currency---');
    expect(currencies.length).toBeGreaterThan(0);
    expect(currencies).toEqual(expect.arrayContaining(['Dollar', 'Pound', 'Rupee']));
    console.log('Available currencies under Currency field:');
        logger.info('Available currencies under Currency field:');
    currencies.forEach(c => console.log(c));
        currencies.forEach(c => logger.info(c));
  });
});
