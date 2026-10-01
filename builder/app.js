/* Kismet Landing Builder — UI. State lives in memory; every change re-renders the preview instantly (no model call
   for manual edits; one Jev call per generated brief and per typed instruction). */
import { decide, compose, renderDoc, decideEdit, applyEdit, structure, SECTIONS, THEMES, OPTIONAL, ORDER, CAMPAIGNS, STRATEGIES, ANGLES } from './engine.js';

const $ = s => document.querySelector(s);
const BASE = new URL('../', location.href).href;
const PUBLIC_BASE = 'https://andres-monoku.github.io/kismet-ds/';
const EXAMPLES = ['Landing page for Walmart: Kismet is now in stores', 'Launch of a new topper called "Gut Gravy" with 20% off', 'Black Friday promo, 40% off subscriptions', 'Halloween dog parade in New York presented by Kismet', 'Petco in-store campaign for treats with a $5 coupon'];
let specs = [], current = -1, device = 'desktop', last = null;

$('#examples').innerHTML = EXAMPLES.map(e => `<button class="k-chip" type="button">${e}</button>`).join('');
$('#examples').addEventListener('click', e => { const b = e.target.closest('.k-chip'); if (b) { $('#brief').value = b.textContent; generate(b.textContent); } });
$('#form').addEventListener('submit', e => { e.preventDefault(); const v = $('#brief').value.trim(); if (v) generate(v); });

function mode(res) { const m = $('#mode'); m.classList.toggle('is-jev', res.source === 'jev'); m.textContent = res.source === 'jev' ? `Jev · ${res.ms} ms` : `Demo mode (no Jev key) · ${res.ms} ms`; m.title = res.source === 'jev' ? (res.model || '') : 'Start the server with TYPESAFE_API_KEY to use Jev. Using the local keyword scorer.'; }

/* scaled iframe preview */
function frame(host, spec, width, base = BASE) {
  host.innerHTML = ''; const f = document.createElement('iframe'); f.width = width; f.height = 800; f.setAttribute('scrolling', 'no'); host.appendChild(f);
  const fit = () => { const scale = host.clientWidth / width; f.style.transform = `scale(${scale})`; try { const h = f.contentDocument.documentElement.scrollHeight; f.height = h; host.style.height = Math.ceil(h * scale) + 'px'; } catch (e) {} };
  f.addEventListener('load', () => { fit(); setTimeout(fit, 400); setTimeout(fit, 1500); });
  f.srcdoc = renderDoc(spec, base); host._fit = fit; return f;
}
window.addEventListener('resize', () => document.querySelectorAll('.b-frame').forEach(h => h._fit && h._fit()));

async function generate(brief) {
  $('#ask').classList.add('is-compact'); $('#editor').hidden = true; const v = $('#versions'); v.hidden = false; v.innerHTML = '<p class="b-hint">Deciding…</p>';
  const res = await decide(brief); last = res; mode(res); specs = compose(brief, res);
  v.innerHTML = specs.map((s, i) => `<article class="b-version"><div class="b-version__head"><span class="b-version__name">${s.key} · ${s.label}</span><span class="k-badge k-badge--sm k-badge--brand">fit ${Math.round(s.fit * 100)}%</span><span class="k-badge k-badge--sm">${s.theme}</span></div><p class="b-hint">${s.note}.<br>${s.sections.filter(x => !SECTIONS[x.id].fixed || x.id === "hero").map(x => SECTIONS[x.id].label + (x.variant ? " (" + x.variant + ")" : "")).join(" → ")}</p><div class="b-frame" data-i="${i}"></div><button class="k-btn k-btn--block" data-edit="${i}">Use and edit version ${s.key}</button></article>`).join('');
  v.querySelectorAll('.b-frame').forEach(h => frame(h, specs[+h.dataset.i], 1512));
}
$('#versions').addEventListener('click', e => { const b = e.target.closest('[data-edit]'); if (b) edit(+b.dataset.edit); });

