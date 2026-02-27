import puppeteer, { Browser } from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { GeneratedContent } from '../content/generator';
import { renderAllSlides } from './templates';

const TMP_DIR = path.resolve(__dirname, '..', '..', 'tmp');

/**
 * Render a single HTML string to a 1080x1080 PNG.
 */
async function renderSlide(browser: Browser, html: string, outputPath: string): Promise<void> {
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });

  await page.setContent(html, {
    waitUntil: 'networkidle0',
    timeout: 30_000,
  });

  await page.evaluate('document.fonts.ready');

  await page.screenshot({
    path: outputPath,
    type: 'png',
    clip: { x: 0, y: 0, width: 1080, height: 1080 },
  });

  await page.close();
}

/**
 * Render all carousel slides as individual 1080x1080 PNGs.
 * Returns array of file paths.
 */
export async function renderCarouselSlides(
  content: GeneratedContent,
): Promise<string[]> {
  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
  }

  const slideHtmls = renderAllSlides(content, '');
  const timestamp = Date.now();
  const outputPaths: string[] = [];

  console.log(`[renderer] Rendering ${slideHtmls.length} carousel slides...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  try {
    for (let i = 0; i < slideHtmls.length; i++) {
      const outputPath = path.join(TMP_DIR, `slide-${timestamp}-${i + 1}.png`);
      await renderSlide(browser, slideHtmls[i], outputPath);
      outputPaths.push(outputPath);
      console.log(`[renderer] Slide ${i + 1}/${slideHtmls.length} saved`);
    }
  } finally {
    await browser.close();
  }

  return outputPaths;
}
