import { test, expect } from '../../fixture/pagesFixture';
import { urls } from '../../utils/config';

test.describe('Bank Manager - Add New Customer Visual Test', () => {
  test('should add a new customer and verify visually', async ({ managerPage, page }) => {

    await managerPage.goto(urls.login);
    await managerPage.loginAsManager();
    await managerPage.clickCustomers();
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveScreenshot('customer-page.png', { fullPage: true });

    await managerPage.clickAddCustomer();
    await managerPage.fillCustomerDetails('John', 'Hulk', 'WN50JR');
    page.once('dialog', async (dialog) => await dialog.accept());
    await managerPage.submitAddCustomerForm();

    await managerPage.clickCustomers();
    const customerTable = page.getByRole('table');
    await customerTable.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('customer-page.png', { fullPage: true });
  });
});
