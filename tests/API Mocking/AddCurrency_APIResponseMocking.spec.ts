import { test, expect } from '@playwright/test';

// Mocking API response
test.describe('APIResponse Mocking', () => {
  test('should mock and verify currency', async ({ page }) => {
    await page.route('**/api/currencies', async (route, request) => {
      
        // Forward the request and modify the response
      const response = await route.fetch();
      const original = await response.json();
      
      // Ensure the response has a 'currencies' array in the expected format
      let mockedResponse;
      if (Array.isArray(original.currencies)) {
        if (!original.currencies.includes('Euro')) {
          original.currencies.push('Euro');
        }
        mockedResponse = original;
      } else {
        // fallback: create a currencies array if not present
        mockedResponse = { currencies: ['Euro'] };
      }
      await route.fulfill({
        status: 200,
        body: JSON.stringify(mockedResponse),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/openAccount');
    
    // Check EURO is populated by the API
    const currencyDropdown = page.locator('select[ng-model="currency"]');
    const currencyOptions = await currencyDropdown.locator('option').allTextContents();
    expect(currencyOptions).toContain('Euro');
    console.log('Currencies after route.fetch() mock:', currencyOptions);
  });
});
