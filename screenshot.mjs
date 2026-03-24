import { chromium } from '/Users/adamkondracki/Library/Caches/ms-playwright-go/1.50.1/package/index.mjs';
import path from 'path';
import fs from 'fs';

const url = process.argv[2] || 'http://localhost:3001';
const label = process.argv[3] || '';

const dir = path.join(path.dirname(new URL(import.meta.url).pathname), 'temporary screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

let n = 1;
while (fs.existsSync(path.join(dir, `screenshot-${n}${label ? '-' + label : ''}.png`))) n++;
const outFile = path.join(dir, `screenshot-${n}${label ? '-' + label : ''}.png`);

const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });

// Force all reveal sections visible for screenshot
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('hidden');
    el.classList.add('visible');
  });
});
await page.waitForTimeout(300);

await page.screenshot({ path: outFile, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${outFile}`);
