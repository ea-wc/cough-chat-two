import { test, expect } from '@playwright/test';

const API = 'http://localhost:4000/api';

async function loginToken(request: import('@playwright/test').APIRequestContext, email: string, password: string): Promise<string> {
  const res = await request.post(`${API}/auth/login`, { data: { email, password } });
  const body = await res.json();
  return body.accessToken;
}

test.describe('doctor journey', () => {
  test('manage availability and complete a consultation with notes and a prescription', async ({ page, request }) => {
    // Seed a booking via the API so the doctor has a consultation to work on.
    const doctorToken = await loginToken(request, 'doctor1@telehealth.dev', 'Doctor123!');
    const patientToken = await loginToken(request, 'patient@telehealth.dev', 'Patient123!');

    const slotsRes = await request.get(`${API}/doctors/me/availability`, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    });
    const slots = await slotsRes.json();
    const slot = slots.find((s: { status: string }) => s.status === 'AVAILABLE');
    expect(slot).toBeTruthy();

    await request.post(`${API}/appointments`, {
      headers: { Authorization: `Bearer ${patientToken}` },
      data: { availabilityId: slot.id, symptoms: 'e2e booking' },
    });

    // Sign in to the doctor UI.
    await page.goto('/login');
    await page.getByLabel('Email').fill('doctor1@telehealth.dev');
    await page.getByLabel('Password').fill('Doctor123!');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

    // Open the consultation workspace.
    await page.goto('/doctor/appointments');
    await page.getByRole('link', { name: 'Open consultation' }).first().click();
    await expect(page.getByRole('heading', { name: 'Consultation' })).toBeVisible();

    // Record notes and a prescription.
    await page.getByLabel('Consultation notes').fill('Routine e2e consultation notes.');
    await page.getByRole('button', { name: 'Save notes' }).click();
    await page.getByLabel('Medication').fill('Paracetamol');
    await page.getByLabel('Dosage').fill('500mg');
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByText('Paracetamol')).toBeVisible();
  });
});
