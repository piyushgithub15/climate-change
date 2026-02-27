import puppeteer, { Browser } from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { GeneratedContent } from '../content/generator';
import { renderAllSlides } from './templates';
import { renderNoirSlides } from './templates-noir';
import { renderEditorialSlides } from './templates-editorial';

export type TemplateStyle = 'clean' | 'noir' | 'editorial';

const TMP_DIR = path.resolve(__dirname, '..', '..', 'tmp');

export function pickTemplateStyle(): TemplateStyle {
  const styles: TemplateStyle[] = ['clean', 'noir', 'editorial'];
  return styles[Math.floor(Math.random() * styles.length)];
}

export function templateNeedsImage(_style: TemplateStyle): boolean {
  return true;
}

function imageToBase64DataUrl(imagePath: string): string {
  const buffer = fs.readFileSync(imagePath);
  const base64 = buffer.toString('base64');
  const ext = path.extname(imagePath).replace('.', '');
  const mime = ext === 'jpg' ? 'jpeg' : ext;
  return `data:image/${mime};base64,${base64}`;
}

async function renderSlide(browser: Browser, html: string, outputPath: string): Promise<void> {
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });

  await page.setContent(html, {
    waitUntil: 'networkidle0',
    timeout: 30_000,
  });

  await page.evaluate('document.fonts.ready');

  await page.screenshot({
    path: outputPath,
    type: 'png',
    clip: { x: 0, y: 0, width: 1080, height: 1350 },
  });

  await page.close();
}

export async function renderCarouselSlides(
  content: GeneratedContent,
  style: TemplateStyle = 'clean',
  bgImagePath?: string,
): Promise<string[]> {
  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
  }

  const bgBase64 = bgImagePath && fs.existsSync(bgImagePath)
    ? imageToBase64DataUrl(bgImagePath)
    : '';

  let slideHtmls: string[];
  switch (style) {
    case 'noir':
      slideHtmls = renderNoirSlides(content, bgBase64);
      break;
    case 'editorial':
      slideHtmls = renderEditorialSlides(content, bgBase64);
      break;
    case 'clean':
    default:
      slideHtmls = renderAllSlides(content, bgBase64);
      break;
  }

  const timestamp = Date.now();
  const outputPaths: string[] = [];

  console.log(`[renderer] Rendering ${slideHtmls.length} slides (template: ${style})...`);

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
