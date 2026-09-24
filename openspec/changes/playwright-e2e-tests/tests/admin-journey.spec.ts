import { test, expect } from '@playwright/test';

const API = 'http://localhost:4000/api';

test.describe('admin journey', () => {
  test('view the dashboard, suspend a user, and see the audit trail', async ({ page, request }) => {
    // Register a fresh throwaway user to suspend, so the test is idempotent
    // across repeated runs (no dependence on seeded-account state).
    const email = `e2e-admin-target-${Date.now()}@telehealth.dev`;
    await request.post(`${API}/auth/register`, {
      data: { email, password: 'Target123!', role: 'PATIENT', firstName: 'Target', lastName: 'User' },
    });

    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@telehealth.dev');
    await page.getByLabel('Password').fill('Admin123!');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

    // Operational dashboard renders counts.
    await page.goto('/admin');
    await expect(page.getByText('Operational dashboard')).toBeVisible();

    // Suspend the fresh user.
    await page.getByRole('link', { name: 'Users' }).click();
    await page.getByPlaceholder('Search by email…').fill(email);
    const searchDone = page.waitForResponse((r) => r.url().includes('/admin/users?q='));
    await page.getByRole('button', { name: 'Search' }).click();
    await searchDone;

    await expect(page.getByText(email)).toBeVisible();
    await page.getByRole('button', { name: 'Suspend' }).first().click();
    await expect(page.getByText('SUSPENDED').first()).toBeVisible();

    // The action is recorded in the audit log.
    await page.getByRole('link', { name: 'Audit' }).click();
    await expect(page.getByText('UPDATE_USER_STATUS').first()).toBeVisible();
  });
});
