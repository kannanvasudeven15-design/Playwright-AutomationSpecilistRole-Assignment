**1. Approach**

I implemented the solution using Playwright with TypeScript, following the Page Object Model (POM) design pattern for maintainability and scalability. The tests are organized into suites aligned with the provided user stories, and I adhered to clean code practices such as meaningful naming, modular design, reusable components, parameterization for dynamic test data and utility-driven architecture.

**2. Key Features**

***Project Tree**

├── .github/
├── fixture/
│   └── pagesFixture.ts
├── node_modules/
├── package-lock.json
├── package.json
├── pages/
│   ├── basePage.ts
│   ├── customerPage.ts
│   └── managerPage.ts
├── playwright.config.ts
├── test-data/
│   ├── AddCustomerFieldValidation.csv
│   ├── AddNewCusotmer_TestData.xlsx
│   ├── APIRequest-TestData.csv
│   ├── createAccount_TestData.csv
│   ├── currencies.har
│   ├── duplicateCustomer-TestData.json
│   └── makeDeposit_TestData.json
├── tests/
│   ├── API Mocking/
│   │   ├── AddCurrency_APIResponseMocking.spec.ts
│   │   ├── AddCurrency_HARMethod.spec.ts
│   │   └── AddCustomer_APIRequestMocking.spec.ts
│   ├── Customer/
│   │   └── makeDeposit.spec.ts
│   ├── Manager/
│   │   ├── createCustomer.spec.ts
│   │   └── openAccount.spec.ts
├── utils/
│   ├── config.ts
│   ├── configUtil.ts
│   ├── csvUtils.ts
│   └── excelUtils.ts

**Page Object Model (POM) Design**

I have created three Page Object Model classes — BasePage, ManagerPage, and CustomerPage — to structure UI automation.

basePage: contains common reusable methods for navigation, role-based interactions, text visibility checks, and URL validation

managerPage: Encapsulates locators and actions for bank manager operations (e.g., adding customers, opening accounts).

customerPage: Handles customer operations like deposit.

pageFixture.ts - Have created a custom fixture to wrap all the three Page Object Model classes, so tests get ready to use, typed page objects injected automatically, improving isolation, and making tests easier to read and maintain.

***Utilities***
To support modularity and dynamic data handling, 

I implemented:
config.ts: Stores environment-specific constants and URLs.
configUtil.ts: Provides helper functions for reading configuration values.
csvUtils.ts: Handles reading and writing CSV files for test data.
excelUtils.ts: Enables Excel-based data-driven testing for parameterization.

***Cross-Browser Support***
Configured for Chromium, Firefox, and WebKit.

***Automated Tests for User Stories***
***tests/Manager***
JIRA-1: Bank Manager Operations - Create a customer
Test 1: E2E - Create customer (Data Driven Parametrisation using Excel & excelUtils.ts)
Test 2: Duplicate Customer check (Data Driven Parametrisation using JSON )
Test 3: Field validation check (Data Driven Parametrisation using CSV & csvUtils.ts)
 
JIRA-2: Bank Manager Operations - Open an account
Test 1: E2E - Open Customer Account (Data Driven Parametrisation using CSV & csvUtils.ts)
Test 2: Verify available currencies
 
***tests/Customer**
JIRA-3: Bank Customer Operations - Make a deposit
Test 1: E2E - Deposit amount for customer (Data Driven Parametrisation using JSON ) and validate the successful message is displayed in RED
Test 2: Amount field validation
 
***tests/API Mocking**
APIRequestMocking (Data Driven Parametrisation using CSV)
Test 1: APIRequest Success Response for Adding New Customer
Test 2: APIRequest Error Response for missing first name while Adding Customer
Test 3: APIRequest Duplicate Response while adding existing customer

APIResponseMocking
Test 1: APIResponse to add new currency (EURO)

APIMocking from HAR file
Test 1: Add currency using APIMocking from HAR file
 
 ***CI Integration with GitHubActions***
 playwright.yml

***Git Repository***
https://github.com/kannanvasudeven15-design/Playwright-AutomationSpecilistRole-Assignment.git

**5. Test Spec names for test execution**
tests/Manager/createCustomer.spec.ts
tests/Manager/openAccount.spec.ts
tests/Customer/makeDeposit.spec.ts

**6. Allure Report**
npx allure generate ./allure-results --clean -o ./allure-report
npx allure open ./allure-report



