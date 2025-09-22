import { test, expect, request } from '@playwright/test';

test('API login returns token on success', async () => {
  const endpoint = process.env.AR_LOGIN_ENDPOINT!;
  const email = process.env.AR_EMAIL!;
  const password = process.env.AR_PASSWORD!;
  test.skip(!endpoint || !email || !password, 'Set AR_LOGIN_ENDPOINT, AR_EMAIL, AR_PASSWORD in .env');

  const ctx = await request.newContext();

  // AppRabbit login body structure (likely email + password)
  const payload = { email, password };

  const res = await ctx.post(endpoint, {
    data: payload,
    headers: { 'content-type': 'application/json' },
  });

  expect(res.status(), `Status ${res.status()} ${res.statusText()}`).toBe(201);

  const json = await res.json();

  // Look for a token-like field in the response
  const token =
    json.token ||
    json.access_token ||
    json.accessToken ||
    json.idToken ||
    (json.data && (json.data.token || json.data.accessToken));

  expect(token, `No token found in response: ${JSON.stringify(json).slice(0, 400)}`).toBeTruthy();
});

test('API login fails with wrong password', async () => {
  const endpoint = process.env.AR_LOGIN_ENDPOINT!;
  const email = process.env.AR_EMAIL!;
  test.skip(!endpoint || !email, 'Need AR_LOGIN_ENDPOINT and AR_EMAIL');

  const ctx = await request.newContext();

  const res = await ctx.post(endpoint, {
    data: { email, password: 'wrong-password' },
    headers: { 'content-type': 'application/json' },
  });

  // Should not succeed
  expect(res.status()).toBeGreaterThanOrEqual(400);
});
