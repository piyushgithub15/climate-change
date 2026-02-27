import { GeneratedContent, SlideContent } from '../content/generator';

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');`;

const RESET = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; height: 1080px; overflow: hidden; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
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
// COVER SLIDE
// =============================================
function renderCoverSlide(content: GeneratedContent, theme: ColorTheme): string {
  return `<!DOCTYPE html><html><head><style>
    ${FONTS} ${RESET}
    body { background: ${theme.bg}; }
    .wrap { width: 1080px; height: 1080px; display: flex; flex-direction: column; justify-content: space-between; padding: 80px 72px; }
    .label { display: inline-block; background: ${theme.accent}; color: white; font-size: 14px; font-weight: 600; padding: 10px 22px; border-radius: 100px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 48px; }
    .title { font-family: 'DM Serif Display', serif; font-size: 68px; font-weight: 400; line-height: 1.12; color: ${theme.text}; margin-bottom: 28px; max-width: 900px; }
    .subtitle { font-size: 24px; font-weight: 400; color: ${theme.textSecondary}; line-height: 1.5; max-width: 750px; }
    .bottom { display: flex; justify-content: space-between; align-items: flex-end; }
    .brand { font-size: 16px; font-weight: 700; color: ${theme.accent}; letter-spacing: 2px; text-transform: uppercase; }
    .swipe { font-size: 16px; color: ${theme.textSecondary}; font-weight: 500; display: flex; align-items: center; gap: 10px; }
    .swipe-arrow { display: inline-block; width: 40px; height: 2px; background: ${theme.accent}; position: relative; }
    .swipe-arrow::after { content: ''; position: absolute; right: 0; top: -4px; border: solid ${theme.accent}; border-width: 0 2px 2px 0; padding: 4px; transform: rotate(-45deg); }
    .divider { width: 80px; height: 4px; background: ${theme.accent}; border-radius: 2px; margin-bottom: 24px; }
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

function renderChart(slide: SlideContent, theme: ColorTheme): string {
  switch (slide.chartType) {
    case 'donut': return renderDonutChart(slide, theme);
    case 'compare': return renderCompareChart(slide, theme);
    case 'ranked': return renderRankedChart(slide, theme);
    case 'bars':
    default: return renderBarsChart(slide, theme);
  }
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.substring(0, 2), 16)}, ${parseInt(h.substring(2, 4), 16)}, ${parseInt(h.substring(4, 6), 16)}`;
}