/* editor */
function edit(i) { current = i; $('#versions').hidden = true; $('#editor').hidden = false; $('#themes').innerHTML = Object.keys(THEMES).map(t => `<button class="k-chip" data-theme-pick="${t}">${t}</button>`).join(''); paint(); window.scrollTo({ top: 0 }); }
function paint() {
  const s = specs[current], host = $('#stage'); host.classList.toggle('is-mobile', device === 'mobile');
  const y = scrollY; frame(host, s, device === 'mobile' ? 390 : 1512); requestAnimationFrame(() => scrollTo(0, y));
  $('#stageInfo').textContent = `${s.key} · ${s.label} · ${s.copy.angle} voice · ${s.sections.length} sections`;
  document.querySelectorAll('[data-theme-pick]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themePick === s.theme)));
  const on = id => s.sections.find(x => x.id === id);
  const rows = [...s.sections.map(x => x.id), ...OPTIONAL.filter(id => !on(id))];
  $('#sections').innerHTML = rows.map(id => { const sec = SECTIONS[id], x = on(id), fixed = sec.fixed;
    return `<div class="b-sec ${x ? '' : 'is-off'}" data-id="${id}"><label class="k-check"><input type="checkbox" ${x ? 'checked' : ''} ${fixed ? 'disabled' : ''} data-toggle><span class="k-check__box"></span></label><span class="b-sec__name">${sec.label}</span>${x && sec.variants ? `<select data-variant>${Object.keys(sec.variants).map(v => `<option ${v === x.variant ? 'selected' : ''}>${v}</option>`).join('')}</select>` : ''}${x && !fixed ? `<button data-move="-1" title="Move up"><span class="k-icon k-icon--chevron-down" style="rotate:180deg"></span></button><button data-move="1" title="Move down"><span class="k-icon k-icon--chevron-down"></span></button>` : ''}</div>`; }).join('');
  $('#why').innerHTML = s.why.map(r => `<tr><td>${r.what}</td><td>${r.pick}</td><td>${r.p}</td></tr>`).join('');
}
const cur = () => specs[current];
$('#back').addEventListener('click', () => { $('#editor').hidden = true; $('#versions').hidden = false; $('#versions').querySelectorAll('.b-frame').forEach(h => frame(h, specs[+h.dataset.i], 1512)); });
$('#themes').addEventListener('click', e => { const b = e.target.closest('[data-theme-pick]'); if (b) { cur().theme = b.dataset.themePick; paint(); } });
document.addEventListener('click', e => { const b = e.target.closest('[data-cycle]'); if (b && current >= 0) { const k = b.dataset.cycle; const s = cur(), next = (o, v) => { const ks = Object.keys(o); return ks[(ks.indexOf(v) + 1) % ks.length]; }; if (k === 'photo') s.photo++; else if (k === 'headline') s.copy.angle = next(ANGLES, s.copy.angle); else if (k === 'structure') { s.strategy = next(STRATEGIES, s.strategy); s.label = STRATEGIES[s.strategy].label; s.copy.angle = STRATEGIES[s.strategy].angle; s.sections = structure(s.strategy, s.signals); } else s.copy[k]++; paint(); } const d = e.target.closest('[data-device]'); if (d) { device = d.dataset.device; paint(); } });
$('#sections').addEventListener('change', e => { const row = e.target.closest('.b-sec'), id = row.dataset.id, s = cur();
  if (e.target.matches('[data-toggle]')) { if (e.target.checked) { s.sections.push({ id, variant: SECTIONS[id].variants ? Object.keys(SECTIONS[id].variants)[0] : null }); s.sections.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id)); } else s.sections = s.sections.filter(x => x.id !== id); }
  if (e.target.matches('[data-variant]')) s.sections.find(x => x.id === id).variant = e.target.value; paint(); });
$('#sections').addEventListener('click', e => { const b = e.target.closest('[data-move]'); if (!b) return; const s = cur(), id = b.closest('.b-sec').dataset.id, i = s.sections.findIndex(x => x.id === id), j = i + +b.dataset.move; if (s.sections[j] && !SECTIONS[s.sections[j].id].fixed) { [s.sections[i], s.sections[j]] = [s.sections[j], s.sections[i]]; paint(); } });
$('#editForm').addEventListener('submit', async e => { e.preventDefault(); const text = $('#editText').value.trim(); if (!text) return; const out = $('#editResult'); out.textContent = 'Deciding…';
  let res, r; try { res = await decideEdit(text); mode(res); r = applyEdit(cur(), res.answers); } catch (err) { console.error(err); out.textContent = 'Something went wrong applying that change. Try again.'; return; }
  if (r.done) { specs[current] = r.spec; specs[current].why = cur().why; paint(); out.textContent = `✓ ${r.done} (${Math.round(res.answers.op.probabilities[r.op] * 100)}% · ${res.ms} ms)`; $('#editText').value = ''; }
  else out.textContent = `I couldn’t map that to a change (best guess: ${res.answers.op.choice}, ${Math.round(res.answers.op.probabilities[res.answers.op.choice] * 100)}%). Try naming the section or the change.`; });
function exportHtml() { return renderDoc(cur(), PUBLIC_BASE, { title: 'Kismet — ' + cur().brief }).replace(/<style>\[data-section\][^<]*<\/style>\n/, ''); }
$('#export').addEventListener('click', () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([exportHtml()], { type: 'text/html' })); a.download = 'kismet-landing-' + cur().key.toLowerCase() + '.html'; a.click(); });
$('#open').addEventListener('click', () => { const w = window.open(); w.document.write(exportHtml()); w.document.close(); });
