import { expect, test, type Page } from "@playwright/test";

async function dismissGate(page: Page) {
  const later = page.getByRole("button", { name: "بعداً می‌آیم" });
  if (await later.isVisible({ timeout: 2000 }).catch(() => false)) {
    await later.click();
  }
}

const routes = [
  "/",
  "/shop",
  "/subscriptions",
  "/cart",
  "/checkout",
  "/about",
  "/faq",
  "/contact",
  "/magazine",
  "/login",
  "/account",
  "/dashboard",
];

test.describe("PetFit storefront smoke", () => {
  for (const path of routes) {
    test(`loads ${path}`, async ({ page }) => {
      const res = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(res?.ok() || res?.status() === 304).toBeTruthy();
      await dismissGate(page);
      await expect(page.locator("body")).toBeVisible();
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth > doc.clientWidth + 2;
      });
      expect(overflow).toBeFalsy();
    });
  }

  test("shop shows products", async ({ page }) => {
    await page.goto("/shop", { waitUntil: "networkidle" });
    await dismissGate(page);
    await expect(page.getByRole("heading", { name: /منوی خرید|فروشگاه/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "افزودن به سبد" }).first()).toBeVisible();
  });

  test("orbit bowls section exists on home", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissGate(page);
    await page.locator("#orbit-bowls").scrollIntoViewIfNeeded();
    await expect(page.locator("#orbit-bowls")).toBeVisible();
    await expect(page.locator("#orbit-bowls canvas")).toBeVisible();
  });
});
