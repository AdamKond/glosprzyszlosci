import { chromium } from '/Users/adamkondracki/Library/Caches/ms-playwright-go/1.50.1/package/index.mjs';
import path from 'path';
import fs from 'fs';

const url = process.argv[2] || 'http://localhost:3001';
const selector = process.argv[3] || 'body';
const label = process.argv[4] || 'section';

const dir = path.join(path.dirname(new URL(import.meta.url).pathname), 'temporary screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

let n = 1;
while (fs.existsSync(path.join(dir, `screenshot-${n}-${label}.png`))) n++;
const outFile = path.join(dir, `screenshot-${n}-${label}.png`);

const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('hidden');
    el.classList.add('visible');
  });
});
await page.waitForTimeout(300);

const el = await page.$(selector);
if (el) {
  await el.screenshot({ path: outFile });
} else {
  await page.screenshot({ path: outFile });
}
await browser.close();
console.log(`Saved: ${outFile}`);
