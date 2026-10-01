/* Kismet Landing Builder — decision engine.
   1. questions(brief)  → one request to Jev (TypeSafe System One): ~30 atomic typed questions, evaluated in parallel.
   2. compose(answers)  → three page specs built in code from the probability distributions (no text generation).
   3. render(spec)      → HTML made only of design-system components.
   4. editQuestions / applyEdit → live iteration: Jev classifies the instruction, code applies it.
   If the Jev endpoint is not available, a local keyword scorer returns answers in the same shape ("demo mode"). */
import { TONE_COLORS } from './theme-colors.js';
import { CAMPAIGNS, SECTIONS, ENTITIES, THEMES, ORDER, OPTIONAL, PHOTOS, PRODUCTS, ANGLES, LEADS, CLOSERS, STRATEGIES, STRIPS, TONE_TOKEN } from './registry.js';

const MODEL = 'jev-latest';

/* ---------- 1 · questions ---------- */
export function questions() {
  const q = {
    campaign: { type: 'choice', instructions: 'What kind of landing page is being requested?', criteria: Object.fromEntries(Object.entries(CAMPAIGNS).map(([k, c]) => [k, c.describe])) },
    theme: { type: 'choice', instructions: 'Which visual mood fits this landing page best?', criteria: THEMES },
    length: { type: 'score', instructions: 'How long and detailed should this landing page be?', criteria: ['Short and focused: one message, one action', 'Medium: a few supporting sections', 'Long: full story with many sections'] },
    has_offer: { type: 'noul', instructions: 'The request mentions a discount, coupon, code, sale or limited-time deal' },
  };
  for (const [k, e] of Object.entries(ENTITIES)) q[k] = { type: 'choice', instructions: e.instructions, criteria: e.options };
  for (const id of OPTIONAL) q['use_' + id] = { type: 'noul', instructions: SECTIONS[id].when };
  for (const [id, s] of Object.entries(SECTIONS)) if (s.variants && s.variantQuestion) q['variant_' + id] = { type: 'choice', instructions: s.variantQuestion, criteria: s.variants };
  q.hero_kind = { type: 'choice', instructions: 'Which kind of hero should open this landing page?', criteria: SECTIONS.hero.variantWhen };
  for (const [k, st] of Object.entries(STRATEGIES)) q['fit_' + k] = { type: 'noul', instructions: 'The best approach for this landing page is to: ' + st.describe };
  return q;
}

export async function decide(brief, qs = questions()) {
  const t0 = performance.now();
  try {
    const r = await fetch('/api/jev', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state: brief, model: MODEL, questions: qs }) });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json(); if (!j.answers) throw new Error('no answers');
    return { answers: j.answers, source: 'jev', model: j.model, ms: Math.round(performance.now() - t0), usage: j.usage };
  } catch (e) {
    return { answers: localAnswers(brief, qs), source: 'local', ms: Math.round(performance.now() - t0), error: String(e.message || e) };
  }
}

