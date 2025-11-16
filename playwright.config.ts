import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list']
  ],
  use: {
    baseURL: 'https://petstore.swagger.io/v2',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    trace: 'on-first-retry',
  },
});
