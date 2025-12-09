import { test, expect } from '@playwright/test';

// Mocking API response
test.describe('APIResponse Mocking', () => {
  test('should mock and verify currency', async ({ page }) => {
    await page.route('**/api/currencies', async (route, request) => {
      
        // Forward the request and modify the response
      const response = await route.fetch();
      const original = await response.json();
      
      // Add a new currency to the response
      original.currencies.push('Euro');
      await route.fulfill({
        response,
        body: JSON.stringify(original),
        contentType: 'application/json',
      });
    });

    await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/openAccount');
    
    // Check EURO is populated by the API
    const currencyOptions = await page.locator('select').nth(1).locator('option').allTextContents();
    expect(currencyOptions).toContain('Euro');
    console.log('Currencies after route.fetch() mock:', currencyOptions);
  });
});
