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

// Тест 4: нэвтэрсний дараах үйлдэл: бараа сагсанд хийх.
// Элементүүдийг getByTestId-ээр олсон (saucedemo-ийн data-test атрибут, config-д
// testIdAttribute: 'data-test' гэж зааж өгсөн). Ийм locator нь текст, дизайн
// өөрчлөгдсөн ч тогтвортой байдаг.
test('барааг сагсанд нэмэх', async ({ page }) => {
  await login(page, 'standard_user', 'secret_sauce');

  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();

  // Товч "Remove" болж, сагсны тоолуур 1 болсон эсэх
  await expect(page.getByTestId('remove-sauce-labs-backpack')).toBeVisible();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

  // Сагс руу орж, нэмсэн бараа харагдаж буйг шалгах
  await page.getByTestId('shopping-cart-link').click();
  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();

  await logout(page);
});
