import { test, expect } from '@playwright/test';

// Smoke test for the deployed (or locally-proxied) app. Point it at the public
// URL with: BASE_URL=https://<app>.fly.dev pnpm --filter e2e test deployment-smoke

test.describe('fly-io deployment', () => {
  test('serves the landing page and logs in through the web proxy', async ({ page, request }) => {
    // Landing page is served over the single public entry point.
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // API is reachable through the same origin via the /api rewrite.
    const res = await request.post('/api/auth/login', {
      data: { email: 'patient@telehealth.dev', password: 'Patient123!' },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.accessToken).toBeTruthy();
    expect(body.user.role).toBe('PATIENT');
  });
});
