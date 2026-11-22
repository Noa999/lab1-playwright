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

// Тест 2 (сөрөг): буруу нууц үгээр нэвтрэхэд алдааны мессеж гарах ёстой.
// Нэвтрээгүй тул logout хийх шаардлагагүй, харин хэрэглэгч нэвтрэх
// хуудсан дээрээ үлдсэнийг шалгана.
test('буруу нууц үгээр нэвтрэхэд алдаа гарна', async ({ page }) => {
  await login(page, 'standard_user', 'wrong_password');

  await expect(
    page.getByText('Username and password do not match any user in this service')
  ).toBeVisible();
  // Бүтээгдэхүүний хуудас руу орж чадаагүй, нэвтрэх хуудсандаа үлдсэн
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});

// Тест 3 (сөрөг): түгжигдсэн хэрэглэгч зөв нууц үгтэй байсан ч нэвтэрч болохгүй.
// Тест 2-оос өөр алдааны мессеж шалгаж байгаа тул өөр сценари болно.
test('түгжигдсэн хэрэглэгч нэвтэрч чадахгүй', async ({ page }) => {
  await login(page, 'locked_out_user', 'secret_sauce');

  await expect(page.getByText('this user has been locked out')).toBeVisible();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});
