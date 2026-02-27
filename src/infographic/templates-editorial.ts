import { GeneratedContent, SlideContent } from '../content/generator';

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600;700;800;900&display=swap');`;

const RESET = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; height: 1350px; overflow: hidden; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
`;

interface EditorialTheme {
  accent: string;
  accentRgb: string;
  accentLight: string;
}

const EDITORIAL_THEMES: EditorialTheme[] = [
  { accent: '#1E3A5F', accentRgb: '30,58,95', accentLight: '#EFF6FF' },
  { accent: '#7C2D12', accentRgb: '124,45,18', accentLight: '#FFF7ED' },
  { accent: '#14532D', accentRgb: '20,83,45', accentLight: '#F0FDF4' },
  { accent: '#4C1D95', accentRgb: '76,29,149', accentLight: '#FAF5FF' },
  { accent: '#1C1917', accentRgb: '28,25,23', accentLight: '#FAFAF9' },
];

function pickEditorialTheme(): EditorialTheme {
  return EDITORIAL_THEMES[Math.floor(Math.random() * EDITORIAL_THEMES.length)];
}

function renderCover(content: GeneratedContent, theme: EditorialTheme, bgBase64: string): string {
  const imgCss = bgBase64
    ? `background: url('${bgBase64}') center/cover no-repeat;`
    : `background: linear-gradient(135deg, ${theme.accentLight} 0%, #E5E7EB 100%);`;

  return `<!DOCTYPE html><html><head><style>
    ${FONTS} ${RESET}
    body { background: #FFFFFF; }
    .hero { width: 1080px; height: 580px; ${imgCss} position: relative; }
    .hero::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 120px;
      background: linear-gradient(to bottom, transparent, #FFFFFF);
    }
    .text-area {
      padding: 48px 80px 70px;
      display: flex; flex-direction: column; justify-content: space-between;
      height: 770px;
    }
    .label {
      display: inline-block; border: 2px solid ${theme.accent}; color: ${theme.accent};
      font-size: 14px; font-weight: 800; padding: 8px 20px;
      border-radius: 4px; text-transform: uppercase; letter-spacing: 4px;
      margin-bottom: 36px; width: fit-content;
    }
    .title {
      font-family: 'Libre Baskerville', serif;
      font-size: 80px; font-weight: 700; line-height: 1.1;
      color: ${theme.accent}; margin-bottom: 28px; max-width: 920px;
    }
    .subtitle {
      font-size: 26px; font-weight: 400; color: #6B7280;
      line-height: 1.55; max-width: 780px;
    }
    .bottom {
      display: flex; justify-content: space-between; align-items: center;
      border-top: 2px solid ${theme.accent}; padding-top: 24px;
    }
    .brand { font-size: 16px; font-weight: 800; color: ${theme.accent}; letter-spacing: 4px; text-transform: uppercase; }
    .swipe { font-size: 14px; color: #9CA3AF; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
  </style></head><body>
    <div class="hero"></div>
    <div class="text-area">
      <div>
        <span class="label">Climate Explainer</span>
        <h1 class="title">${esc(content.coverTitle)}</h1>
        <p class="subtitle">${esc(content.coverSubtitle)}</p>
      </div>
      <div class="bottom">
        <span class="brand">Climate Watch</span>
        <span class="swipe">Swipe to read &rarr;</span>
      </div>
    </div>
  </body></html>`;
}

function renderBars(slide: SlideContent, theme: EditorialTheme): string {
  if (!slide.bars || slide.bars.length === 0) return '';
  return `<div class="chart-card">${slide.bars.map(b => `
    <div class="bar-row">
      <div class="bar-header">
        <span class="bar-label">${esc(b.label)}</span>
        <span class="bar-value">${esc(b.displayValue)}</span>
      </div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.min(b.value, 100)}%"></div></div>
    </div>`).join('')}</div>`;
}

function renderDonut(slide: SlideContent, theme: EditorialTheme): string {
  if (!slide.donut || slide.donut.length === 0) return '';
  const segs = slide.donut;
  let cum = 0;
  const stops: string[] = [];
  const ops = [1, 0.6, 0.35, 0.2, 0.12];
  for (let i = 0; i < segs.length; i++) {
    const s = cum; cum += segs[i].percent;
    const op = segs[i].highlight ? 1 : (ops[i] || 0.12);
    stops.push(`rgba(${theme.accentRgb},${op}) ${s * 3.6}deg ${cum * 3.6}deg`);
  }
  return `<div class="chart-card donut-wrap">
    <div class="donut-chart">
      <div class="donut-ring" style="background:conic-gradient(${stops.join(',')})"></div>
      <div class="donut-center"><span class="donut-val">${segs.find(s => s.highlight)?.percent || segs[0].percent}%</span></div>
    </div>
    <div class="donut-legend">${segs.map((s, i) => `
      <div class="legend-item">
        <span class="legend-dot" style="opacity:${s.highlight ? 1 : (ops[i] || 0.12)};background:${theme.accent}"></span>
        <span class="legend-lbl">${esc(s.label)}</span>
        <span class="legend-pct">${s.percent}%</span>
      </div>`).join('')}
    </div>
  </div>`;
}

