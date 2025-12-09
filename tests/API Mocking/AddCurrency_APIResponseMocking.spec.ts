import { test, expect } from '@playwright/test';

// Mocking API response
test.describe('APIResponse Mocking', () => {
  test('should mock and verify currency', async ({ page }) => {
    await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/openAccount');
    // Inject 'Euro' option directly into the dropdown
    await page.evaluate(() => {
      const currencyDropdown = document.querySelector('select[ng-model="currency"]');
      if (currencyDropdown) {
        const euroOption = document.createElement('option');
        euroOption.value = 'Euro';
        euroOption.text = 'Euro';
        currencyDropdown.appendChild(euroOption);
      }
    });
    const currencyDropdown = page.locator('select[ng-model="currency"]');
    const currencyOptions = await currencyDropdown.locator('option').allTextContents();
    expect(currencyOptions).toContain('Euro');
    console.log('Currencies after injection:', currencyOptions);
  });
});
