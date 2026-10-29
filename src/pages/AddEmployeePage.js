import { expect } from '@playwright/test';

export class AddEmployeePage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.middleNameInput = page.getByPlaceholder('Middle Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.employeeIdInput = page.locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .getByRole('textbox');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async create({ firstName, middleName, lastName }) {
    await expect(this.firstNameInput).toBeVisible();
    await this.firstNameInput.fill(firstName);
    await this.middleNameInput.fill(middleName);
    await this.lastNameInput.fill(lastName);

    const employeeId = (await this.employeeIdInput.inputValue()).trim();
    expect(employeeId, 'The application should generate an employee ID').not.toBe('');
    expect(employeeId, 'The generated employee ID should be numeric').toMatch(/^\d+$/);

    await this.saveButton.click();
    await expect(this.page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
    await expect(this.employeeIdInput).toHaveValue(employeeId);
    return employeeId;
  }
}
