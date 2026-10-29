import { expect, test } from '@playwright/test';
import { AddEmployeePage } from '../src/pages/AddEmployeePage.js';
import { EmployeeDetailsPage } from '../src/pages/EmployeeDetailsPage.js';
import { EmployeeListPage } from '../src/pages/EmployeeListPage.js';
import { LoginPage } from '../src/pages/LoginPage.js';
import { log } from '../src/support/logger.js';

const username = process.env.ORANGEHRM_USERNAME ?? 'Admin';
const password = process.env.ORANGEHRM_PASSWORD ?? 'admin123';

test('admin can create, search, update, and delete an employee', async ({ page }) => {
  test.setTimeout(120_000);

  const loginPage = new LoginPage(page);
  const employeeListPage = new EmployeeListPage(page);
  const addEmployeePage = new AddEmployeePage(page);
  const employeeDetailsPage = new EmployeeDetailsPage(page);
  const uniqueSuffix = Date.now().toString().slice(-8);
  const originalName = {
    firstName: 'Lifecycle',
    middleName: 'Test',
    lastName: `Employee${uniqueSuffix}`,
  };
  const updatedName = {
    firstName: `Updated${uniqueSuffix}`,
    lastName: `Record${uniqueSuffix}`,
  };

  await test.step('Log in as the HRMS administrator', async () => {
    await loginPage.open();
    await loginPage.login(username, password);
    log('info', 'Administrator login completed');
  });

  let employeeId;
  await test.step('Create an employee and verify the generated ID', async () => {
    await employeeListPage.open();
    await employeeListPage.openAddEmployee();
    employeeId = await addEmployeePage.create(originalName);
    log('info', 'Employee created', { employeeId });
  });

  await test.step('Find the newly created employee by generated ID', async () => {
    await employeeListPage.open();
    await employeeListPage.searchByEmployeeId(employeeId);
    await expect(employeeListPage.rowForEmployee(employeeId)).toBeVisible();
    log('info', 'Employee search matched generated ID', { employeeId });
  });

  await test.step('Update the employee name and verify the saved values', async () => {
    await employeeListPage.openEmployee(employeeId);
    await expect(employeeDetailsPage.firstNameInput).toHaveValue(originalName.firstName);
    expect(await employeeDetailsPage.employeeId()).toBe(employeeId);

    await employeeDetailsPage.updateName(updatedName);
    expect(await employeeDetailsPage.employeeId()).toBe(employeeId);
    log('info', 'Employee name updated', { employeeId });
  });

  await test.step('Delete the employee and verify no matching record remains', async () => {
    await employeeListPage.open();
    await employeeListPage.searchByEmployeeId(employeeId);
    await expect(employeeListPage.rowForEmployee(employeeId)).toBeVisible();
    await employeeListPage.deleteEmployee(employeeId);
    await employeeListPage.searchByEmployeeId(employeeId);

    await expect(employeeListPage.rowForEmployee(employeeId)).toHaveCount(0);
    log('info', 'Deleted employee is absent from search results', { employeeId });
  });
});
