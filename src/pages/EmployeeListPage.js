import { expect } from '@playwright/test';

export class EmployeeListPage {
  constructor(page) {
    this.page = page;
    this.employeeIdInput = page.locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .getByRole('textbox');
    this.searchButton = page.getByRole('button', { name: 'Search' });
  }

  async open() {
    await this.page.getByRole('link', { name: 'PIM' }).click();
    await this.page.getByRole('link', { name: 'Employee List' }).click();
    await expect(this.searchButton).toBeVisible();
  }

  async openAddEmployee() {
    await this.page.getByRole('link', { name: 'Add Employee' }).click();
  }

  async searchByEmployeeId(employeeId) {
    await this.employeeIdInput.fill(employeeId);
    await this.searchButton.click();
    await expect(this.page.getByRole('button', { name: 'Search' })).toBeVisible();
  }

  rowForEmployee(employeeId) {
    const employeeIdCell = this.page.getByRole('cell', {
      name: employeeId,
      exact: true,
    });
    return this.page.getByRole('row').filter({ has: employeeIdCell });
  }

  async openEmployee(employeeId) {
    await this.rowForEmployee(employeeId).getByRole('button').first().click();
  }

  async deleteEmployee(employeeId) {
    const row = this.rowForEmployee(employeeId);
    await expect(row).toBeVisible();
    const checkbox = row.getByRole('checkbox');
    await row.locator('.oxd-checkbox-wrapper').click();
    await expect(checkbox).toBeChecked();
    await this.page.getByRole('button', { name: 'Delete Selected' }).click();

    const confirmation = this.page.getByRole('dialog');
    await expect(confirmation).toBeVisible();
    await confirmation.getByRole('button', { name: 'Yes, Delete' }).click();
    await expect(this.page.getByText('Successfully Deleted')).toBeVisible();
  }
}
