import { test, expect } from '../../fixture/pagesFixture';
import { urls } from '../../utils/config';

test.describe('Bank Manager - Open Account Visual Test', () => {
  test('should open account for existing customer and verify visually', async ({ managerPage, page }) => {
    await managerPage.goto(urls.login);
    await managerPage.loginAsManager();
    await managerPage.clickCustomers();
    await expect(page.getByRole('table')).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveScreenshot('customer-account-page.png', { fullPage: true });
    
    //Click on Open Account
    await managerPage.clickOpenAccount();
    await expect(page.getByRole('form')).toBeVisible({ timeout: 5000 });

    // Select customer and currency
    await page.locator('label:text("Customer :") + select').selectOption({ label: 'Harry Potter' });
    await page.locator('label:text("Currency :") + select').selectOption({ label: 'Rupee' });

    page.once('dialog', async (dialog: any) => {
      expect(dialog.message()).toContain('Account created successfully');
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Process' }).click();

    await managerPage.clickCustomers();
    const customerTable = page.getByRole('table');
    await customerTable.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('customer-account-page.png', { fullPage: true });
  });
});
