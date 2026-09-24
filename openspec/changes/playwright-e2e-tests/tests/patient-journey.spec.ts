import { test, expect } from '@playwright/test';

test.describe('patient journey', () => {
  test('register, complete profile, discover, and book a consultation', async ({ page }) => {
    const email = `e2e-patient-${Date.now()}@telehealth.dev`;

    // Register a fresh patient.
    await page.goto('/register');
    await page.getByRole('button', { name: 'Patient' }).click();
    await page.getByLabel('First name').fill('E2E');
    await page.getByLabel('Last name').fill('Patient');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill('Patient123!');
    await page.getByRole('button', { name: 'Register' }).click();

    // Landed on the patient dashboard with a profile.
    await expect(page.getByRole('heading', { name: /Welcome, E2E/ })).toBeVisible();

    // Complete a profile field.
    await page.getByLabel('Phone').fill('555-0100');
    await page.getByRole('button', { name: 'Save profile' }).click();
    await expect(page.getByText('Profile saved.')).toBeVisible();

    // Discover a doctor and book a slot.
    await page.getByRole('link', { name: 'Find doctors' }).click();
    const firstDoctor = page.locator('.card').filter({ hasText: 'View & book' }).first();
    await firstDoctor.getByRole('button', { name: 'View & book' }).click();

    // Pick the first available slot and book it.
    const slotButton = page.getByRole('button', { name: /Available/ }).first();
    await slotButton.click();
    await expect(page.getByText('Appointment booked!')).toBeVisible();

    // The booking shows up in the appointments list.
    await page.getByRole('link', { name: 'Appointments' }).click();
    await expect(page.getByText(/SCHEDULED|Scheduled/).first()).toBeVisible();
  });
});