function renderCompare(slide: SlideContent, theme: EditorialTheme): string {
  if (!slide.compare || slide.compare.length < 2) return '';
  const [a, b] = slide.compare;
  return `<div class="chart-card compare-wrap">
    <div class="compare-item">
      <div class="compare-val">${esc(a.value)}</div>
      <div class="compare-lbl">${esc(a.label)}</div>
      <div class="compare-desc">${esc(a.description)}</div>
    </div>
    <div class="compare-vs">vs</div>
    <div class="compare-item compare-alt">
      <div class="compare-val">${esc(b.value)}</div>
      <div class="compare-lbl">${esc(b.label)}</div>
      <div class="compare-desc">${esc(b.description)}</div>
    </div>
  </div>`;
}

function renderRanked(slide: SlideContent, theme: EditorialTheme): string {
  if (!slide.ranked || slide.ranked.length === 0) return '';
  return `<div class="chart-card">${slide.ranked.map(r => `
    <div class="rank-row">
      <span class="rank-num">#${r.rank}</span>
      <span class="rank-lbl">${esc(r.label)}</span>
      <span class="rank-val">${esc(r.value)}</span>
    </div>`).join('')}</div>`;
}

function renderChart(slide: SlideContent, theme: EditorialTheme): string {
  switch (slide.chartType) {
    case 'donut': return renderDonut(slide, theme);
    case 'compare': return renderCompare(slide, theme);
    case 'ranked': return renderRanked(slide, theme);
    case 'bars': default: return renderBars(slide, theme);
  }
}

