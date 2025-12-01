# JIRA2.md

## Test 1: Open account for existing customer with available currency and update Customer Record

**Steps:**
1. Create `csvUtils.ts` and read data from `test-data/createAccount_TestData.csv`
2. Navigate to login page
3. Click Bank Manager Login
4. Click Open Account
5. Select customer and currency from test data
6. Click Process and handle alert
7. Click Customers button
8. Find customer row and verify account number

-------------------------------------------

## Test 2: Verify available currencies

**Steps:**
1. Navigate to login page
2. Click Bank Manager Login
3. Click Open Account
4. Get all currency values
5. Assert expected currencies
6. Display currencies in console as "Available currencies under Currency field:"