/* ---------- local fallback: keyword scorer with the same answer shape ---------- */
const KW = {
  campaign: { retail: /walmart|target|petco|petsmart|costco|whole ?foods|store|tienda|retail|aisle|punto de venta|shelf/, launch: /launch|new product|nuevo producto|lanzamiento|introduc|just dropped|estrena/, promo: /\d+ ?%|discount|descuento|sale|promo|oferta|coupon|cup[oó]n|black friday|deal/, event: /event|evento|parade|desfile|pop-?up|meetup|festival|feria|sponsor/, subscription: /subscri|suscrip|quiz|plan|personaliz/, story: /story|historia|about|mission|misi[oó]n|ingredient|science|ciencia|vet/ },
  retailer: { walmart: /walmart/, target: /\btarget\b/, petco: /petco/, petsmart: /petsmart/, chewy: /chewy/, amazon: /amazon/, costco: /costco/, wholefoods: /whole ?foods/ },
  product: { food: /dog food|comida|kibble|recipe|receta|chicken|salmon|pollo/, toppers: /topper|shaker|gravy|pour/, treats: /treat|snack|premio|stick|square|nug/, starter: /starter|bundle|pack/, merch: /merch|hoodie|shirt|ropa|gift|regalo/ },
  goal: { find_store: /store|tienda|walmart|target|petco|aisle|near|cerca|punto de venta/, buy: /buy|comprar|cart|shop|vender/, subscribe: /subscri|suscrip/, signup: /email|correo|sign ?up|waitlist|lista/, quiz: /quiz/, register: /register|registr|rsvp|event|evento|parade/ },
  tone: { playful: /fun|divert|playful|halloween|party|fiesta/, clinical: /science|ciencia|clinical|cl[ií]nic|vet|proven|health|salud/, urgent: /limited|hoy|today|only|solo|last|[uú]ltim|\d+ ?%|black friday|hurry/, warm: /family|familia|story|historia|community|comunidad/ },
  theme: { submarine: /launch|lanzamiento|promo|sale|oferta|bold/, salad: /ingredient|natural|science|ciencia|health|salud|vet/, skittles: /event|evento|night|merch|halloween/, lego: /kids|community|comunidad|holiday|navidad|season/, electric: /walmart|store|tienda|classic/ },
  use: { locator: /store|tienda|walmart|target|petco|costco|near|cerca|punto de venta|aisle/, offer: /\d+ ?%|\$\d+|discount|descuento|coupon|cup[oó]n|code|c[oó]digo|oferta|deal|sale/, signup: /email|correo|sign ?up|waitlist|newsletter|offer|oferta/, steps: /how|c[oó]mo|steps|pasos|quiz|works|funciona/, values: /guarantee|garant|risk|trust|confianza|subscri|suscrip/, faq: /faq|question|pregunta|dudas/, products: /product|producto|topper|treat|food|comida|shop|bundle|vender|sell/, split: /new|nuevo|launch|lanzamiento|explain|explica|product|producto|story/, logos: /press|prensa|credib|trust|brand|marca/, marquee: /campaign|campa[ñn]a|promo|launch|lanzamiento|event/ },
};
function dist(text, table, keys, prior = {}) {
  const raw = {}; let sum = 0;
  for (const k of keys) { const m = table[k] ? (text.match(new RegExp(table[k].source, 'gi')) || []).length : 0; raw[k] = (prior[k] ?? 0.4) + m * 2.2; sum += raw[k]; }
  const p = {}; for (const k of keys) p[k] = raw[k] / sum; return p;
}
const top = p => Object.entries(p).sort((a, b) => b[1] - a[1]);
function choiceAnswer(p) { const t = top(p); return { type: 'choice', choice: t[0][0], probabilities: p, confidence: Math.min(1, (t[0][1] - (t[1]?.[1] || 0)) * 2 + 0.2) }; }
export function localAnswers(brief, qs) {
  const text = brief.toLowerCase(); const a = {};
  for (const [id, q] of Object.entries(qs)) {
    const keys = q.type === 'choice' ? Object.keys(q.criteria) : null;
    if (id === 'campaign') a[id] = choiceAnswer(dist(text, KW.campaign, keys, { subscription: 0.5 }));
    else if (id === 'retailer') a[id] = choiceAnswer(dist(text, KW.retailer, keys, { none: 1.2 }));
    else if (KW[id] && keys) a[id] = choiceAnswer(dist(text, KW[id], keys, id === 'product' ? { all: 0.8 } : id === 'theme' ? { electric: 0.7 } : {}));
    else if (id === 'length') { const n = Math.min(2, Math.floor(text.split(/\s+/).length / 9)); const p = { 0: 0.25, 1: 0.5, 2: 0.25 }; p[n] += 0.4; const s = p[0] + p[1] + p[2]; for (const k in p) p[k] /= s; a[id] = { type: 'score', score: +(p[1] + 2 * p[2]).toFixed(2), probabilities: p, confidence: 0.4 }; }
    else if (id === 'has_offer') a[id] = { type: 'noul', noul: KW.use.offer.test(text) ? 0.95 : 0.08 };
    else if (id.startsWith('use_')) { const s = id.slice(4); const hits = KW.use[s] ? (text.match(new RegExp(KW.use[s].source, 'gi')) || []).length : 0; a[id] = { type: 'noul', noul: Math.min(0.97, Math.max(0.35, SECTIONS[s].prior ?? 0.4) + hits * 0.3) }; }
    else if (id.startsWith('fit_')) { const F = { direct: [/promo|offer|oferta|descuento|\d+ ?%|sale|black friday|buy|coupon|cup[oó]n|deal/, 0.45], story: [/story|historia|brand|marca|launch|lanzamiento|family|community|event|evento|parade|campaign|campa[ñn]a/, 0.5], utility: [/store|tienda|walmart|target|petco|costco|find|locator|register|punto de venta|near|cerca/, 0.3], proof: [/science|ciencia|clinical|vet|proof|trust|review|health|salud|gut/, 0.4], showcase: [/product|producto|catalog|range|topper|treat|collection|new|nuevo|vender|sell/, 0.42], launchpad: [/launch|lanzamiento|new|nuevo|introduc|meet/, 0.3], editorial: [/article|art[ií]culo|explain|explica|science|ciencia|letter|carta|blog|educa/, 0.2], guide: [/guide|gu[ií]a|how to|c[oó]mo|tips|consejos|switch|transici[oó]n|feeding|tutorial/, 0.2], gathering: [/event|evento|parade|desfile|pop-?up|meetup|community|comunidad|invite|invita|rsvp/, 0.15], buybox: [/buy|compra|product page|pdp|add to cart|carrito|single product|un producto/, 0.25], manifesto: [/manifesto|manifiesto|mission|misi[oó]n|brand|marca|believe|creemos|values|valores/, 0.2] }[id.slice(4)]; const hits = (text.match(new RegExp(F[0].source, 'gi')) || []).length; a[id] = { type: 'noul', noul: Math.min(0.97, F[1] + hits * 0.22) }; }
    else if (id === 'hero_kind') { const H = { offer: /\d+ ?%|descuento|discount|sale|oferta|coupon|cup[oó]n/, video: /video|film|commercial|comercial/, product: /buy|compra|product page|un producto/, minimal: /manifesto|manifiesto|mission|misi[oó]n/, stack: /guide|gu[ií]a|about|brand|marca/, quiz: /quiz|plan|personal|subscri|suscrip/, event: /event|evento|parade|desfile|pop-?up/, center: /launch|lanzamiento|new|nuevo/, collage: /community|comunidad|range|catalog|colecci/, pagehead: /article|art[ií]culo|legal|faq/, page: /store|tienda|find|locator/, split: /register|detalle|detail/ }; const pr = {}; let s = 0; for (const k of keys) { pr[k] = (k === 'fold' ? 0.5 : 0.1) + (H[k] && H[k].test(text) ? 1 : 0); s += pr[k]; } for (const k in pr) pr[k] /= s; a[id] = choiceAnswer(pr); }
    else if (id === 'variant_hero') a[id] = choiceAnswer(/event|evento|parade|date|fecha|detail|register/.test(text) ? { fold: 0.3, split: 0.7 } : { fold: 0.72, split: 0.28 });
    else if (id === 'variant_marquee') a[id] = choiceAnswer({ accent: 0.45, ink: 0.25, soft: 0.15, brand: 0.15 });
    else if (id.startsWith('headline_')) { const p = {}; keys.forEach((k, i) => { const line = q.criteria[k].toLowerCase(); p[k] = 1 / (i + 1.5) + (/\{retailer\}/.test(line) && KW.goal.find_store.test(text) ? 0.5 : 0) + (/\{offer\}/.test(line) && KW.use.offer.test(text) ? 0.5 : 0); }); const s = Object.values(p).reduce((x, y) => x + y, 0); for (const k in p) p[k] /= s; a[id] = choiceAnswer(p); }
    else if (keys) { const p = {}; keys.forEach(k => p[k] = 1 / keys.length); a[id] = choiceAnswer(p); }
    else a[id] = { type: 'noul', noul: 0.5 };
  }
  return a;
}

