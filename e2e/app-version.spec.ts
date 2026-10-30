import { test, expect } from '@playwright/test';

const MOCK_VERSION = '9.9.9-test';

test.describe('App version display', () => {
  test.beforeEach(async ({ page }) => {
    // Inject mocked version before Angular bootstraps
    await page.addInitScript((version: string) => {
      window.__APP_VERSION__ = version;
    }, MOCK_VERSION);

    // Stub models so the sidebar renders fully (not blocked by a loading/error state)
    await page.route('**/api/tags', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          models: [{ name: 'llama2', model: 'llama2' }],
        }),
      });
    });

    await page.goto('/');
  });

  test('shows the mocked version in the sidebar footer on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    const versionLabel = page.getByText(`v${MOCK_VERSION}`);
    await expect(versionLabel).toBeVisible();
  });

  test('shows the mocked version in the mobile sidebar drawer', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // Open the mobile sidebar drawer via the History tab in the bottom nav
    await page.getByRole('button', { name: 'History' }).click();

    // Scope to the visible overlay aside (the mobile drawer) to avoid matching
    // the desktop sidebar that is present in the DOM but hidden via CSS
    const drawer = page.locator('aside.fixed');
    const versionLabel = drawer.getByText(`v${MOCK_VERSION}`);
    await expect(versionLabel).toBeVisible();
  });
});
