// Kismet design tokens — generated from the Figma variables of "Kismet Design Explorations".
// Run: node tools/build-tokens.mjs  → writes css/tokens.css and tokens.json in the kit root.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const read = (f) => readFileSync(join(here, 'data', f), 'utf8').trim().split('\n');

// ---------- data ----------
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const prim = {}; // "sand/50" -> "#f8f7f2"
for (const line of read('primitives.txt')) {
  const [fam, ...hexes] = line.split(' ');
  if (hexes.length === 1) prim[fam] = hexes[0];
  else hexes.forEach((h, i) => (prim[`${fam}/${STEPS[i]}`] = h));
}
const THEMES = ['electric', 'submarine', 'salad', 'skittles', 'lego'];
const semColor = read('semantic-color.txt').map((l) => { const [name, ...v] = l.split('|'); return { name, v: v.length === 1 ? Array(5).fill(v[0]) : v }; });

const SPACE = { none: 0, '3xs': 2, '2xs': 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64, '4xl': 96 };
const LAYOUT = { margin: [16, 56], gutter: [16, 24], section: [48, 96], 'section-sm': [32, 64], 'band-padding': [24, 48], 'fold-top': [56, 88], 'fold-margin': [24, 56], 'fold-bottom': [48, 48], 'fold-content': [354, 698] };
const SIZE = { 'icon-sm': 16, 'icon-md': 24, 'icon-lg': 32, 'control-sm': 32, 'control-md': 40, 'control-lg': 48, 'control-xl': 56, 'control-default': [48, 40], 'touch-min': 44, field: 56, ornament: 44, 'fold-hero': [620, 664], 'fold-page': [320, 380], 'fold-banner': 164 };
const RADIUS = { none: 0, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, full: 9999 };
const BORDER = { none: 0, sm: 1, md: 2, lg: 4 };
// [mobile size, mobile line-height, desktop size, desktop line-height]
const TYPE = {
  'display/2xl': [72, 86, 100, 120], 'display/xl': [64, 77, 80, 96], 'display/lg': [48, 58, 64, 77], 'display/md': [40, 48, 48, 58], 'display/sm': [32, 38, 40, 48], 'display/xs': [28, 34, 32, 38],
  'heading/2xl': [32, 38, 40, 48], 'heading/xl': [28, 34, 32, 38], 'heading/lg': [24, 29, 28, 34], 'heading/md': [22, 26, 24, 29], 'heading/sm': [20, 24, 22, 26], 'heading/xs': [18, 22, 20, 24],
  'body/lg': [18, 22, 18, 22], 'body/md': [16, 19, 16, 19], 'body/sm': [14, 17, 14, 17], 'body/xs': [12, 14, 12, 14],
  'label/xl': [20, 24, 20, 24], 'label/lg': [16, 19, 16, 19], 'label/md': [14, 17, 14, 17], 'label/sm': [12, 14, 12, 14],
  'caption/md': [11, 13, 11, 13],
};
const FONT = (name) => name.startsWith('display') ? { family: 'display', weight: 400, tracking: 0 } : { family: 'body', weight: name.startsWith('label') ? 700 : 500, tracking: -0.03 };
const DURATION = { instant: 0, fast: 150, base: 250, slow: 400, slower: 600 };
const EASING = { standard: [0.2, 0, 0, 1], enter: [0, 0, 0, 1], exit: [0.3, 0, 1, 1], bounce: [0.34, 1.56, 0.64, 1], linear: [0, 0, 1, 1] };
const SHADOW = {
  none: 'none',
  raised: '0 1px 2px 0 #0f2b2b0f, 0 2px 6px 0 #0f2b2b14',
  overlay: '0 2px 4px 0 #0f2b2b0f, 0 8px 16px 0 #0f2b2b1a',
  modal: '0 4px 12px 0 #0f2b2b14, 0 16px 40px 0 #0f2b2b29',
  'offset-sm': '2px 2px 0 0 var(--color-action-secondary-shadow)',
  'offset-md': '4px 4px 0 0 var(--color-action-secondary-shadow)',
  'offset-lg': '6px 6px 0 0 var(--color-action-secondary-shadow)',
  'focus-ring': '0 0 0 3px var(--color-border-focus)',
  'title': '4px 4px 0 var(--color-accent-title-shadow)',
};

