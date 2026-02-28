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

function renderTrendChart(slide: SlideContent, theme: EditorialTheme): string {
  if (!slide.trend || slide.trend.length === 0) return '';
  const points = slide.trend;
  const title = slide.trendLabel || '';
  const maxVal = Math.max(...points.map(p => p.value));
  const minVal = Math.min(...points.map(p => p.value));
  const range = maxVal - minVal || 1;
  const svgW = 860;
  const svgH = 280;
  const padX = 20;
  const padY = 40;
  const plotW = svgW - padX * 2;
  const plotH = svgH - padY * 2;

  const coords = points.map((p, i) => {
    const x = padX + (i / (points.length - 1)) * plotW;
    const y = padY + plotH - ((p.value - minVal) / range) * plotH;
    return { x, y, label: p.label, value: p.value, displayValue: p.displayValue || String(p.value) };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${svgH - padY} L ${coords[0].x} ${svgH - padY} Z`;

  return `
    <div class="chart-card" style="padding: 30px 20px;">
      ${title ? `<div style="font-size:22px; font-weight:700; color:#111827; margin-bottom:8px; padding:0 10px; font-family:'Inter',sans-serif;">${esc(title)}</div>` : ''}
      <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="display:block; width:100%; height:auto;">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0.03"/>
          </linearGradient>
        </defs>
        <line x1="${padX}" y1="${svgH - padY}" x2="${svgW - padX}" y2="${svgH - padY}" stroke="#E5E7EB" stroke-width="1"/>
        <path d="${areaPath}" fill="url(#areaGrad)"/>
        <path d="${linePath}" fill="none" stroke="${theme.accent}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${coords.map(c => `
          <circle cx="${c.x}" cy="${c.y}" r="6" fill="${theme.accent}"/>
          <circle cx="${c.x}" cy="${c.y}" r="3" fill="${theme.accentLight}"/>
          <text x="${c.x}" y="${svgH - 5}" text-anchor="middle" fill="#6B7280" font-size="18" font-family="'Inter',sans-serif">${esc(c.label)}</text>
          <text x="${c.x}" y="${c.y - 16}" text-anchor="middle" fill="${theme.accent}" font-size="17" font-weight="700" font-family="'Inter',sans-serif">${esc(c.displayValue)}</text>
        `).join('')}
      </svg>
    </div>
  `;
}

function renderPictogramChart(slide: SlideContent, theme: EditorialTheme): string {
  if (!slide.pictogram) return '';
  const { filled, total, filledLabel, emptyLabel } = slide.pictogram;
  const icons: string[] = [];
  for (let i = 0; i < total; i++) {
    const isFilled = i < filled;
    const color = isFilled ? theme.accent : '#E5E7EB';
    const opacity = isFilled ? '1' : '0.3';
    icons.push(`
      <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="${color}" opacity="${opacity}">
          <circle cx="12" cy="7" r="4"/>
          <path d="M12 13c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z"/>
        </svg>
      </div>
    `);
  }
  return `
    <div class="chart-card" style="padding: 30px; display:flex; flex-direction:column; align-items:center; gap:20px;">
      <div style="display:flex; gap:16px; flex-wrap:wrap; justify-content:center;">
        ${icons.join('')}
      </div>
      <div style="display:flex; gap:28px; align-items:center; font-size:20px; font-family:'Inter',sans-serif;">
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:14px; height:14px; border-radius:50%; background:${theme.accent};"></div>
          <span style="color:#111827;">${filled}/${total} ${esc(filledLabel)}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:14px; height:14px; border-radius:50%; background:#E5E7EB; opacity:0.3;"></div>
          <span style="color:#6B7280;">${total - filled}/${total} ${esc(emptyLabel)}</span>
        </div>
      </div>
    </div>
  `;
}

function renderChart(slide: SlideContent, theme: EditorialTheme): string {
  switch (slide.chartType) {
    case 'donut': return renderDonut(slide, theme);
    case 'compare': return renderCompare(slide, theme);
    case 'ranked': return renderRanked(slide, theme);
    case 'trend': return renderTrendChart(slide, theme);
    case 'pictogram': return renderPictogramChart(slide, theme);
    case 'bars': default: return renderBars(slide, theme);
  }
}

function renderFact(slide: SlideContent, num: number, total: number, theme: EditorialTheme): string {
  const chart = renderChart(slide, theme);
  const layout = num % 3;
  const stats = `<div class="stats-row">
    <div class="stat-card">
      <div class="stat-num">${esc(slide.stat)}</div>
      <div class="stat-lbl">${esc(slide.statLabel)}</div>
    </div>
    ${slide.secondaryStat ? `<div class="stat-card">
      <div class="stat-num">${esc(slide.secondaryStat)}</div>
      <div class="stat-lbl">${esc(slide.secondaryStatLabel || '')}</div>
    </div>` : ''}</div>`;

  const bigStat = `
    <div class="big-stat-hero">
      <div class="big-stat-number">${esc(slide.stat)}</div>
      <div class="big-stat-label">${esc(slide.statLabel)}</div>
    </div>`;

  let contentBlock: string;
  if (layout === 1) {
    contentBlock = `
      <div class="data-area chart-first-layout">${chart}</div>
      <h2 class="heading heading-sm">${esc(slide.heading)}</h2>
      <p class="body">${esc(slide.body)}</p>
      ${stats}`;
  } else if (layout === 2) {
    contentBlock = `
      ${bigStat}
      <h2 class="heading heading-sm">${esc(slide.heading)}</h2>
      <p class="body">${esc(slide.body)}</p>
      <div class="data-area">${chart}</div>`;
  } else {
    contentBlock = `
      <h2 class="heading">${esc(slide.heading)}</h2>
      <p class="body">${esc(slide.body)}</p>
      <div class="data-area">${stats}${chart}</div>`;
  }

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
    .heading-sm { font-size: 62px; margin-bottom: 10px; }
    .body { font-size: 28px; font-weight: 400; color: #6B7280; line-height: 1.55; margin-bottom: 28px; }

    .data-area { flex: 1; display: flex; flex-direction: column; gap: 18px; }
    .chart-first-layout { margin-bottom: 20px; }

    .big-stat-hero {
      background: ${theme.accent}; border-radius: 20px; padding: 48px 40px;
      margin-bottom: 24px; text-align: center;
    }
    .big-stat-number {
      font-family: 'Libre Baskerville', serif;
      font-size: 110px; font-weight: 700; color: #FFFFFF;
      line-height: 1; margin-bottom: 10px;
    }
    .big-stat-label { font-size: 26px; font-weight: 600; color: #FFFFFF; opacity: 0.85; }

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
      ${contentBlock}
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
