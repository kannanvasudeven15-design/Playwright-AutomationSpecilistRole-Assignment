1. Approach

I implemented the solution using Playwright with TypeScript, following the Page Object Model (POM) design pattern for maintainability and scalability. The tests are organized into suites aligned with the provided user stories, and I adhered to clean code practices such as meaningful naming, modular design, reusable components, parameterization for dynamic test data and utility-driven architecture.

 

2. Key Features

Automated Tests for User Stories:
JIRA-1: tests/Manager/createCustomer.spec.ts
Test 1: End to End Flow scenario - should create a new customer and show success message
Test 2: Duplicate Customer scenario - should show duplicate message when customer already exists
Test 3: Field validation scenario - should require first name last name & postcode for adding customer
 

JIRA-2: tests/Manager/openAccount.spec.ts
Test 1: Open Customer Account - should create account for customer with desired currency and update Customer Record
Test 2: Verify available currencies - should list all available currencies
 

JIRA-3: tests/Customer/makeDeposit.spec.ts
Test 1: End to end flow - Deposit amount for customer
Test 2: Amount field validation - should show required field tooltip when deposit amount is empty
 

API Mocking: tests/API Mocking/ AddCustomer_APIRequestMocking.spec.ts
Test 1: APIRequest Mock Success Response - create customer shows success message when API returns success
Test 2: APIRequest Mock Error Response - create customer shows validation error when API returns 400
Test 3: APIRequest Mock duplicate customer response -  create customer shows duplicate message when API returns duplicate
 

Cross-Browser Support: Configured for Chromium, Firefox, and WebKit.
 

3. Page Object Model (POM) Design

To ensure scalability and maintainability, I created the following POM classes:
basePage: contains common reusable methods for navigation, role-based interactions, text visibility checks, and URL validation
managerPage: Encapsulates locators and actions for bank manager operations (e.g., adding customers, opening accounts).
customerPage: Handles customer operations like deposit.
 

This structure promotes reusability and clean separation of concerns across different flows.

 

4. Utilities

To support modularity and dynamic data handling, I implemented:
config.ts: Stores environment-specific constants and URLs.
configUtil.ts: Provides helper functions for reading configuration values.
csvUtils.ts: Handles reading and writing CSV files for test data.
excelUtils.ts: Enables Excel-based data-driven testing for parameterization.
 