/* ---------- 2 · compose three versions from the distributions ---------- */
const rank = ans => top(ans.probabilities).map(x => x[0]);
const nth = (ans, n) => { const r = rank(ans); return r[Math.min(n, r.length - 1)]; };
function slots(brief, a) {
  const offer = (brief.match(/\d+ ?% ?(off|de descuento|dto)?|\$ ?\d+ ?(off)?|free shipping|env[ií]o gratis|2x1|bogo/i) || [''])[0].replace(/de descuento|dto/i, 'off').trim();
  const quoted = (brief.match(/["“']([^"”']{3,40})["”']/) || [])[1];
  const retailer = a.retailer.choice, product = a.product.choice;
  return { retailer, retailerLabel: ENTITIES.retailer.labels[retailer], product, productLabel: ENTITIES.product.labels[product], offer: offer ? (/off|free|gratis|2x1|bogo/i.test(offer) ? offer : offer + ' off') : (a.has_offer.noul > 0.5 ? '20% off' : ''), name: quoted || '' };
}
const fill = (s, sl, camp) => s.replace(/\{retailer\}/g, sl.retailerLabel).replace(/\{product\}/g, sl.productLabel).replace(/\{offer\}/g, sl.offer || 'Save 30%').replace(/\{name\}/g, sl.name || (camp === 'event' ? 'The Kismet Dog Parade' : 'the new ' + sl.productLabel));

const TONE_ANGLE = { playful: 'playful', clinical: 'clinical', urgent: 'urgent', warm: 'warm' };
/* Build the section list of one strategy, then let the evidence adjust it:
   goal and offer inject sections, very low probabilities remove them, very high ones add them. */
