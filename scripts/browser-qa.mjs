import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const baseUrl = 'http://127.0.0.1:5217';
const outputDir = 'artifacts/browser-qa';
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`console: ${message.text()}`);
});
page.on('pageerror', (error) => errors.push(`page: ${error.message}`));

async function assertNoHorizontalOverflow(label) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  if (dimensions.scrollWidth > dimensions.clientWidth + 1) {
    throw new Error(`${label}: horizontal overflow ${dimensions.scrollWidth}px > ${dimensions.clientWidth}px`);
  }
}

async function assertImagesLoaded(label) {
  await page.locator('img').evaluateAll((images) => Promise.all(images.map((image) => {
    image.loading = 'eager';
    if (image.complete) return Promise.resolve();
    return new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  })));
  const broken = await page.locator('img').evaluateAll((images) =>
    images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.getAttribute('src')),
  );
  if (broken.length) throw new Error(`${label}: broken images ${broken.join(', ')}`);
}

async function preparePage(label) {
  await assertImagesLoaded(label);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewportHeight = page.viewportSize()?.height ?? 800;
  for (let position = 0; position < height; position += Math.max(420, viewportHeight * 0.7)) {
    await page.evaluate((y) => window.scrollTo(0, y), position);
    await page.waitForTimeout(55);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1250);
}

async function assertHomepageRedesign() {
  const viewportWidth = page.viewportSize()?.width ?? 1440;
  const marquee = await page.locator('.marquee__group').evaluateAll((groups) => groups.map((group) => ({
    width: group.getBoundingClientRect().width,
    phrases: group.querySelectorAll('span').length,
  })));
  if (marquee.length !== 2 || marquee.some((group) => group.width < viewportWidth - 1 || group.phrases !== 4)) {
    throw new Error(`marquee is not built from two full-width matching groups: ${JSON.stringify(marquee)}`);
  }
  if (Math.abs(marquee[0].width - marquee[1].width) > 1) {
    throw new Error(`marquee groups have different widths: ${marquee[0].width}px and ${marquee[1].width}px`);
  }

  const featured = await page.locator('.product-grid--featured .product-card').evaluateAll((cards) => cards.map((card) => {
    const image = card.querySelector('.product-card__image')?.getBoundingClientRect();
    const body = card.querySelector('.product-card__body')?.getBoundingClientRect();
    return { imageBottom: image?.bottom ?? 0, bodyTop: body?.top ?? 0 };
  }));
  if (featured.length !== 4 || featured.some((card) => card.bodyTop < card.imageBottom)) {
    throw new Error(`featured cards are not consistently image-above-copy: ${JSON.stringify(featured)}`);
  }

  const orderCards = await page.locator('.order-steps li').evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().height));
  if (orderCards.length !== 3 || orderCards.some((height) => height > 240)) {
    throw new Error(`order steps are too tall: ${orderCards.join(', ')}px`);
  }

  const navFontSize = await page.locator('.desktop-nav a').first().evaluate((link) => Number.parseFloat(getComputedStyle(link).fontSize));
  if (navFontSize < 14) throw new Error(`desktop navigation font is still too small: ${navFontSize}px`);
}

await page.goto(baseUrl, { waitUntil: 'networkidle' });
await preparePage('home desktop');
await assertHomepageRedesign();
await page.screenshot({ path: `${outputDir}/home-1440.png`, fullPage: true });
await page.locator('.marquee').screenshot({ path: `${outputDir}/marquee-1440.png` });
await page.locator('.selection').screenshot({ path: `${outputDir}/selection-1440.png` });
await page.locator('.order-story').screenshot({ path: `${outputDir}/order-story-1440.png` });

const wordmarkBefore = await page.locator('.wordmark > span').evaluate((element) => ({
  color: getComputedStyle(element).color,
  transform: getComputedStyle(element).transform,
}));
await page.locator('.wordmark').hover();
await page.waitForTimeout(600);
const wordmarkAfter = await page.locator('.wordmark > span').evaluate((element) => ({
  color: getComputedStyle(element).color,
  transform: getComputedStyle(element).transform,
}));
if (wordmarkBefore.color === wordmarkAfter.color && wordmarkBefore.transform === wordmarkAfter.transform) {
  throw new Error('wordmark hover has no visible animation');
}
await page.locator('.site-header').screenshot({ path: `${outputDir}/wordmark-hover-1440.png` });
await assertNoHorizontalOverflow('home desktop');

