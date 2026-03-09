import { GeneratedContent, SlideContent } from '../content/generator';

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');`;

const RESET = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; height: 1350px; overflow: hidden; font-family: 'Space Grotesk', sans-serif; -webkit-font-smoothing: antialiased; }
`;

interface BrutalistTheme {
  bg: string;
  bgRgb: string;
  accent: string;
  accentRgb: string;
  text: string;
  textMuted: string;
  cardBg: string;
  stripe: string;
}

const BRUTALIST_THEMES: BrutalistTheme[] = [
  {
    bg: '#7F1D1D', bgRgb: '127,29,29', accent: '#FDE047', accentRgb: '253,224,71',
    text: '#FFFFFF', textMuted: 'rgba(255,255,255,0.6)', cardBg: 'rgba(0,0,0,0.3)', stripe: '#991B1B',
  },
  {
    bg: '#1E1B4B', bgRgb: '30,27,75', accent: '#F97316', accentRgb: '249,115,22',
    text: '#FFFFFF', textMuted: 'rgba(255,255,255,0.6)', cardBg: 'rgba(0,0,0,0.25)', stripe: '#312E81',
  },
  {
    bg: '#064E3B', bgRgb: '6,78,59', accent: '#F0ABFC', accentRgb: '240,171,252',
    text: '#FFFFFF', textMuted: 'rgba(255,255,255,0.6)', cardBg: 'rgba(0,0,0,0.25)', stripe: '#065F46',
  },
  {
    bg: '#78350F', bgRgb: '120,53,15', accent: '#67E8F9', accentRgb: '103,232,249',
    text: '#FFFFFF', textMuted: 'rgba(255,255,255,0.6)', cardBg: 'rgba(0,0,0,0.25)', stripe: '#92400E',
  },
  {
    bg: '#0F172A', bgRgb: '15,23,42', accent: '#F43F5E', accentRgb: '244,63,94',
    text: '#FFFFFF', textMuted: 'rgba(255,255,255,0.55)', cardBg: 'rgba(255,255,255,0.05)', stripe: '#1E293B',
  },
];

function pickTheme(): BrutalistTheme {
  return BRUTALIST_THEMES[Math.floor(Math.random() * BRUTALIST_THEMES.length)];
}

function renderCover(content: GeneratedContent, theme: BrutalistTheme, bgBase64: string): string {
  const bgCss = bgBase64
    ? `background: linear-gradient(to bottom, rgba(${theme.bgRgb},0.4) 0%, rgba(${theme.bgRgb},0.92) 55%, rgba(${theme.bgRgb},1) 100%), url('${bgBase64}') center/cover no-repeat;`
    : `background: ${theme.bg};`;

  return `<!DOCTYPE html><html><head><style>
    ${FONTS} ${RESET}
    body { ${bgCss} }
    .wrap {
      width: 1080px; height: 1350px;
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 0 70px 70px;
    }
    .warning-bar {
      position: absolute; top: 0; left: 0; right: 0; height: 12px;
      background: repeating-linear-gradient(
        -45deg,
        ${theme.accent},
        ${theme.accent} 20px,
        transparent 20px,
        transparent 40px
      );
    }
    .label {
      display: inline-block; background: ${theme.accent}; color: ${theme.bg};
      font-family: 'Oswald', sans-serif;
      font-size: 18px; font-weight: 700; padding: 14px 32px;
      text-transform: uppercase; letter-spacing: 6px;
      margin-bottom: 44px; width: fit-content;
    }
    .title {
      font-family: 'Oswald', sans-serif;
      font-size: 108px; font-weight: 700; line-height: 1.0;
      color: ${theme.text}; text-transform: uppercase;
      margin-bottom: 28px; max-width: 940px;
      letter-spacing: -1px;
    }
    .accent-word { color: ${theme.accent}; }
    .subtitle {
      font-size: 30px; font-weight: 500; color: ${theme.textMuted};
      line-height: 1.5; max-width: 800px; margin-bottom: 60px;
      border-left: 6px solid ${theme.accent}; padding-left: 24px;
    }
    .bottom {
      display: flex; justify-content: space-between; align-items: center;
      border-top: 3px solid rgba(255,255,255,0.15); padding-top: 24px;
    }
    .brand {
      font-family: 'Oswald', sans-serif;
      font-size: 18px; font-weight: 700; color: ${theme.accent};
      letter-spacing: 6px; text-transform: uppercase;
    }
    .swipe {
      font-family: 'Oswald', sans-serif;
      font-size: 18px; color: ${theme.textMuted}; font-weight: 500;
      letter-spacing: 4px; text-transform: uppercase;
      display: flex; align-items: center; gap: 16px;
    }
    .swipe-line {
      display: inline-block; width: 60px; height: 4px;
      background: ${theme.accent};
    }
  </style></head><body>
    <div class="warning-bar"></div>
    <div class="wrap">
      <span class="label">Climate Explainer</span>
      <h1 class="title">${esc(content.coverTitle)}</h1>
      <p class="subtitle">${esc(content.coverSubtitle)}</p>
      <div class="bottom">
        <span class="brand">Climate Watch</span>
        <span class="swipe"><span class="swipe-line"></span> Swipe</span>
      </div>
    </div>
  </body></html>`;
}

function renderBars(slide: SlideContent, theme: BrutalistTheme): string {
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

function renderDonut(slide: SlideContent, theme: BrutalistTheme): string {
  if (!slide.donut || slide.donut.length === 0) return '';
  const segs = slide.donut;
  let cum = 0;
  const stops: string[] = [];
  const ops = [1, 0.65, 0.4, 0.22, 0.12];
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

function renderCompare(slide: SlideContent, theme: BrutalistTheme): string {
  if (!slide.compare || slide.compare.length < 2) return '';
  const [a, b] = slide.compare;
  return `<div class="chart-card compare-wrap">
    <div class="compare-item">
      <div class="compare-val">${esc(a.value)}</div>
      <div class="compare-lbl">${esc(a.label)}</div>
      <div class="compare-desc">${esc(a.description)}</div>
    </div>
    <div class="compare-vs">VS</div>
    <div class="compare-item compare-alt">
      <div class="compare-val">${esc(b.value)}</div>
      <div class="compare-lbl">${esc(b.label)}</div>
      <div class="compare-desc">${esc(b.description)}</div>
    </div>
  </div>`;
}

function renderRanked(slide: SlideContent, theme: BrutalistTheme): string {
  if (!slide.ranked || slide.ranked.length === 0) return '';
  return `<div class="chart-card">${slide.ranked.map(r => `
    <div class="rank-row">
      <span class="rank-num">#${r.rank}</span>
      <span class="rank-lbl">${esc(r.label)}</span>
      <span class="rank-val">${esc(r.value)}</span>
    </div>`).join('')}</div>`;
}

function renderTrendChart(slide: SlideContent, theme: BrutalistTheme): string {
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
      ${title ? `<div style="font-size:22px; font-weight:700; color:${theme.text}; margin-bottom:8px; padding:0 10px; font-family:'Oswald',sans-serif; text-transform:uppercase; letter-spacing:2px;">${esc(title)}</div>` : ''}
      <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" style="display:block; width:100%; height:auto;">
        <defs>
          <linearGradient id="areaGradBrut" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0.03"/>
          </linearGradient>
        </defs>
        <line x1="${padX}" y1="${svgH - padY}" x2="${svgW - padX}" y2="${svgH - padY}" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
        <path d="${areaPath}" fill="url(#areaGradBrut)"/>
        <path d="${linePath}" fill="none" stroke="${theme.accent}" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter"/>
        ${coords.map(c => `
          <rect x="${c.x - 7}" y="${c.y - 7}" width="14" height="14" fill="${theme.accent}"/>
          <text x="${c.x}" y="${svgH - 5}" text-anchor="middle" fill="${theme.textMuted}" font-size="18" font-family="'Oswald',sans-serif" font-weight="500">${esc(c.label)}</text>
          <text x="${c.x}" y="${c.y - 18}" text-anchor="middle" fill="${theme.accent}" font-size="17" font-weight="700" font-family="'Space Grotesk',sans-serif">${esc(c.displayValue)}</text>
        `).join('')}
      </svg>
    </div>
  `;
}