/* blocks rebuilt 1:1 from the final Figma designs — the builder leans on them */
const SIGNATURE = ['products', 'ingredients', 'stats', 'compare', 'progress', 'reviews', 'story', 'stories', 'usp', 'faq', 'spotlight', 'media_cards'];
/* weighted random draw */
const draw = (items, weights) => { let r = Math.random() * weights.reduce((x, y) => x + y, 0); for (let i = 0; i < items.length; i++) if ((r -= weights[i]) <= 0) return items[i]; return items[items.length - 1]; };
export function structure(strategyId, sig) {
  const st = STRATEGIES[strategyId];
  /* optional blocks of the backbone stay with probability 0.45–0.95 following Jev's score: every generation is a new draw */
  let list = st.flow.map(x => { const must = x.includes('!'); const [id, variant] = x.replace('!', '').split(':'); return { id, must, variant: id === 'hero' ? st.hero : variant || null }; })
    .filter(x => x.must || Math.random() < (SIGNATURE.includes(x.id) ? 0.7 : 0.45) + 0.5 * (sig.use[x.id] ?? SECTIONS[x.id].prior ?? 0.4));
  const rv = list.find(x => x.id === 'reviews'); if (rv && !rv.variant) rv.variant = Math.random() < 0.5 ? 'photo' : 'cards';
  const has = id => list.some(x => x.id === id), put = (id, afterId, variant = null) => { if (has(id)) return; const i = list.findIndex(x => x.id === afterId); list.splice(i < 0 ? list.length : i + 1, 0, { id, variant }); };
  if (sig.goal === 'find_store') put('locator', strategyId === 'story' ? 'reviews' : 'hero');
  else if (sig.physical) put('locator', list[list.length - 2]?.id || 'hero'); // a store is named but it is not the main goal → locator near the end
  if (sig.hasOffer > 0.6) put('offer', has('products') ? 'products' : 'hero');
  if (sig.goal === 'signup' || (sig.campaign === 'promo' && strategyId !== 'utility')) { list = list.filter(x => x.id !== 'cta'); put('signup', list[list.length - 1].id); }
  if (sig.goal !== 'find_store' && !sig.physical) list = list.filter(x => x.id !== 'locator' || sig.use.locator > 0.5);
  list = list.filter(x => SECTIONS[x.id].fixed || x.must || (sig.use[x.id] ?? 0.5) >= 0.3 || x.id === 'locator' && (sig.goal === 'find_store' || sig.physical));                    // Jev is nearly sure it does not belong
  if (sig.hasOffer < 0.4) list = list.filter(x => x.id !== 'offer');
  /* two more blocks drawn from the whole library, weighted by Jev's score (squared): likely ones come up often, every block can come up */
  const SKIP = ['announce', 'sticky_cta', 'countdown', 'marquee', 'testimonial', 'offer', 'locator', 'signup', 'contact', 'event_details', 'specs', 'callout', 'prose', 'figure', 'image_duo', 'text_cols'];
  for (let n = 0; n < 2; n++) {
    const pool = OPTIONAL.filter(id => !has(id) && !SKIP.includes(id) && !(sig.taken && sig.taken.has(id)) && (sig.use[id] ?? 0) >= 0.2); if (!pool.length) break;
    const id = draw(pool, pool.map(id => (sig.use[id] ?? 0.3) ** 2 * (SIGNATURE.includes(id) ? 4 : 1))); if (sig.taken) sig.taken.add(id);
    const end = list.findIndex(x => ['cta', 'signup', 'newsletter', 'sticky_cta', 'faq'].includes(x.id)); const stop = end < 0 ? list.length : end; let at = list.findIndex((x, n) => n > 0 && ORDER.indexOf(x.id) > ORDER.indexOf(id)); at = at < 0 ? stop : Math.max(1, Math.min(at, stop)); // where it reads naturally in a page
    list.splice(at, 0, { id, variant: SECTIONS[id].variants ? Object.keys(SECTIONS[id].variants)[0] : null });
  }
  if (has('ingredients')) list = list.filter(x => x.id !== 'usp'); // the ingredients block already carries the promise card
  list = list.map(({ id, variant }) => ({ id, variant }));
  const pick = id => list.filter(x => x.id === id), body = list.filter(x => !['hero', 'announce', 'sticky_cta'].includes(x.id));
  return [...pick('announce'), { id: 'header', variant: null }, ...pick('hero'), ...body, { id: 'footer', variant: null }, ...pick('sticky_cta')];
}
export function compose(brief, res) {
  const a = res.answers, sl = slots(brief, a), camp = a.campaign.choice;
  const goalP = a.goal.probabilities[a.goal.choice]; const DEFAULT_GOAL = { retail: 'find_store', launch: 'buy', promo: 'subscribe', event: 'register', subscription: 'quiz', story: 'buy' };
  const physical = !['none', 'chewy', 'amazon'].includes(a.retailer.choice) && a.retailer.confidence > 0.5; const inStore = camp === 'retail' && physical; // a physical retailer always means "help me find it"
  const sig = { taken: new Set(), physical, campaign: camp, goal: inStore ? 'find_store' : goalP >= 0.35 ? a.goal.choice : DEFAULT_GOAL[camp], hasOffer: a.has_offer.noul, use: Object.fromEntries(OPTIONAL.filter(id => a['use_' + id]).map(id => [id, a['use_' + id].noul])) };
  /* version A is Jev's best fit; B and C are drawn from the rest, weighted by fit — so a new generation explores other approaches */
  const byFit = Object.keys(STRATEGIES).map(k => [k, a['fit_' + k].noul]).sort((x, y) => y[1] - x[1]); const ranked = [byFit.shift()];
  while (ranked.length < 3) { const ok = byFit.filter(x => x[1] >= 0.3), pool = ok.length ? ok : byFit.slice(0, 1); const s = draw(pool, pool.map(x => x[1] ** 3 + 0.001)); ranked.push(s); byFit.splice(byFit.indexOf(s), 1); }
  const shift = Math.floor(Math.random() * 3);
  const themes = rank(a.theme); if (top(a.theme.probabilities)[0][1] < 0.35) themes.unshift(CAMPAIGNS[camp].theme);
  const heroP = a.hero_kind.probabilities, heroKeys = Object.keys(SECTIONS.hero.variants), usedHeroes = [];
  const usedThemes = [], usedAngles = [];
  return ranked.slice(0, 3).map(([sid, fit], i) => {
    const st = STRATEGIES[sid];
    const freeThemes = themes.filter(t => !usedThemes.includes(t)); const theme = i === 0 ? freeThemes[0] : draw(freeThemes, freeThemes.map((t, n) => 1 / (n + 1))); usedThemes.push(theme);
    const toneAngle = TONE_ANGLE[a.tone.choice];
    let angle = i === 0 && a.tone.confidence > 0.5 && toneAngle ? toneAngle : st.angle;
    if (usedAngles.includes(angle)) angle = [st.angle, ...Object.keys(ANGLES)].find(x => !usedAngles.includes(x)); usedAngles.push(angle);
    const spec = { key: 'ABC'[i], label: st.label, note: st.describe, fit, brief, campaign: camp, strategy: sid, slots: sl, signals: sig, theme,
      copy: { angle, cta: i + shift, eyebrow: i + shift, marquee: i + shift }, photo: i + shift, sections: structure(sid, sig) };
    /* hero: drawn from Jev's distribution over the Kismet heroes, nudged toward the strategy's own; never repeated across versions */
    const h = spec.sections.find(x => x.id === 'hero'); const free = heroKeys.filter(k => !usedHeroes.includes(k));
    const hero = draw(free, free.map(k => (heroP[k] ?? 0) + (k === st.hero ? 0.35 : 0.05))); usedHeroes.push(hero); h.variant = hero;
    spec.why = explain(a, spec);
    return spec;
  });
}
function explain(a, spec) {
  const pct = x => Math.round(x * 100) + '%';
  const rows = [['Campaign', a.campaign.choice, a.campaign.probabilities[a.campaign.choice]], ['Strategy', STRATEGIES[spec.strategy].label, spec.fit], ['Retailer', a.retailer.choice, a.retailer.probabilities[a.retailer.choice]], ['Product', a.product.choice, a.product.probabilities[a.product.choice]], ['Goal', a.goal.choice, a.goal.probabilities[a.goal.choice]], ['Tone', a.tone.choice, a.tone.probabilities[a.tone.choice]], ['Theme', spec.theme, a.theme.probabilities[spec.theme]], ['Has offer', a.has_offer.noul > 0.6 ? 'yes' : 'no', a.has_offer.noul]];
  for (const [k, st] of Object.entries(STRATEGIES)) if (k !== spec.strategy) rows.push(['· ' + st.label, 'not used here', a['fit_' + k].noul]);
  return rows.map(r => ({ what: r[0], pick: r[1], p: pct(r[2]) }));
}

