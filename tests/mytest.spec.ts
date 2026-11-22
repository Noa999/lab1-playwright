import { test, expect, Page } from '@playwright/test';

/**
 * Lab 1: saucedemo.com дээрх нэвтрэх хуудасны UI автомат тест (Playwright).
 * Locator-оор getByRole / getByPlaceholder / getByText ашигласан: эдгээр нь
 * хэрэглэгчийн харж буй зүйл (товчны нэр, текст) дээр тулгуурладаг тул
 * XPath/CSS-ээс илүү тогтвортой. DOM бүтэц өөрчлөгдсөн ч тест эвдрэх нь бага.
 */

// Нэвтрэх хуудсыг нээгээд өгөгдсөн нэр/нууц үгээр нэвтрэх туслах функц.
async function login(page: Page, username: string, password: string) {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

// Цэснээс Logout хийж, нэвтрэх хуудас руу буцсанаа URL-ээр шалгана.
// Нэвтэрсэн тест бүр үүгээр төгсөнө (Алхам 5): тест бүр цэвэр төлөвөөр дуусна.
async function logout(page: Page) {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByText('Logout', { exact: true }).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
}

// Тест 1: зөв нэр, нууц үгээр амжилттай нэвтрэх.
test('амжилттай нэвтрэх', async ({ page }) => {
  await login(page, 'standard_user', 'secret_sauce');

  // Нэвтэрсний дараа бүтээгдэхүүний хуудас руу шилжсэн эсэх
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText('Products', { exact: true })).toBeVisible();

  await logout(page);
});