function renderPictogramChart(slide: SlideContent, theme: BrutalistTheme): string {
  if (!slide.pictogram) return '';
  const { filled, total, filledLabel, emptyLabel } = slide.pictogram;
  const icons: string[] = [];
  for (let i = 0; i < total; i++) {
    const isFilled = i < filled;
    const color = isFilled ? theme.accent : 'rgba(255,255,255,0.12)';
    icons.push(`
      <div style="display:flex; flex-direction:column; align-items:center;">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="${color}" opacity="${isFilled ? '1' : '0.3'}">
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
      <div style="display:flex; gap:28px; align-items:center; font-size:20px; font-family:'Space Grotesk',sans-serif;">
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:14px; height:14px; background:${theme.accent};"></div>
          <span style="color:${theme.text};">${filled}/${total} ${esc(filledLabel)}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:14px; height:14px; background:rgba(255,255,255,0.12);"></div>
          <span style="color:${theme.textMuted};">${total - filled}/${total} ${esc(emptyLabel)}</span>
        </div>
      </div>
    </div>
  `;
}

function renderChart(slide: SlideContent, theme: BrutalistTheme): string {
  switch (slide.chartType) {
    case 'donut': return renderDonut(slide, theme);
    case 'compare': return renderCompare(slide, theme);
    case 'ranked': return renderRanked(slide, theme);
    case 'trend': return renderTrendChart(slide, theme);
    case 'pictogram': return renderPictogramChart(slide, theme);
    case 'bars': default: return renderBars(slide, theme);
  }
}

function renderFact(slide: SlideContent, num: number, total: number, theme: BrutalistTheme): string {
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
    body { background: ${theme.bg}; }
    .wrap { width: 1080px; height: 1350px; display: flex; flex-direction: column; padding: 40px 60px 40px; }

    .warning-top {
      height: 8px; margin: 0 -60px 16px;
      background: repeating-linear-gradient(
        -45deg,
        ${theme.accent},
        ${theme.accent} 14px,
        transparent 14px,
        transparent 28px
      );
    }

    .progress { display: flex; gap: 8px; margin-bottom: 14px; }
    .progress .dot { height: 8px; flex: 1; background: rgba(255,255,255,0.1); }
    .progress .dot.active { background: ${theme.accent}; }

    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
    .slide-num {
      font-family: 'Oswald', sans-serif;
      font-size: 20px; color: ${theme.textMuted}; font-weight: 600; letter-spacing: 4px;
    }
    .brand {
      font-family: 'Oswald', sans-serif;
      font-size: 16px; color: ${theme.textMuted}; font-weight: 600;
      letter-spacing: 4px; text-transform: uppercase;
    }

    .accent-block {
      width: 70px; height: 8px; background: ${theme.accent}; margin-bottom: 22px;
    }
    .heading {
      font-family: 'Oswald', sans-serif;
      font-size: 82px; font-weight: 700; color: ${theme.text}; line-height: 1.05;
      text-transform: uppercase; letter-spacing: -1px;
      margin-bottom: 18px;
    }
    .heading-sm { font-size: 60px; margin-bottom: 12px; }
    .body { font-size: 27px; font-weight: 400; color: ${theme.textMuted}; line-height: 1.55; margin-bottom: 26px; }

    .data-area { flex: 1; display: flex; flex-direction: column; gap: 16px; }
    .chart-first-layout { margin-bottom: 18px; }

    .big-stat-hero {
      background: ${theme.accent}; padding: 48px 40px;
      margin-bottom: 24px; text-align: center;
    }
    .big-stat-number {
      font-family: 'Oswald', sans-serif;
      font-size: 120px; font-weight: 700; color: ${theme.bg};
      line-height: 1; margin-bottom: 8px;
    }
    .big-stat-label { font-size: 26px; font-weight: 600; color: ${theme.bg}; opacity: 0.85; text-transform: uppercase; letter-spacing: 2px; }

    .stats-row { display: flex; gap: 16px; }
    .stat-card {
      background: ${theme.cardBg}; border-left: 5px solid ${theme.accent};
      padding: 40px 28px; flex: 1;
    }
    .stat-num {
      font-family: 'Oswald', sans-serif;
      font-size: 72px; font-weight: 700; color: ${theme.accent};
      line-height: 1; margin-bottom: 10px;
    }
    .stat-lbl { font-size: 22px; font-weight: 500; color: ${theme.textMuted}; line-height: 1.35; }

    .chart-card {
      background: ${theme.cardBg};
      padding: 36px 28px; flex: 1;
      display: flex; flex-direction: column; gap: 26px; justify-content: center;
    }
    .bar-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .bar-label {
      font-family: 'Oswald', sans-serif;
      font-size: 26px; font-weight: 600; color: ${theme.text}; text-transform: uppercase;
    }
    .bar-value { font-size: 26px; font-weight: 700; color: ${theme.accent}; }
    .bar-track { height: 28px; background: rgba(255,255,255,0.08); overflow: hidden; }
    .bar-fill { height: 100%; background: ${theme.accent}; }

    .donut-wrap { flex-direction: row; align-items: center; gap: 40px; padding: 36px 28px; }
    .donut-chart { position: relative; width: 240px; height: 240px; flex-shrink: 0; }
    .donut-ring { width: 240px; height: 240px; border-radius: 50%; }
    .donut-center {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
      width: 130px; height: 130px; border-radius: 50%; background: ${theme.bg};
      display: flex; align-items: center; justify-content: center;
    }
    .donut-val {
      font-family: 'Oswald', sans-serif;
      font-size: 52px; color: ${theme.accent}; font-weight: 700;
    }
    .donut-legend { display: flex; flex-direction: column; gap: 20px; flex: 1; }
    .legend-item { display: flex; align-items: center; gap: 14px; }
    .legend-dot { width: 22px; height: 22px; flex-shrink: 0; }
    .legend-lbl { font-size: 24px; color: ${theme.textMuted}; font-weight: 500; flex: 1; }
    .legend-pct { font-size: 26px; color: ${theme.accent}; font-weight: 700; }

    .compare-wrap { flex-direction: row; align-items: center; gap: 0; }
    .compare-item { flex: 1; text-align: center; padding: 50px 24px; }
    .compare-alt {
      background: rgba(${theme.accentRgb},0.12);
      margin: -36px -28px -36px 0; padding: 76px 28px;
    }
    .compare-val {
      font-family: 'Oswald', sans-serif;
      font-size: 64px; color: ${theme.accent}; font-weight: 700; margin-bottom: 12px;
    }
    .compare-lbl {
      font-family: 'Oswald', sans-serif;
      font-size: 26px; font-weight: 700; color: ${theme.text}; text-transform: uppercase;
      margin-bottom: 10px;
    }
    .compare-desc { font-size: 20px; color: ${theme.textMuted}; line-height: 1.4; }
    .compare-vs {
      font-family: 'Oswald', sans-serif;
      font-size: 30px; font-weight: 700; color: ${theme.accent}; padding: 0 16px; flex-shrink: 0;
    }

    .rank-row { display: flex; align-items: center; gap: 20px; padding: 24px 0; border-bottom: 2px solid rgba(255,255,255,0.06); }
    .rank-row:last-child { border-bottom: none; }
    .rank-num {
      font-family: 'Oswald', sans-serif;
      font-size: 44px; color: ${theme.accent}; font-weight: 700; width: 60px; flex-shrink: 0;
    }
    .rank-lbl {
      font-family: 'Oswald', sans-serif;
      font-size: 26px; font-weight: 600; color: ${theme.text}; text-transform: uppercase; flex: 1;
    }
    .rank-val { font-size: 24px; font-weight: 700; color: ${theme.accent}; }

    .source-bar {
      background: rgba(255,255,255,0.05); border-top: 3px solid ${theme.accent};
      padding: 16px 24px; display: flex; align-items: center; gap: 14px; margin-top: 16px;
    }
    .source-icon {
      font-family: 'Oswald', sans-serif;
      font-size: 15px; color: ${theme.accent}; font-weight: 700; letter-spacing: 3px;
    }
    .source-text { font-size: 17px; color: ${theme.textMuted}; font-weight: 500; }
  </style></head><body>
    <div class="wrap">
      <div class="warning-top"></div>
      <div class="progress">
        ${Array.from({ length: total }, (_, i) => `<div class="dot${i < num ? ' active' : ''}"></div>`).join('')}
      </div>
      <div class="header">
        <span class="slide-num">${String(num).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
        <span class="brand">Climate Watch</span>
      </div>
      <div class="accent-block"></div>
      ${contentBlock}
      <div class="source-bar">
        <span class="source-icon">SOURCE</span>
        <span class="source-text">${esc(slide.source || '')}</span>
      </div>
    </div>
  </body></html>`;
}

export function renderBrutalistSlides(content: GeneratedContent, bgBase64: string): string[] {
  const theme = pickTheme();
  const total = content.slides.length + 1;
  const slides: string[] = [renderCover(content, theme, bgBase64)];
  for (let i = 0; i < content.slides.length; i++) {
    slides.push(renderFact(content.slides[i], i + 2, total, theme));
  }
  return slides;
}