/* ---------- 3 · render ---------- */
function context(spec) {
  const c = CAMPAIGNS[spec.campaign], sl = spec.slots, pick = (arr, i) => fill(arr[i % arr.length], sl, spec.campaign);
  const photos = Object.values(PHOTOS), products = PRODUCTS[sl.product] || PRODUCTS.food, store = sl.retailer !== 'none';
  const goal = spec.signals.goal, CLOSING = { find_store: 'See you in the pet aisle.', buy: 'Ready when you are.', subscribe: 'Better bowls start today.', signup: 'Be the first to know.', quiz: 'Find their perfect recipe.', register: 'See you there.' };
  return { eyebrow: pick(c.eyebrow, spec.copy.eyebrow), headline: fill(c.headline[spec.copy.angle], sl, spec.campaign), sub: fill(LEADS[spec.copy.angle] + ' ' + CLOSERS[goal], sl, spec.campaign), cta: pick(c.cta, spec.copy.cta), cta2: store ? 'Shop online' : 'Shop Kismet', offer: sl.offer, closing: CLOSING[goal], marquee: pick(c.marquee, spec.copy.marquee),
    photo: photos[spec.photo % photos.length], products, retailerLabel: sl.retailerLabel,
    productsTitle: store ? `On the shelf at ${sl.retailerLabel}` : `Shop ${sl.productLabel}`, cardCta: store ? 'Find in store' : 'Add to cart', cardTag: store ? 'In store' : null,
    splitTitle: spec.campaign === 'launch' ? `Meet ${sl.name || 'the new ' + sl.productLabel}.` : 'Start feeding better from day one.',
    stepsTitle: store ? 'Find us in 3 steps.' : 'From quiz to bowl in 3 steps.',
    steps: store ? [['Head to the pet aisle.', 'Kismet sits next to the premium dry food.'], ['Spot the coral bag.', 'Food, toppers and treats — all in stock.'], ['Scan for your deal.', 'The QR on the shelf tag unlocks your offer.']] : [['Tell us about your dog.', '30-second quiz: breed, age, weight, sensitivities.'], ['We ship to your door.', 'Free on $50+. Dry, shelf-stable — no fridge.'], ['Skip or cancel anytime.', 'Manage everything from your account.']],
    offerShort: (sl.offer || '20% off').replace(/ off/i, '') + (/(%|\$)/.test(sl.offer || '20%') ? ' off' : ''), offerTitle: `${sl.offer ? sl.offer[0].toUpperCase() + sl.offer.slice(1) : '20% off'} ${store ? 'at ' + sl.retailerLabel : 'your first order'}`, offerCode: (sl.offer.match(/\d+/) || ['20'])[0],
    signupTitle: sl.offer ? `Get ${sl.offer}` : 'Get our launch offer',
    faq: [[store ? `Which ${sl.retailerLabel} stores carry Kismet?` : 'Is Kismet clinically proven?', store ? 'Use the store locator to check stock before you go.' : 'Yes — 96% of dogs showed improved gut health in 45 days.'], ['Is it the same recipe as online?', 'Yes — the same vet-developed recipes, made in the U.S.A.'], ['Can I still subscribe?', 'Of course. Subscribe on kismetpets.com to save 30%.']] };
}
/* Page rhythm: a standalone marquee becomes the title of the section after it; every body section gets a colour band that differs
   from its neighbours, a wave into the next band, and — every other section at most — a marquee that names it. */
