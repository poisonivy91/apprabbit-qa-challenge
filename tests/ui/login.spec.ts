import { test, expect } from '@playwright/test';

test('logs into AppRabbit dashboard (adaptive: password OR magic-link/OTP)', async ({ page }) => {
  const email = process.env.AR_EMAIL!;
  const password = process.env.AR_PASSWORD!;
  test.skip(!email, 'Set AR_EMAIL in .env');

  await page.goto('/login', { waitUntil: 'domcontentloaded' });

  // Continue with email if present
  const continueEmailBtn = page.getByRole('button', { name: /continue with email|email/i });
  if (await continueEmailBtn.isVisible().catch(() => false)) {
    await continueEmailBtn.click();
  }

  // Fill email
  const emailInput = page.locator('input[type="email"], input[name*="email" i], input[id*="email" i]').first();
  await emailInput.waitFor({ timeout: 10000 });
  await emailInput.fill(email);

  // If a Next/Continue appears (many passwordless flows), click it
  const nextBtn = page.getByRole('button', { name: /next|continue|proceed|submit/i }).first();
  if (await nextBtn.isVisible().catch(() => false)) {
    await nextBtn.click().catch(() => {});
  }

  // --- Branch 1: PASSWORD FLOW ---
  const pwdField =
    page.locator('input[type="password"], input[name*="pass" i], input[id*="pass" i]').first();

  if (await pwdField.isVisible().catch(() => false)) {
    test.skip(!password, 'Set AR_PASSWORD in .env for password flow');

    await pwdField.fill(password);

    const submitBtn = page
      .getByRole('button', { name: /log ?in|sign ?in|continue|submit/i })
      .or(page.locator('button[type="submit"]'))
      .first();

    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
    } else {
      await page.keyboard.press('Enter');
    }

    await page.waitForLoadState('networkidle', { timeout: 20000 });
    await page.waitForURL(/^(?!.*\/login)/, { timeout: 25000 });

    const logoutBtn = page.getByRole('button', { name: /log ?out|sign ?out/i });
    const dashHeading = page.getByRole('heading', { name: /dashboard|clients|programs|settings|admin/i });
    expect(
      (await logoutBtn.isVisible().catch(() => false)) ||
      (await dashHeading.isVisible().catch(() => false))
    ).toBeTruthy();

    return;
  }

  // --- Branch 2: MAGIC LINK FLOW (no password) ---
  const magicLinkText = page.getByText(/check your email|magic link|verification link sent/i).first();
  if (await magicLinkText.isVisible().catch(() => false)) {
    // Accept this as a valid login-path check for CI (can’t auto-open email here)
    await expect(magicLinkText).toBeVisible();
    return;
  }

  // --- Branch 3: OTP FLOW (code inputs) ---
  const otpInputs = page.locator('input[autocomplete="one-time-code"], input[pattern="\\d*"], input[inputmode="numeric"]').first();
  const otpHeading = page.getByText(/enter code|verification code|one[- ]time code|6[- ]digit/i).first();
  if (await otpInputs.isVisible().catch(() => false) || await otpHeading.isVisible().catch(() => false)) {
    await expect(otpInputs.or(otpHeading)).toBeVisible();
    return;
  }

  // --- None matched ---
  expect(false, 'No password, magic-link confirmation, or OTP prompt detected after email step').toBeTruthy();
});
