import { test, expect } from '@playwright/test';
import fs from 'fs';

/**
 * HAR Mocking Example for Currency API
 */
test('Mock API from HAR file for currency dropdown', async ({ page }) => {
    
    // Check HAR file existence and content
    const harPath = './test-data/currencies.har';
    if (!fs.existsSync(harPath)) {
        throw new Error('HAR file not found. Please record a HAR file using: npx playwright codegen https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/openAccount --save-har=./test-data/currencies.har');
    }
    const harContent = fs.readFileSync(harPath, 'utf-8');
    if (!harContent || harContent.length < 100) {
        throw new Error('HAR file is empty or too small. Please ensure you interact with the currency dropdown during HAR recording.');
    }
   
    // Use a HAR file to mock the currency API
    await page.routeFromHAR(harPath, {
        url: '*/BankingProject/getCurrency*', // Update this pattern if needed based on HAR content
        update: false
    });

    // Go to the Open Account page
    await page.goto('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/manager/openAccount');

    // Validate currency dropdown contains expected values
    const currencyDropdown = page.locator('select[ng-model="currency"]');
    const currencyOptions = await currencyDropdown.locator('option').allTextContents();
    expect(currencyOptions).toContain('Dollar');
    expect(currencyOptions).toContain('Pound');
    expect(currencyOptions).toContain('Rupee');
    console.log('HAR-mocked currencies:', currencyOptions);
});