export function rhythm(sections, c, theme = 'electric') {
  const hex = TONE_COLORS[theme] || TONE_COLORS.electric, same = (a, b) => a && b && hex[a] === hex[b]; // two tones can be the same colour in a theme
  const out = []; let prev = null, prev2 = null, sinceMq = 9;
  const titles = (s, i) => s.id === 'marquee' && sections[i + 1] && !STRIPS.includes(sections[i + 1].id);
  sections.forEach((s, i) => { if (titles(s, i)) sections[i + 1]._mq = true; });
  const list = sections.filter((s, i) => !titles(s, i));
  list.forEach((s, i) => {
    if (STRIPS.includes(s.id)) { out.push({ s }); prev2 = prev; prev = null; sinceMq++; return; }
    const sec = SECTIONS[s.id], tones = sec.tones;
    const all = [...tones, ...Object.keys(hex).filter(t => !tones.includes(t) && t !== 'ink')];
    const last = !list.slice(i + 1).some(x => !STRIPS.includes(x.id)), okEnd = t => !last || hex[t] !== hex.footer; // the last band meets the footer wordmark: it cannot be the footer's colour
    const tone = all.find(t => !same(t, prev) && !same(t, prev2) && okEnd(t)) || all.find(t => !same(t, prev) && okEnd(t)) || tones[0];
    const next = list[i + 1], wave = !!next && !STRIPS.includes(next.id);
    const label = typeof sec.mq === 'function' ? sec.mq(c) : sec.mq; const photoLed = ['story', 'stories', 'testimonial'].includes(s.id) || (s.id === 'reviews' && s.variant === 'photo'); // photo-led sections always carry their marquee
    const mq = label && (s._mq || photoLed || sinceMq >= 2) ? (s._mq && c.marquee && s.id !== 'reviews' && s.id !== 'story' && s.id !== 'stories' ? c.marquee : label) : null;
    sinceMq = mq ? 0 : sinceMq + 1; delete s._mq;
    out.push({ s, tone, wave, mq }); prev2 = prev; prev = tone;
  });
  return out;
}
const mqHtml = text => `<div class="k-marquee" aria-hidden="true"><div class="k-marquee__track"><span class="k-icon k-icon--burst"></span><span class="k-marquee__item">${String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span></div></div>`;
export function renderBody(spec) { const c = context(spec); let lastTone = null; return rhythm(spec.sections.map(s => ({ ...s })), c, spec.theme).map(({ s, tone, wave, mq }) => (tone && (lastTone = tone), tone)
  ? `<div data-section="${s.id}" class="k-band k-band--${tone}${wave ? ' k-band--wave' : ''}${mq ? ' k-band--mq' : ''}">${mq ? mqHtml(mq) : ''}${SECTIONS[s.id].render(c, s.variant)}</div>`
  : `<div data-section="${s.id}"${s.id === 'footer' && lastTone ? ` style="--footer-top:var(--color-${TONE_TOKEN[lastTone]})"` : ''}>${SECTIONS[s.id].render(c, s.variant)}</div>`).join('\n'); }
