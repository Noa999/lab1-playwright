import { defineConfig, devices } from '@playwright/test';

// Lab 1 config: Chromium only, so `npx playwright test` works on any machine
// that has run `npx playwright install chromium`.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'https://www.saucedemo.com',
    // saucedemo marks elements with data-test (not Playwright's default data-testid)
    testIdAttribute: 'data-test',
    trace: 'on',
    video: 'on',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
