/* Copy contract: what a copywriter (the AI) may write for each block. A string is one text; [n, shape] is a list of n items.
   Blocks not listed here keep their fixed copy (claims, reviews, prices and legal text are never generated).
   The Landing Builder asks only for the blocks that are on the page; renderers read the result through cp(c, id, defaults). */
export const COPY = {
  page: { eyebrow: '2–4 words that sit above the hero headline', headline: 'hero headline, max 7 words, punchy, answers the brief; you may use one \\n to break it in two lines', sub: '1–2 sentences under the headline that say what this page is about, specific to the brief', cta: 'main button label, 2–3 words', marquee: '2–4 word phrase for the scrolling band that names the campaign', closing: 'last line of the page before the footer, max 7 words' },
  products: { desc: 'one sentence that introduces the product row, tied to the brief' },
  split: { title: 'display title, max 8 words', lead: '1–2 sentences explaining the product or idea', bullets: [3, 'one short benefit, max 8 words'] },
  ingredients: { title: 'display sentence about what goes in the food, max 14 words' },
  whats_inside: { title: 'display title for the ingredient-by-ingredient section, max 8 words', intro: '1–2 sentences on why every ingredient has a job' },
  story: { paragraphs: [3, 'one paragraph of 1–2 sentences about who Kismet is, in the founders’ voice'] },
  faq: { items: [5, { q: 'a question a visitor of THIS page would ask', a: 'a direct 1–2 sentence answer using only known facts' }] },
  features: { title: 'display title, max 8 words', items: [4, { title: '2–4 words', text: 'one sentence' }] },
  benefits: { title: 'display title, max 8 words', items: [4, 'a visible result owners notice, max 6 words'] },
  zigzag: { rows: [3, { title: 'display title, 2–5 words', text: '2 sentences that explain one idea in depth', link: 'link label, 2–3 words' }] },
  text_cols: { eyebrow: '2–3 words', title: 'display title, max 7 words', cols: [3, { title: '2–4 words', text: '2 sentences' }] },
  icon_list: { eyebrow: '2–4 words', title: 'display title, max 8 words', items: [4, { title: '2–4 words', text: 'one sentence' }] },
  statement: { text: 'one bold brand sentence, max 18 words; wrap the 2–4 most important words in *asterisks*' },
  process: { eyebrow: '2–4 words', title: 'display title, max 8 words', steps: [4, { title: 'step name, 2–4 words', text: '1–2 sentences' }] },
  media_cards: { cards: [3, { title: 'article title, max 6 words', text: 'one sentence teaser', link: 'link label, 2–3 words' }] },
  prose: { title: 'article heading, max 8 words', paragraphs: [2, 'a paragraph of 2–3 sentences'], quote: 'one sentence pull quote in the brand voice (not attributed to a real person)' },
  accordion_media: { eyebrow: '2–4 words', title: 'display title, max 6 words', items: [4, { q: 'topic, 1–3 words', a: '1–2 sentences' }] },
  callout: { title: '2–4 words', text: '1–2 sentences: one practical tip or note for this page' },
};