for (const viewport of [
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-320', width: 320, height: 700 },
]) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await preparePage(`home ${viewport.name}`);
  await page.screenshot({ path: `${outputDir}/home-${viewport.name}.png`, fullPage: true });
  await assertNoHorizontalOverflow(`home ${viewport.name}`);
}

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(baseUrl, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Открыть меню' }).click();
await page.locator('.mobile-menu').getByRole('link', { name: '02 О мастерской' }).waitFor({ state: 'visible' });
await page.screenshot({ path: `${outputDir}/mobile-menu-390.png`, fullPage: false });
await page.getByRole('button', { name: 'Закрыть меню' }).click();

await page.goto(`${baseUrl}/catalog`, { waitUntil: 'networkidle' });
await page.getByRole('searchbox', { name: 'Поиск по каталогу' }).fill('Клевер');
await page.waitForURL((url) => url.searchParams.get('q') === 'Клевер');
if (!page.url().includes('q=')) throw new Error('catalog search is not reflected in URL');
await page.locator('a.product-card__image[href="/product/pussety-klevera"]').click();
await page.getByRole('button', { name: 'Добавить в заявку' }).click();

await page.goto(`${baseUrl}/product/sotuar-pautinka-letnyaya`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Добавить в заявку' }).click();
await page.getByRole('link', { name: 'Заявка, товаров: 2' }).click();
const summerItem = page.locator('.request-item').filter({ hasText: 'Сотуар-паутинка «Летняя»' });
await summerItem.getByText('Параметры для этого украшения').click();
await summerItem.getByLabel('Желаемый оттенок необязательно').fill('сиреневый');
await page.getByLabel('Ваше имя').fill('Анна');
await page.getByLabel('Telegram или телефон').fill('@anna');
await page.screenshot({ path: `${outputDir}/request-390.png`, fullPage: true });
const requestTypography = await page.locator('.request-summary input').first().evaluate((input) => ({
  input: Number.parseFloat(getComputedStyle(input).fontSize),
  label: Number.parseFloat(getComputedStyle(input.closest('label')?.querySelector('span') ?? input).fontSize),
}));
if (requestTypography.input < 15 || requestTypography.label < 13) {
  throw new Error(`request form typography is still too small: ${JSON.stringify(requestTypography)}`);
}
await page.getByRole('button', { name: 'Подготовить текст заявки' }).click();
await page.getByRole('heading', { name: /Осталось отправить|Скопируйте и отправьте/ }).waitFor();
const summary = await page.getByLabel('Текст заявки').textContent();
if (!summary.includes('цена по запросу') || !summary.includes('сиреневый') || !/2[\s\u00a0]900 ₽/.test(summary)) {
  throw new Error('request summary lost price or customization data');
}
if (await page.getByRole('link', { name: 'Открыть чат с Мариной' }).getAttribute('href') !== 'https://t.me/Osovskaya_Marina') {
  throw new Error('Telegram handoff points to the wrong recipient');
}
await page.screenshot({ path: `${outputDir}/request-ready-390.png`, fullPage: true });

for (const route of ['/about', '/delivery', '/privacy', '/does-not-exist']) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
  await assertNoHorizontalOverflow(route);
  await assertImagesLoaded(route);
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${baseUrl}/product/pussety-klevera`, { waitUntil: 'networkidle' });
const productTitleMetrics = await page.locator('.product-detail__copy h1').evaluate((heading) => ({
  lineHeight: Number.parseFloat(getComputedStyle(heading).lineHeight),
  fontSize: Number.parseFloat(getComputedStyle(heading).fontSize),
  gapToPrice: (heading.nextElementSibling?.getBoundingClientRect().top ?? 0) - heading.getBoundingClientRect().bottom,
}));
if (productTitleMetrics.lineHeight < productTitleMetrics.fontSize * 1.18 || productTitleMetrics.gapToPrice < 16) {
  throw new Error(`product title lines collide or overflow: ${JSON.stringify(productTitleMetrics)}`);
}
await page.locator('.product-detail').screenshot({ path: `${outputDir}/product-clover-1440.png` });

await page.goto(`${baseUrl}/about`, { waitUntil: 'networkidle' });
await preparePage('about redesign');
const valuesHeight = await page.locator('.value-grid').evaluate((grid) => grid.getBoundingClientRect().height);
if (valuesHeight > 560) throw new Error(`about values section is still too tall: ${valuesHeight}px`);
await page.locator('.about-values').screenshot({ path: `${outputDir}/about-values-1440.png` });

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${baseUrl}/delivery`, { waitUntil: 'networkidle' });
const firstFaq = page.locator('.faq-list details').first();
const markerBefore = await firstFaq.locator('summary').evaluate((summary) => getComputedStyle(summary, '::after').content);
if (!markerBefore.includes('+')) throw new Error(`FAQ closed marker is unexpected: ${markerBefore}`);
await firstFaq.locator('summary').click();
const markerAfter = await firstFaq.locator('summary').evaluate((summary) => getComputedStyle(summary, '::after').content);
if (!markerAfter.includes('−')) throw new Error(`FAQ open marker is unexpected: ${markerAfter}`);
await page.locator('.faq-section').screenshot({ path: `${outputDir}/faq-open-1440.png` });

await browser.close();

if (errors.length) {
  throw new Error(errors.join('\n'));
}

console.log('Browser QA passed: responsive layouts, redesign geometry, hover and FAQ states, routes, catalog search, cart, customization, recovery and Telegram handoff.');
