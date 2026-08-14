const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const page = await ctx.newPage();

  const outDir = path.join(__dirname, '..', 'download', 'color-preview');
  const fs = require('fs');
  fs.mkdirSync(outDir, { recursive: true });

  // Landing page
  await page.goto('http://127.0.0.1:3789', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outDir, '01-landing.png'), fullPage: false });

  // Scroll down on landing
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '02-landing-mid.png'), fullPage: false });

  await browser.close();
  console.log('Screenshots saved to', outDir);
})();