// =============================================
// FACT SLIDE
// =============================================
function renderFactSlide(
  slide: SlideContent,
  slideNum: number,
  totalSlides: number,
  theme: ColorTheme,
): string {
  const chartHtml = renderChart(slide, theme);

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

  return `<!DOCTYPE html><html><head><style>
    ${FONTS} ${RESET}
    body { background: ${theme.bg}; }
    .wrap { width: 1080px; height: 1080px; display: flex; flex-direction: column; padding: 48px 56px; }

    .progress { display: flex; gap: 6px; margin-bottom: 24px; }
    .progress .dot { height: 4px; flex: 1; border-radius: 2px; background: ${theme.border}; }
    .progress .dot.active { background: ${theme.accent}; }

    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .slide-num { font-size: 14px; color: ${theme.textSecondary}; font-weight: 600; }
    .brand { font-size: 13px; color: ${theme.textSecondary}; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }

    .content { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 20px; }
    .accent-bar { width: 40px; height: 4px; background: ${theme.accent}; border-radius: 2px; }
    .heading { font-family: 'DM Serif Display', serif; font-size: 36px; font-weight: 400; color: ${theme.text}; line-height: 1.15; }
    .body { font-size: 18px; font-weight: 400; color: ${theme.textSecondary}; line-height: 1.55; max-width: 900px; }

    .stats-row { display: flex; gap: 14px; }
    .stat-card { background: ${theme.cardBg}; border: 1px solid ${theme.border}; border-radius: 14px; padding: 20px 24px; flex: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .stat-number { font-family: 'DM Serif Display', serif; font-size: 36px; font-weight: 400; color: ${theme.accent}; line-height: 1; margin-bottom: 4px; }
    .stat-label { font-size: 14px; font-weight: 500; color: ${theme.textSecondary}; line-height: 1.3; }

    /* Bar chart */
    .chart-card { background: ${theme.cardBg}; border: 1px solid ${theme.border}; border-radius: 14px; padding: 20px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); display: flex; flex-direction: column; gap: 10px; }
    .bar-row { }
    .bar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
    .bar-label { font-size: 14px; font-weight: 600; color: ${theme.text}; }
    .bar-value { font-size: 14px; font-weight: 700; color: ${theme.accent}; }
    .bar-track { height: 10px; background: ${theme.accentSoft}; border-radius: 5px; overflow: hidden; }
    .bar-fill { height: 100%; background: ${theme.accent}; border-radius: 5px; }

    /* Donut chart */
    .donut-wrap { flex-direction: row; align-items: center; gap: 28px; }
    .donut-chart { position: relative; width: 160px; height: 160px; flex-shrink: 0; }
    .donut-ring { width: 160px; height: 160px; border-radius: 50%; }
    .donut-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90px; height: 90px; border-radius: 50%; background: ${theme.cardBg}; display: flex; align-items: center; justify-content: center; }
    .donut-highlight { font-family: 'DM Serif Display', serif; font-size: 30px; color: ${theme.accent}; font-weight: 400; }
    .donut-legend { display: flex; flex-direction: column; gap: 8px; flex: 1; }
    .legend-item { display: flex; align-items: center; gap: 10px; }
    .legend-dot { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
    .legend-label { font-size: 14px; color: ${theme.text}; font-weight: 500; flex: 1; }
    .legend-pct { font-size: 14px; color: ${theme.accent}; font-weight: 700; }

    /* Compare chart */
    .compare-wrap { flex-direction: row; align-items: center; gap: 0; }
    .compare-item { flex: 1; text-align: center; padding: 24px 16px; }
    .compare-alt { background: ${theme.accentLight}; border-radius: 0 14px 14px 0; margin: -20px -24px -20px 0; padding: 40px 24px; }
    .compare-value { font-family: 'DM Serif Display', serif; font-size: 34px; color: ${theme.accent}; font-weight: 400; margin-bottom: 6px; }
    .compare-label { font-size: 16px; font-weight: 700; color: ${theme.text}; margin-bottom: 4px; }
    .compare-desc { font-size: 13px; color: ${theme.textSecondary}; }
    .compare-vs { font-size: 16px; font-weight: 700; color: ${theme.textSecondary}; padding: 0 8px; flex-shrink: 0; }

    /* Ranked chart */
    .rank-row { display: flex; align-items: center; gap: 14px; padding: 8px 0; border-bottom: 1px solid ${theme.border}; }
    .rank-row:last-child { border-bottom: none; }
    .rank-num { font-family: 'DM Serif Display', serif; font-size: 22px; color: ${theme.accent}; font-weight: 400; width: 36px; flex-shrink: 0; }
    .rank-label { font-size: 15px; font-weight: 600; color: ${theme.text}; flex: 1; }
    .rank-value { font-size: 14px; font-weight: 700; color: ${theme.accent}; }

    /* Source */
    .source-bar { background: ${theme.accentSoft}; border-radius: 8px; padding: 10px 16px; display: flex; align-items: center; gap: 6px; margin-top: 4px; }
    .source-icon { font-size: 11px; color: ${theme.accent}; font-weight: 700; }
    .source-text { font-size: 12px; color: ${theme.textSecondary}; font-weight: 500; }
  </style></head><body>
    <div class="wrap">
      <div class="progress">
        ${Array.from({ length: totalSlides }, (_, i) => `<div class="dot${i < slideNum ? ' active' : ''}"></div>`).join('')}
      </div>
      <div class="header">
        <span class="slide-num">${String(slideNum).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}</span>
        <span class="brand">Climate Watch</span>
      </div>
      <div class="content">
        <div class="accent-bar"></div>
        <h2 class="heading">${esc(slide.heading)}</h2>
        <p class="body">${esc(slide.body)}</p>
        ${statsHtml}
        ${chartHtml}
      </div>
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
export function renderAllSlides(content: GeneratedContent, _bgPath: string): string[] {
  const theme = pickTheme();
  const totalSlides = content.slides.length + 1;

  const slides: string[] = [];
  slides.push(renderCoverSlide(content, theme));

  for (let i = 0; i < content.slides.length; i++) {
    slides.push(renderFactSlide(content.slides[i], i + 2, totalSlides, theme));
  }

  return slides;
}
