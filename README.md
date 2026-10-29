# OrangeHRM Employee Lifecycle Automation

Playwright end-to-end automation for the employee CRUD workflow described in `Problemstatment`. The project uses JavaScript ES modules, Playwright Test, and the Page Object Model.

## Requirements

- Node.js 20 or newer
- npm
- Access to the OrangeHRM demo site (or an equivalent OrangeHRM instance)

## Setup

From this directory:

```bash
npm install
npx playwright install chromium
```

By default, the test targets `https://opensource-demo.orangehrmlive.com` and uses the public demo credentials `Admin` / `admin123`. If your instance uses different credentials or a different URL, set these environment variables before running:

```bash
export ORANGEHRM_USERNAME="your-admin-username"
export ORANGEHRM_PASSWORD="your-admin-password"
export BASE_URL="https://your-orangehrm-host"
```

Keep credentials out of source control and do not commit a local `.env` file.

## Run

```bash
npm test
```

Run with a visible Chromium browser:

```bash
npm run test:headed
```

View the HTML report after a run:

```bash
npm run report
```

To run in headed mode by setting the environment variable instead:

```bash
HEADED=true npm test
```

## Workflow and assertions

The test logs in as an administrator, creates an employee, searches by the application's generated employee ID, updates and verifies the employee name, deletes the employee, and searches again. It asserts that the generated ID is present and numeric, that the updated values are saved, and that no row with the deleted employee ID remains.

Employee names include a run-specific suffix to reduce collisions with other test runs. The employee ID is read from the Add Employee form after the page initializes it; the test does not hardcode an expected ID.

## Project layout

- `tests/employee-lifecycle.spec.js` — end-to-end scenario and assertions
- `src/pages/` — page objects for login, employee creation, employee details, and employee search/deletion
- `src/support/logger.js` — structured JSON execution logging
- `playwright.config.js` — browser, timeout, retry, and report configuration

Playwright's auto-waiting is used for element interactions and assertions. No fixed sleeps are used. The HTML report, traces, screenshots, and videos are written under `playwright-report/` and `test-results/` when applicable.
