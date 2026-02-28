import { GeneratedContent, SlideContent } from '../content/generator';

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');`;

const RESET = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; height: 1350px; overflow: hidden; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
`;

interface ColorTheme {
  bg: string;
  cardBg: string;
  accent: string;
  accentSoft: string;
  accentLight: string;
  text: string;
  textSecondary: string;
  border: string;
}

const THEMES: ColorTheme[] = [
  {
    bg: '#FAFAFA', cardBg: '#FFFFFF', accent: '#1A1A2E', accentSoft: '#E8E8F0',
    accentLight: '#F4F4F8', text: '#1A1A2E', textSecondary: '#6B7280', border: '#E5E7EB',
  },
  {
    bg: '#FFF8F0', cardBg: '#FFFFFF', accent: '#D97706', accentSoft: '#FEF3C7',
    accentLight: '#FFFBEB', text: '#1C1917', textSecondary: '#78716C', border: '#E7E5E4',
  },
  {
    bg: '#F0FDF4', cardBg: '#FFFFFF', accent: '#166534', accentSoft: '#DCFCE7',
    accentLight: '#ECFDF5', text: '#14532D', textSecondary: '#6B7280', border: '#D1FAE5',
  },
  {
    bg: '#EFF6FF', cardBg: '#FFFFFF', accent: '#1E40AF', accentSoft: '#DBEAFE',
    accentLight: '#EFF6FF', text: '#1E3A5F', textSecondary: '#6B7280', border: '#BFDBFE',
  },
  {
    bg: '#FAF5FF', cardBg: '#FFFFFF', accent: '#7C3AED', accentSoft: '#EDE9FE',
    accentLight: '#F5F3FF', text: '#2E1065', textSecondary: '#6B7280', border: '#E9D5FF',
  },
];

function pickTheme(): ColorTheme {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
}

// =============================================
// COVER SLIDE  (1080 x 1350)
// =============================================
function renderCoverSlide(content: GeneratedContent, theme: ColorTheme, bgBase64: string): string {
  const bgStyle = bgBase64
    ? `background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.88) 100%), url('${bgBase64}') center/cover no-repeat;`
    : `background: ${theme.bg};`;
  const hasImg = !!bgBase64;

  return `<!DOCTYPE html><html><head><style>
    ${FONTS}
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px; height: 1350px; overflow: hidden;
      font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased;
      ${bgStyle}
    }
    .wrap {
      width: 1080px; height: 1350px;
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 0 80px 80px;
    }
    .label {
      display: inline-block;
      background: ${hasImg ? 'rgba(255,255,255,0.12)' : theme.accent};
      color: #FFFFFF;
      font-size: 16px; font-weight: 700; padding: 12px 26px;
      border-radius: 100px; text-transform: uppercase; letter-spacing: 4px;
      margin-bottom: 36px; width: fit-content;
      ${hasImg ? 'backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15);' : ''}
    }
    .divider {
      width: 80px; height: 5px; border-radius: 3px; margin-bottom: 32px;
      background: ${hasImg ? '#FFFFFF' : theme.accent};
    }
    .title {
      font-family: 'DM Serif Display', serif;
      font-size: 92px; font-weight: 400; line-height: 1.08;
      color: ${hasImg ? '#FFFFFF' : theme.text};
      margin-bottom: 24px; max-width: 920px;
    }
    .subtitle {
      font-size: 28px; font-weight: 400; line-height: 1.55; max-width: 800px; margin-bottom: 60px;
      color: ${hasImg ? 'rgba(255,255,255,0.75)' : theme.textSecondary};
    }
    .bottom { display: flex; justify-content: space-between; align-items: flex-end; }
    .brand {
      font-size: 18px; font-weight: 800; letter-spacing: 4px; text-transform: uppercase;
      color: ${hasImg ? 'rgba(255,255,255,0.9)' : theme.accent};
    }
    .swipe {
      font-size: 18px; font-weight: 600;
      color: ${hasImg ? 'rgba(255,255,255,0.5)' : theme.textSecondary};
      display: flex; align-items: center; gap: 14px;
    }
    .swipe-arrow {
      display: inline-block; width: 50px; height: 3px; position: relative;
      background: ${hasImg ? 'rgba(255,255,255,0.5)' : theme.accent};
    }
    .swipe-arrow::after {
      content: ''; position: absolute; right: 0; top: -5px;
      border: solid ${hasImg ? 'rgba(255,255,255,0.5)' : theme.accent};
      border-width: 0 3px 3px 0; padding: 5px; transform: rotate(-45deg);
    }
  </style></head><body>
    <div class="wrap">
      <div>
        <span class="label">Climate Explainer</span>
        <div class="divider"></div>
        <h1 class="title">${esc(content.coverTitle)}</h1>
        <p class="subtitle">${esc(content.coverSubtitle)}</p>
      </div>
      <div class="bottom">
        <span class="brand">Climate Watch</span>
        <span class="swipe">Swipe <span class="swipe-arrow"></span></span>
      </div>
    </div>
  </body></html>`;
}

// =============================================
// CHART RENDERERS
// =============================================

function renderBarsChart(slide: SlideContent, theme: ColorTheme): string {
  if (!slide.bars || slide.bars.length === 0) return '';
  return `
    <div class="chart-card">
      ${slide.bars.map(b => `
        <div class="bar-row">
          <div class="bar-header">
            <span class="bar-label">${esc(b.label)}</span>
            <span class="bar-value">${esc(b.displayValue)}</span>
          </div>
          <div class="bar-track"><div class="bar-fill" style="width: ${Math.min(b.value, 100)}%"></div></div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderDonutChart(slide: SlideContent, theme: ColorTheme): string {
  if (!slide.donut || slide.donut.length === 0) return '';
  const segments = slide.donut;
  let cumulative = 0;
  const gradientStops: string[] = [];
  const opacities = [1, 0.6, 0.35, 0.2, 0.1];

  for (let i = 0; i < segments.length; i++) {
    const start = cumulative;
    cumulative += segments[i].percent;
    const end = cumulative;
    const opacity = segments[i].highlight ? 1 : (opacities[i] || 0.15);
    gradientStops.push(`rgba(${hexToRgb(theme.accent)}, ${opacity}) ${start * 3.6}deg ${end * 3.6}deg`);
  }

  return `
    <div class="chart-card donut-wrap">
      <div class="donut-chart">
        <div class="donut-ring" style="background: conic-gradient(${gradientStops.join(', ')})"></div>
        <div class="donut-center">
          <span class="donut-highlight">${segments.find(s => s.highlight)?.percent || segments[0].percent}%</span>
        </div>
      </div>
      <div class="donut-legend">
        ${segments.map((s, i) => `
          <div class="legend-item">
            <span class="legend-dot" style="opacity: ${s.highlight ? 1 : (opacities[i] || 0.15)}; background: ${theme.accent}"></span>
            <span class="legend-label">${esc(s.label)}</span>
            <span class="legend-pct">${s.percent}%</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderCompareChart(slide: SlideContent, theme: ColorTheme): string {
  if (!slide.compare || slide.compare.length < 2) return '';
  const [a, b] = slide.compare;
  return `
    <div class="chart-card compare-wrap">
      <div class="compare-item">
        <div class="compare-value">${esc(a.value)}</div>
        <div class="compare-label">${esc(a.label)}</div>
        <div class="compare-desc">${esc(a.description)}</div>
      </div>
      <div class="compare-vs">vs</div>
      <div class="compare-item compare-alt">
        <div class="compare-value">${esc(b.value)}</div>
        <div class="compare-label">${esc(b.label)}</div>
        <div class="compare-desc">${esc(b.description)}</div>
      </div>
    </div>
  `;
}

function renderRankedChart(slide: SlideContent, theme: ColorTheme): string {
  if (!slide.ranked || slide.ranked.length === 0) return '';
  return `
    <div class="chart-card">
      ${slide.ranked.map(r => `
        <div class="rank-row">
          <span class="rank-num">#${r.rank}</span>
          <span class="rank-label">${esc(r.label)}</span>
          <span class="rank-value">${esc(r.value)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTrendChart(slide: SlideContent, theme: ColorTheme): string {
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
      ${title ? `<div style="font-size:22px; font-weight:700; color:${theme.text}; margin-bottom:8px; padding:0 10px; font-family:'DM Sans',sans-serif;">${esc(title)}</div>` : ''}
      <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="display:block; width:100%; height:auto;">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0.03"/>
          </linearGradient>
        </defs>
        <line x1="${padX}" y1="${svgH - padY}" x2="${svgW - padX}" y2="${svgH - padY}" stroke="${theme.border}" stroke-width="1"/>
        <path d="${areaPath}" fill="url(#areaGrad)"/>
        <path d="${linePath}" fill="none" stroke="${theme.accent}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${coords.map(c => `
          <circle cx="${c.x}" cy="${c.y}" r="6" fill="${theme.accent}"/>
          <circle cx="${c.x}" cy="${c.y}" r="3" fill="${theme.cardBg}"/>
          <text x="${c.x}" y="${svgH - 5}" text-anchor="middle" fill="${theme.textSecondary}" font-size="18" font-family="'DM Sans',sans-serif">${c.label}</text>
          <text x="${c.x}" y="${c.y - 16}" text-anchor="middle" fill="${theme.accent}" font-size="17" font-weight="700" font-family="'DM Sans',sans-serif">${c.displayValue}</text>
        `).join('')}
      </svg>
    </div>
  `;
}

function renderPictogramChart(slide: SlideContent, theme: ColorTheme): string {
  if (!slide.pictogram) return '';
  const { filled, total, filledLabel, emptyLabel } = slide.pictogram;
  const icons: string[] = [];
  for (let i = 0; i < total; i++) {
    const isFilled = i < filled;
    const color = isFilled ? theme.accent : theme.border;
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
      <div style="display:flex; gap:28px; align-items:center; font-size:20px; font-family:'DM Sans',sans-serif;">
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:14px; height:14px; border-radius:50%; background:${theme.accent};"></div>
          <span style="color:${theme.text};">${filled}/${total} ${filledLabel}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:14px; height:14px; border-radius:50%; background:${theme.border};"></div>
          <span style="color:${theme.textSecondary};">${total - filled}/${total} ${emptyLabel}</span>
        </div>
      </div>
    </div>
  `;
}

function renderChart(slide: SlideContent, theme: ColorTheme): string {
  switch (slide.chartType) {
    case 'donut': return renderDonutChart(slide, theme);
    case 'compare': return renderCompareChart(slide, theme);
    case 'ranked': return renderRankedChart(slide, theme);
    case 'trend': return renderTrendChart(slide, theme);
    case 'pictogram': return renderPictogramChart(slide, theme);
    case 'bars':
    default: return renderBarsChart(slide, theme);
  }
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0, 2), 16)}, ${parseInt(h.substring(2, 4), 16)}, ${parseInt(h.substring(4, 6), 16)}`;
}

// =============================================
// FACT SLIDE  (1080 x 1350)
// =============================================
function renderFactSlide(
  slide: SlideContent,
  slideNum: number,
  totalSlides: number,
  theme: ColorTheme,
): string {
  const chartHtml = renderChart(slide, theme);
  const layout = slideNum % 3; // 0=default, 1=chart-first, 2=big-stat

  const statsHtml = `
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-number">${esc(slide.stat)}</div>
        <div class="stat-label">${esc(slide.statLabel)}</div>
      </div>
      ${slide.secondaryStat ? `
        <div class="stat-card">
          <div class="stat-number">${esc(slide.secondaryStat)}</div>
          <div class="stat-label">${esc(slide.secondaryStatLabel || '')}</div>
        </div>
      ` : ''}
    </div>
  `;

  const bigStatHtml = `
    <div class="big-stat-hero">
      <div class="big-stat-number">${esc(slide.stat)}</div>
      <div class="big-stat-label">${esc(slide.statLabel)}</div>
    </div>
  `;

  let contentBlock: string;
  if (layout === 1) {
    contentBlock = `
      <div class="data-area chart-first-layout">
        ${chartHtml}
      </div>
      <h2 class="heading heading-sm">${esc(slide.heading)}</h2>
      <p class="body">${esc(slide.body)}</p>
      ${statsHtml}
    `;
  } else if (layout === 2) {
    contentBlock = `
      ${bigStatHtml}
      <h2 class="heading heading-sm">${esc(slide.heading)}</h2>
      <p class="body">${esc(slide.body)}</p>
      <div class="data-area">
        ${chartHtml}
      </div>
    `;
  } else {
    contentBlock = `
      <h2 class="heading">${esc(slide.heading)}</h2>
      <p class="body">${esc(slide.body)}</p>
      <div class="data-area">
        ${statsHtml}
        ${chartHtml}
      </div>
    `;
  }

  return `<!DOCTYPE html><html><head><style>
    ${FONTS} ${RESET}
    body { background: ${theme.bg}; }
    .wrap {
      width: 1080px; height: 1350px;
      display: flex; flex-direction: column;
      padding: 40px 60px 40px;
    }

    .progress { display: flex; gap: 6px; margin-bottom: 12px; }
    .progress .dot { height: 6px; flex: 1; border-radius: 3px; background: ${theme.border}; }
    .progress .dot.active { background: ${theme.accent}; }

    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .slide-num { font-size: 18px; color: ${theme.textSecondary}; font-weight: 700; }
    .brand { font-size: 16px; color: ${theme.textSecondary}; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; }

    .accent-bar { width: 60px; height: 6px; background: ${theme.accent}; border-radius: 3px; margin-bottom: 20px; }
    .heading {
      font-family: 'DM Serif Display', serif;
      font-size: 86px; font-weight: 400; color: ${theme.text}; line-height: 1.08;
      margin-bottom: 18px;
    }
    .heading-sm { font-size: 62px; margin-bottom: 10px; }
    .body {
      font-size: 28px; font-weight: 400; color: ${theme.textSecondary};
      line-height: 1.55; margin-bottom: 28px;
    }

    .data-area { flex: 1; display: flex; flex-direction: column; gap: 18px; }
    .chart-first-layout { margin-bottom: 20px; }

    /* Big stat hero */
    .big-stat-hero {
      background: ${theme.accent}; border-radius: 20px; padding: 48px 40px;
      margin-bottom: 24px; text-align: center;
    }
    .big-stat-number {
      font-family: 'DM Serif Display', serif;
      font-size: 110px; font-weight: 400; color: ${theme.bg};
      line-height: 1; margin-bottom: 10px;
    }
    .big-stat-label {
      font-size: 26px; font-weight: 600; color: ${theme.bg}; opacity: 0.85;
    }

    .stats-row { display: flex; gap: 16px; }
    .stat-card {
      background: ${theme.accentLight}; border: 1px solid ${theme.border};
      border-radius: 16px; padding: 44px 32px; flex: 1;
    }
    .stat-number {
      font-family: 'DM Serif Display', serif;
      font-size: 68px; font-weight: 400; color: ${theme.accent};
      line-height: 1; margin-bottom: 12px;
    }
    .stat-label { font-size: 22px; font-weight: 500; color: ${theme.textSecondary}; line-height: 1.35; }

    /* Bar chart */
    .chart-card {
      background: ${theme.accentLight}; border: 1px solid ${theme.border};
      border-radius: 16px; padding: 40px 32px; flex: 1;
      display: flex; flex-direction: column; gap: 28px; justify-content: center;
    }
    .bar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .bar-label { font-size: 26px; font-weight: 700; color: ${theme.text}; }
    .bar-value { font-size: 26px; font-weight: 800; color: ${theme.accent}; }
    .bar-track { height: 24px; background: ${theme.accentSoft}; border-radius: 12px; overflow: hidden; }
    .bar-fill { height: 100%; background: ${theme.accent}; border-radius: 12px; }

    /* Donut chart */
    .donut-wrap { flex-direction: row; align-items: center; gap: 44px; padding: 36px 32px; }
    .donut-chart { position: relative; width: 240px; height: 240px; flex-shrink: 0; }
    .donut-ring { width: 240px; height: 240px; border-radius: 50%; }
    .donut-center {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 130px; height: 130px; border-radius: 50%; background: ${theme.accentLight};
      display: flex; align-items: center; justify-content: center;
    }
    .donut-highlight { font-family: 'DM Serif Display', serif; font-size: 48px; color: ${theme.accent}; font-weight: 400; }
    .donut-legend { display: flex; flex-direction: column; gap: 22px; flex: 1; }
    .legend-item { display: flex; align-items: center; gap: 14px; }
    .legend-dot { width: 22px; height: 22px; border-radius: 6px; flex-shrink: 0; }
    .legend-label { font-size: 26px; color: ${theme.text}; font-weight: 500; flex: 1; }
    .legend-pct { font-size: 26px; color: ${theme.accent}; font-weight: 800; }

    /* Compare chart */
    .compare-wrap { flex-direction: row; align-items: center; gap: 0; }
    .compare-item { flex: 1; text-align: center; padding: 56px 24px; }
    .compare-alt {
      background: ${theme.accentSoft}; border-radius: 0 16px 16px 0;
      margin: -40px -32px -40px 0; padding: 84px 32px;
    }
    .compare-value { font-family: 'DM Serif Display', serif; font-size: 60px; color: ${theme.accent}; font-weight: 400; margin-bottom: 14px; }
    .compare-label { font-size: 26px; font-weight: 800; color: ${theme.text}; margin-bottom: 10px; }
    .compare-desc { font-size: 20px; color: ${theme.textSecondary}; line-height: 1.4; }
    .compare-vs { font-size: 26px; font-weight: 800; color: ${theme.textSecondary}; padding: 0 18px; flex-shrink: 0; }

    /* Ranked chart */
    .rank-row { display: flex; align-items: center; gap: 20px; padding: 26px 0; border-bottom: 1px solid ${theme.border}; }
    .rank-row:last-child { border-bottom: none; }
    .rank-num { font-family: 'DM Serif Display', serif; font-size: 42px; color: ${theme.accent}; font-weight: 400; width: 60px; flex-shrink: 0; }
    .rank-label { font-size: 26px; font-weight: 700; color: ${theme.text}; flex: 1; }
    .rank-value { font-size: 24px; font-weight: 800; color: ${theme.accent}; }

    /* Source */
    .source-bar {
      background: ${theme.accentSoft}; border-radius: 12px;
      padding: 18px 26px; display: flex; align-items: center; gap: 12px;
      margin-top: 18px;
    }
    .source-icon { font-size: 15px; color: ${theme.accent}; font-weight: 800; letter-spacing: 1px; }
    .source-text { font-size: 17px; color: ${theme.textSecondary}; font-weight: 500; }
  </style></head><body>
    <div class="wrap">
      <div class="progress">
        ${Array.from({ length: totalSlides }, (_, i) => `<div class="dot${i < slideNum ? ' active' : ''}"></div>`).join('')}
      </div>
      <div class="header">
        <span class="slide-num">${String(slideNum).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}</span>
        <span class="brand">Climate Watch</span>
      </div>
      <div class="accent-bar"></div>
      ${contentBlock}
      <div class="source-bar">
        <span class="source-icon">SOURCE</span>
        <span class="source-text">${esc(slide.source || '')}</span>
      </div>
    </div>
  </body></html>`;
}

/**
 * Generate all carousel slide HTMLs — cover + data-rich fact slides with varied charts.
 */
export function renderAllSlides(content: GeneratedContent, bgBase64: string): string[] {
  const theme = pickTheme();
  const totalSlides = content.slides.length + 1;

  const slides: string[] = [];
  slides.push(renderCoverSlide(content, theme, bgBase64));

  for (let i = 0; i < content.slides.length; i++) {
    slides.push(renderFactSlide(content.slides[i], i + 2, totalSlides, theme));
  }

  return slides;
}