export function renderDoc(spec, base, { title = 'Kismet landing' } = {}) {
  return `<!doctype html>\n<html lang="en" data-theme="${spec.theme}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${title}</title>\n<base href="${base}">\n<link rel="stylesheet" href="css/kismet.css">\n<script src="js/kismet.js" defer><\/script>\n<style>[data-section].is-picked{outline:3px solid #00c4d6;outline-offset:-3px}</style>\n</head>\n<body><div class="k-page">\n${renderBody(spec)}\n</div></body>\n</html>`;
}

/* ---------- 4 · live iteration ---------- */
export const OPS = {
  theme: 'Change the colors, palette, theme or mood of the page', hero_layout: 'Change the hero layout: photo with text on top versus text panel beside a photo',
  headline_next: 'Change, rewrite or try another headline or title', cta_next: 'Change the button text or call to action', photo_next: 'Change the hero photo or image',
  add_section: 'Add a section or block to the page', remove_section: 'Remove or delete a section or block from the page', move_up: 'Move a section higher or earlier on the page', move_down: 'Move a section lower or later on the page',
  restructure: 'Try a completely different page structure, layout, approach or version',
  shorter: 'Make the whole page shorter, simpler or more focused', longer: 'Make the whole page longer or more complete', marquee_style: 'Change the marquee or scrolling text band style', none: 'None of these; unclear request',
};
export function editQuestions() {
  return { op: { type: 'choice', instructions: 'Which change is the user asking for?', criteria: OPS },
    section: { type: 'choice', instructions: 'Which section of the page does the request refer to?', criteria: { ...Object.fromEntries(OPTIONAL.map(id => [id, SECTIONS[id].label + ': ' + SECTIONS[id].when])), hero: 'The hero at the top of the page', none: 'No specific section' } },
    theme: { type: 'choice', instructions: 'Which visual mood is the user asking for?', criteria: THEMES } };
}
const EKW = { op: { theme: /color|tema|theme|palette|paleta|mood|verde|green|azul|blue|rojo|red|electric|submarine|salad|skittles|lego/, hero_layout: /hero|header|encabezado|fold/, restructure: /structure|estructura|layout|approach|enfoque|different|diferente|otra versi[oó]n|distint/, headline_next: /headline|title|t[ií]tulo|titular|copy|texto/, cta_next: /button|bot[oó]n|cta|call to action/, photo_next: /photo|foto|image|imagen/, add_section: /add|agrega|a[ñn]ad|incluye|include|pon |suma/, remove_section: /remove|quita|elimina|delete|borra|sin /, move_up: /up|sube|arriba|earlier|antes/, move_down: /down|baja|abajo|later|despu[eé]s/, shorter: /short|corto|corta|simple|menos|compact/, longer: /long|largo|larga|m[aá]s completo|more|full/, marquee_style: /marquee|marquesina|band|banda/ },
  section: { locator: /store|tienda|locator|mapa|zip/, offer: /offer|oferta|descuento|coupon|cup[oó]n|deal/, signup: /email|correo|sign ?up|newsletter|registro/, steps: /steps|pasos|how it works|c[oó]mo funciona/, values: /guarantee|garant|values|confianza/, faq: /faq|preguntas|questions/, products: /product|producto|cards|tarjetas/, split: /50|split|bullets|explica/, logos: /logos|press|prensa/, marquee: /marquee|marquesina/, hero: /hero|fold|encabezado/ },
  theme: { electric: /electric|salm[oó]n|default|c[aá]lid/, submarine: /submarine|coral|rojo|red|bold|turquesa/, salad: /salad|verde|green|natural|kale/, skittles: /skittles|oscuro|dark|night|rosa|pink/, lego: /lego|mint|menta|playful|divert/ } };