function renderFact(slide: SlideContent, num: number, total: number, theme: EditorialTheme): string {
  const chart = renderChart(slide, theme);
  const stats = `<div class="stats-row">
    <div class="stat-card">
      <div class="stat-num">${esc(slide.stat)}</div>
      <div class="stat-lbl">${esc(slide.statLabel)}</div>
    </div>
    ${slide.secondaryStat ? `<div class="stat-card">
      <div class="stat-num">${esc(slide.secondaryStat)}</div>
      <div class="stat-lbl">${esc(slide.secondaryStatLabel || '')}</div>
    </div>` : ''}</div>`;

  return `<!DOCTYPE html><html><head><style>
    ${FONTS} ${RESET}
    body { background: #FFFFFF; }
    .wrap { width: 1080px; height: 1350px; display: flex; flex-direction: column; padding: 40px 60px 40px; }

    .progress { display: flex; gap: 6px; margin-bottom: 12px; }
    .progress .dot { height: 6px; flex: 1; border-radius: 3px; background: #E5E7EB; }
    .progress .dot.active { background: ${theme.accent}; }

    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #E5E7EB; }
    .slide-num { font-size: 18px; color: #9CA3AF; font-weight: 700; letter-spacing: 2px; }
    .brand { font-size: 16px; color: #9CA3AF; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; }

    .accent-strip { width: 8px; height: 50px; background: ${theme.accent}; border-radius: 4px; margin-bottom: 20px; }
    .heading {
      font-family: 'Libre Baskerville', serif;
      font-size: 86px; font-weight: 700; color: #111827; line-height: 1.08;
      margin-bottom: 18px;
    }
    .body { font-size: 28px; font-weight: 400; color: #6B7280; line-height: 1.55; margin-bottom: 28px; }

    .data-area { flex: 1; display: flex; flex-direction: column; gap: 18px; }

    .stats-row { display: flex; gap: 16px; }
    .stat-card {
      background: ${theme.accentLight}; border: none;
      border-radius: 16px; padding: 44px 32px; flex: 1;
    }
    .stat-num {
      font-family: 'Libre Baskerville', serif;
      font-size: 68px; font-weight: 700; color: ${theme.accent};
      line-height: 1; margin-bottom: 12px;
    }
    .stat-lbl { font-size: 22px; font-weight: 500; color: #6B7280; line-height: 1.35; }

    .chart-card {
      background: ${theme.accentLight}; border: none;
      border-radius: 16px; padding: 40px 32px; flex: 1;
      display: flex; flex-direction: column; gap: 28px; justify-content: center;
    }
    .bar-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .bar-label { font-size: 26px; font-weight: 700; color: #111827; }
    .bar-value { font-size: 26px; font-weight: 800; color: ${theme.accent}; }
    .bar-track { height: 24px; background: rgba(${theme.accentRgb},0.12); border-radius: 12px; overflow: hidden; }
    .bar-fill { height: 100%; background: ${theme.accent}; border-radius: 12px; }

    .donut-wrap { flex-direction: row; align-items: center; gap: 44px; padding: 36px 32px; }
    .donut-chart { position: relative; width: 240px; height: 240px; flex-shrink: 0; }
    .donut-ring { width: 240px; height: 240px; border-radius: 50%; }
    .donut-center {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
      width: 130px; height: 130px; border-radius: 50%; background: ${theme.accentLight};
      display: flex; align-items: center; justify-content: center;
    }
    .donut-val { font-family: 'Libre Baskerville', serif; font-size: 48px; color: ${theme.accent}; font-weight: 700; }
    .donut-legend { display: flex; flex-direction: column; gap: 22px; flex: 1; }
    .legend-item { display: flex; align-items: center; gap: 14px; }
    .legend-dot { width: 22px; height: 22px; border-radius: 6px; flex-shrink: 0; }
    .legend-lbl { font-size: 26px; color: #374151; font-weight: 500; flex: 1; }
    .legend-pct { font-size: 26px; color: ${theme.accent}; font-weight: 800; }

    .compare-wrap { flex-direction: row; align-items: center; gap: 0; }
    .compare-item { flex: 1; text-align: center; padding: 56px 24px; }
    .compare-alt { background: rgba(${theme.accentRgb},0.08); border-radius: 0 16px 16px 0; margin: -40px -32px -40px 0; padding: 84px 32px; }
    .compare-val { font-family: 'Libre Baskerville', serif; font-size: 60px; color: ${theme.accent}; font-weight: 700; margin-bottom: 14px; }
    .compare-lbl { font-size: 26px; font-weight: 800; color: #111827; margin-bottom: 10px; }
    .compare-desc { font-size: 20px; color: #6B7280; line-height: 1.4; }
    .compare-vs { font-size: 26px; font-weight: 800; color: #D1D5DB; padding: 0 18px; flex-shrink: 0; }

    .rank-row { display: flex; align-items: center; gap: 20px; padding: 26px 0; border-bottom: 1px solid rgba(${theme.accentRgb},0.1); }
    .rank-row:last-child { border-bottom: none; }
    .rank-num { font-family: 'Libre Baskerville', serif; font-size: 42px; color: ${theme.accent}; font-weight: 700; width: 60px; flex-shrink: 0; }
    .rank-lbl { font-size: 26px; font-weight: 700; color: #111827; flex: 1; }
    .rank-val { font-size: 24px; font-weight: 800; color: ${theme.accent}; }

    .source-bar {
      background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px;
      padding: 18px 26px; display: flex; align-items: center; gap: 12px; margin-top: 18px;
    }
    .source-icon { font-size: 15px; color: ${theme.accent}; font-weight: 800; letter-spacing: 1px; }
    .source-text { font-size: 17px; color: #9CA3AF; font-weight: 500; }
  </style></head><body>
    <div class="wrap">
      <div class="progress">
        ${Array.from({ length: total }, (_, i) => `<div class="dot${i < num ? ' active' : ''}"></div>`).join('')}
      </div>
      <div class="header">
        <span class="slide-num">${String(num).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
        <span class="brand">Climate Watch</span>
      </div>
      <div class="accent-strip"></div>
      <h2 class="heading">${esc(slide.heading)}</h2>
      <p class="body">${esc(slide.body)}</p>
      <div class="data-area">
        ${stats}
        ${chart}
      </div>
      <div class="source-bar">
        <span class="source-icon">SOURCE</span>
        <span class="source-text">${esc(slide.source || '')}</span>
      </div>
    </div>
  </body></html>`;
}

export function renderEditorialSlides(content: GeneratedContent, bgBase64: string): string[] {
  const theme = pickEditorialTheme();
  const total = content.slides.length + 1;
  const slides: string[] = [renderCover(content, theme, bgBase64)];
  for (let i = 0; i < content.slides.length; i++) {
    slides.push(renderFact(content.slides[i], i + 2, total, theme));
  }
  return slides;
}
