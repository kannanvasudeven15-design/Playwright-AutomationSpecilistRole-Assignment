# JIRA1.md

## Test 1: End to End Flow - should create a new customer and show success message

**Steps:**
1. Create `excelUtil.ts` under `utils` folder and read test data from `test-data/AddNewCusotmer_TestData.xlsx` (Data Driven Parametrisation using Excel)
2. Navigate to login page
3. Click on Add Customer button
4. Fill First Name, Last Name, Postcode from `test-data/AddNewCusotmer_TestData.xlsx`
5. Register dialog handler before clicking Add Customer button
6. Click Add Customer button
7. Assert "Customer added successfully with customer id :" message
8. Display message in console as "Customer added Successfully along with customer id"
9. Click Customers button and assert the newly added customer
10. Display message in console as <Newly Added Customer Name> is present in the Customer Table.

-----------------------------------------------------

## Test 2: Duplicate Customer scenario - should show duplicate message when customer already exists

**Steps:**
1. Navigate to login page
2. Click Bank Manager Login
3. Click Customers Button
4. Get all existing customer details from the customer table
5. Read customer details from `test-data/duplicateCustomer-TestData.json`
6. Click Add Customer button
7. Fill customer details with data from `test-data/duplicateCustomer-TestData.json` (Data Driven Parametrisation using JSON file)
8. Register dialog handler before clicking Add Customer button
9. If details entered from `test-data/duplicateCustomer-TestData.json` matches with existing customer details in Step 4, then "Please check the details. Customer may be duplicate." error message should be displayed.
10. If details entered from `test-data/duplicateCustomer-TestData.json` doesn't match with existing customer details in Step 4, then Customer should be added successfully.
11. Iterate for all data from `test-data/duplicateCustomer-TestData.json`

--------------------------------------------

## Test 3: Field validation scenario - should require first name, last name & postcode for adding customer

**Steps:**
1. Create `csvUtil.ts` under `utils` folder and read test data from `AddCustomerFieldValidation.csv` (Data Driven Parametrisation using CSV)
2. Navigate to login page
3. Click Bank Manager Login
4. Click Add Customer Button
5. Fill only Last Name and Postcode. Attempt to submit the form without filling First Name. Assert the error message.
6. Fill only First Name and Postcode. Attempt to submit the form without filling Last Name. Assert the error message.
7. Fill only First Name and Last Name. Attempt to submit the form without filling Postcode. Assert the error message.