export async function decideEdit(text) {
  const qs = editQuestions(); const t0 = performance.now();
  try { const r = await fetch('/api/jev', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state: text, model: MODEL, questions: qs }) }); if (!r.ok) throw new Error('HTTP ' + r.status); const j = await r.json(); return { answers: j.answers, source: 'jev', ms: Math.round(performance.now() - t0) }; }
  catch (e) { const t = text.toLowerCase(); return { source: 'local', ms: Math.round(performance.now() - t0), answers: { op: choiceAnswer(dist(t, EKW.op, Object.keys(OPS), { none: 0.5 })), section: choiceAnswer(dist(t, EKW.section, Object.keys(qs.section.criteria), { none: 0.5 })), theme: choiceAnswer(dist(t, EKW.theme, Object.keys(THEMES))) } }; }
}
export function applyEdit(spec, a) {
  const s = structuredClone(spec), op = a.op.choice, sec = a.section.choice, has = id => s.sections.findIndex(x => x.id === id), cyc = (o, cur) => { const k = Object.keys(o); return k[(k.indexOf(cur) + 1) % k.length]; };
  const add = id => { if (has(id) < 0 && !SECTIONS[id].fixed) { const v = SECTIONS[id].variants ? Object.keys(SECTIONS[id].variants)[0] : null; s.sections.push({ id, variant: v }); s.sections.sort((x, y) => ORDER.indexOf(x.id) - ORDER.indexOf(y.id)); } };
  let done = OPS[op];
  if (op === 'theme') s.theme = top(a.theme.probabilities)[0][1] > 0.3 ? a.theme.choice : cyc(THEMES, s.theme);
  else if (op === 'hero_layout') { const h = s.sections[has('hero')]; h.variant = cyc(SECTIONS.hero.variants, h.variant); }
  else if (op === 'headline_next') s.copy.angle = cyc(ANGLES, s.copy.angle);
  else if (op === 'restructure') { s.signals.taken = new Set(); s.strategy = cyc(STRATEGIES, s.strategy); s.label = STRATEGIES[s.strategy].label; s.copy.angle = STRATEGIES[s.strategy].angle; s.sections = structure(s.strategy, s.signals); }
  else if (op === 'cta_next') s.copy.cta++;
  else if (op === 'photo_next') s.photo++;
  else if (op === 'marquee_style') { add('marquee'); const m = s.sections[has('marquee')]; m.variant = cyc(SECTIONS.marquee.variants, m.variant); }
  else if (op === 'add_section' && sec !== 'none' && sec !== 'hero') add(sec);
  else if (op === 'remove_section' && sec !== 'none' && has(sec) >= 0 && !SECTIONS[sec].fixed) s.sections.splice(has(sec), 1);
  else if ((op === 'move_up' || op === 'move_down') && has(sec) >= 0 && !SECTIONS[sec].fixed) { const i = has(sec), j = i + (op === 'move_up' ? -1 : 1); if (s.sections[j] && !SECTIONS[s.sections[j].id].fixed) [s.sections[i], s.sections[j]] = [s.sections[j], s.sections[i]]; }
  else if (op === 'shorter') { const opt = s.sections.filter(x => !SECTIONS[x.id].fixed); if (opt.length > 1) s.sections.splice(s.sections.indexOf(opt[opt.length - 1]), 1); }
  else if (op === 'longer') { const next = OPTIONAL.find(id => has(id) < 0); if (next) add(next); }
  else done = null;
  return { spec: s, done, op, confidence: a.op.confidence };
}
export { SECTIONS, THEMES, OPTIONAL, ORDER, CAMPAIGNS, STRATEGIES, ANGLES };
