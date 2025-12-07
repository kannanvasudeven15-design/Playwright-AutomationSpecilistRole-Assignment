import { test as base, Page } from '@playwright/test';
import { BasePage } from '../pages/basePage';
import { CustomerPage } from '../pages/customerPage';
import { ManagerPage } from '../pages/managerPage';

// Extend the base test to inject page objects
export const test = base.extend<{
  basePage: BasePage;
  customerPage: CustomerPage;
  managerPage: ManagerPage;
}>({
  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },
  customerPage: async ({ page }, use) => {
    await use(new CustomerPage(page));
  },
  managerPage: async ({ page }, use) => {
    await use(new ManagerPage(page));
  },
});

export { expect } from '@playwright/test';