// ---------- helpers ----------
const kebab = (p) => p.replace(/\//g, '-');
const primVar = (p) => `--color-${kebab(p)}`;
const semVar = (p) => `--color-${kebab(p)}`;
const ref = (v) => { if (v[0] !== '@') return v; const p = v.slice(1); return prim[p] ? `var(${primVar(p)})` : `var(${semVar(p)})`; };
const px = (n) => (n === 0 ? '0' : n === 9999 ? '9999px' : `${n / 16}rem`);
const pick = (v, i) => (Array.isArray(v) ? v[i] : v);

// ---------- CSS ----------
const css = [];
css.push('/* Kismet design tokens — generated from Figma (Kismet Design Explorations). Do not edit by hand; run build.mjs. */');
css.push('/* Mobile first: :root holds Mobile values; Desktop overrides apply from 1024px. Themes: [data-theme="electric|submarine|salad|skittles|lego"] (Electric is the default). */\n');
css.push("@font-face { font-family: 'Sans Plomb'; src: url('../assets/fonts/SansPlomb-98Oblique.woff2') format('woff2'); font-weight: 400; font-style: oblique; font-display: swap; }");
css.push("@font-face { font-family: 'Sans Plomb'; src: url('../assets/fonts/SansPlomb-98.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }");
css.push("@font-face { font-family: 'Apercu'; src: url('../assets/fonts/apercu-regular-pro.woff2') format('woff2'); font-weight: 400; font-display: swap; }");
css.push("@font-face { font-family: 'Apercu'; src: url('../assets/fonts/apercu-medium-pro.woff2') format('woff2'); font-weight: 500; font-display: swap; }");
css.push("@font-face { font-family: 'Apercu'; src: url('../assets/fonts/apercu-bold-pro.woff2') format('woff2'); font-weight: 700; font-display: swap; }\n");
css.push(':root {');
css.push('  /* Primitives · Color (never use in components — use the semantic tokens below) */');
for (const [p, h] of Object.entries(prim)) css.push(`  ${primVar(p)}: ${h};`);
css.push('\n  /* Semantic · Color — Electric (default theme) */');
for (const { name, v } of semColor) css.push(`  ${semVar(name)}: ${ref(v[0])};`);
css.push('\n  /* Typography */');
css.push("  --font-display: 'Sans Plomb', 'Arial Narrow', Impact, sans-serif; /* SansPlomb 98 Oblique */");
css.push("  --font-body: 'Apercu', 'Helvetica Neue', Arial, sans-serif;");
for (const [n, [fs, lh]] of Object.entries(TYPE)) { css.push(`  --text-${kebab(n)}-size: ${px(fs)};`); css.push(`  --text-${kebab(n)}-line-height: ${px(lh)};`); }
css.push('\n  /* Spacing, layout, sizes (8pt grid) */');
for (const [k, v] of Object.entries(SPACE)) css.push(`  --space-${k}: ${px(v)};`);
for (const [k, v] of Object.entries(LAYOUT)) css.push(`  --layout-${k}: ${px(v[0])};`);
for (const [k, v] of Object.entries(SIZE)) css.push(`  --size-${k}: ${px(pick(v, 0))};`);
for (const [k, v] of Object.entries(RADIUS)) css.push(`  --radius-${k}: ${px(v)};`);
for (const [k, v] of Object.entries(BORDER)) css.push(`  --border-width-${k}: ${v}px;`);
css.push('\n  /* Motion */');
for (const [k, v] of Object.entries(DURATION)) css.push(`  --duration-${k}: ${v}ms;`);
for (const [k, v] of Object.entries(EASING)) css.push(`  --easing-${k}: cubic-bezier(${v.join(', ')});`);
css.push('\n  /* Elevation & brand shadows */');
for (const [k, v] of Object.entries(SHADOW)) css.push(`  --shadow-${k}: ${v};`);
css.push('}\n');

THEMES.forEach((t, i) => {
  if (i === 0) { css.push(`[data-theme="electric"] { /* default — same as :root */ }\n`); return; }
  const diff = semColor.filter(({ v }) => v[i] !== v[0]);
  css.push(`[data-theme="${t}"] {`);
  for (const { name, v } of diff) css.push(`  ${semVar(name)}: ${ref(v[i])};`);
  css.push('}\n');
});

css.push('@media (min-width: 1024px) {\n  :root {');
for (const [n, [fs, lh, dfs, dlh]] of Object.entries(TYPE)) {
  if (dfs !== fs) css.push(`    --text-${kebab(n)}-size: ${px(dfs)};`);
  if (dlh !== lh) css.push(`    --text-${kebab(n)}-line-height: ${px(dlh)};`);
}
for (const [k, v] of Object.entries(LAYOUT)) css.push(`    --layout-${k}: ${px(v[1])};`);
for (const [k, v] of Object.entries(SIZE)) if (Array.isArray(v)) css.push(`    --size-${k}: ${px(v[1])};`);
css.push('  }\n}\n');

css.push('/* Text styles — one class per Figma text style. text-box trims leading to the cap height, like the Figma designs ("Vertical trim: cap height"). */');
for (const n of Object.keys(TYPE)) {
  const f = FONT(n);
  css.push(`.text-${kebab(n)} {`);
  css.push(`  font-family: var(--font-${f.family});`);
  if (f.family === 'display') css.push('  font-style: oblique;');
  css.push(`  font-weight: ${f.weight};`);
  css.push(`  font-size: var(--text-${kebab(n)}-size);`);
  css.push(`  line-height: var(--text-${kebab(n)}-line-height);`);
  css.push(`  letter-spacing: ${f.tracking ? f.tracking + 'em' : '0'};`);
  css.push('  text-box: trim-both cap alphabetic;');
  css.push('}');
}
writeFileSync(join(here, '..', 'css', 'tokens.css'), css.join('\n') + '\n');

// ---------- DTCG JSON ----------
const set = (obj, path, val) => { const parts = path.split('/'); let o = obj; for (const p of parts.slice(0, -1)) o = o[p] ??= {}; o[parts.at(-1)] = val; };
const tok = { $description: 'Kismet design tokens (W3C Design Tokens format). Generated from Figma.' };
const primitives = {}; for (const [p, h] of Object.entries(prim)) set(primitives, p, { $type: 'color', $value: h });
tok.primitives = { color: primitives };
const dtcgRef = (v) => { if (v[0] !== '@') return v; const p = v.slice(1); return prim[p] ? `{primitives.color.${p.replace(/\//g, '.')}}` : `{color.${p.replace(/\//g, '.')}}`; };
tok.color = {}; for (const { name, v } of semColor) set(tok.color, name, { $type: 'color', $value: dtcgRef(v[0]), $extensions: { 'com.kismet.themes': Object.fromEntries(THEMES.map((t, i) => [t, dtcgRef(v[i])])) } });
const dim = (n) => ({ $type: 'dimension', $value: `${n}px` });
const modes = (m, d) => ({ $type: 'dimension', $value: `${m}px`, $extensions: { 'com.kismet.modes': { mobile: `${m}px`, desktop: `${d}px` } } });
tok.space = Object.fromEntries(Object.entries(SPACE).map(([k, v]) => [k, dim(v)]));
tok.layout = Object.fromEntries(Object.entries(LAYOUT).map(([k, v]) => [k, modes(v[0], v[1])]));
tok.size = Object.fromEntries(Object.entries(SIZE).map(([k, v]) => [k, Array.isArray(v) ? modes(v[0], v[1]) : dim(v)]));
tok.radius = Object.fromEntries(Object.entries(RADIUS).map(([k, v]) => [k, dim(v)]));
tok['border-width'] = Object.fromEntries(Object.entries(BORDER).map(([k, v]) => [k, dim(v)]));
tok.font = { family: { display: { $type: 'fontFamily', $value: ['SansPlomb', 'Arial Narrow', 'sans-serif'] }, body: { $type: 'fontFamily', $value: ['Apercu', 'Helvetica Neue', 'Arial', 'sans-serif'] } } };
tok.typography = {};
for (const [n, [fs, lh, dfs, dlh]] of Object.entries(TYPE)) {
  const f = FONT(n);
  set(tok.typography, n, { $type: 'typography', $value: { fontFamily: `{font.family.${f.family}}`, fontWeight: f.weight, fontSize: `${fs}px`, lineHeight: `${lh}px`, letterSpacing: `${f.tracking}em` }, $extensions: { 'com.kismet.modes': { desktop: { fontSize: `${dfs}px`, lineHeight: `${dlh}px` } }, 'com.kismet.leadingTrim': 'cap-height' } });
}
tok.duration = Object.fromEntries(Object.entries(DURATION).map(([k, v]) => [k, { $type: 'duration', $value: `${v}ms` }]));
tok.easing = Object.fromEntries(Object.entries(EASING).map(([k, v]) => [k, { $type: 'cubicBezier', $value: v }]));
tok.shadow = Object.fromEntries(Object.entries(SHADOW).map(([k, v]) => [k, { $type: 'shadow', $value: v }]));
writeFileSync(join(here, '..', 'tokens.json'), JSON.stringify(tok, null, 2) + '\n');
console.log(`css/tokens.css (${css.length} lines) and kismet.tokens.json written · ${Object.keys(prim).length} primitives · ${semColor.length} semantic colors · ${Object.keys(TYPE).length} text styles`);
