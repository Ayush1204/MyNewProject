import { expect } from '@playwright/test';

export class EmployeeDetailsPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.saveButton = page.getByRole('button', { name: 'Save' }).first();
  }

  async updateName({ firstName, lastName }) {
    await expect(this.firstNameInput).toBeVisible();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.saveButton.click();
    await expect(this.page.getByText('Successfully Updated')).toBeVisible();
    await this.page.reload();
    await expect(this.firstNameInput).toHaveValue(firstName);
    await expect(this.lastNameInput).toHaveValue(lastName);
  }

  async employeeId() {
    const employeeIdInput = this.page.locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .getByRole('textbox');
    return (await employeeIdInput.inputValue()).trim();
  }
}
