/* Kismet Landing Builder — component registry.
   This file is the "logic" Jev works with. Jev never writes text or HTML: it only answers typed questions
   (choice / score / noul). Everything it can pick from is declared here:
     · CAMPAIGNS  — the kinds of landing we know how to build, with a copy bank (pre-written, on-brand lines with {slots})
     · SECTIONS   — the blocks of the design system, when each one is useful, and how to render it with kit classes
     · ENTITIES   — closed lists Jev chooses from to fill the {slots} (retailer, product, goal…)
   Add a campaign, a headline or a section here and the builder (and Jev) can use it immediately. */

import { LIBRARY, byId as LIB } from '../library/sections.js';

export const THEMES = {
  electric: 'Warm and friendly: salmon, yellow, dark green. The default Kismet look.',
  submarine: 'Bold and energetic: coral red, turquoise, yellow. Good for launches and promotions.',
  salad: 'Natural and calm: kale green, curry yellow. Good for ingredients, health and science.',
  skittles: 'Cool and modern: dark night, turquoise, pink. Good for events and merch.',
  lego: 'Playful and loud: coral, mint green, yellow. Good for kids, community and seasonal campaigns.',
};

export const ENTITIES = {
  retailer: {
    instructions: 'Which retailer or sales channel is this landing page about?',
    options: { walmart: 'Walmart stores or Walmart.com', target: 'Target', petco: 'Petco', petsmart: 'PetSmart', chewy: 'Chewy', amazon: 'Amazon', costco: 'Costco', wholefoods: 'Whole Foods', none: 'No specific retailer; Kismet own website' },
    labels: { walmart: 'Walmart', target: 'Target', petco: 'Petco', petsmart: 'PetSmart', chewy: 'Chewy', amazon: 'Amazon', costco: 'Costco', wholefoods: 'Whole Foods', none: 'Kismet' },
  },
  product: {
    instructions: 'Which Kismet product line is the main focus of this landing page?',
    options: { food: 'Dry dog food recipes (chicken, salmon)', toppers: 'Toppers, shakers, pour-overs', treats: 'Treats: sticks, squares, nugs', starter: 'Starter packs or bundles', merch: 'Merchandise, clothing, gifts', all: 'The whole range, no single product' },
    labels: { food: 'dog food', toppers: 'toppers', treats: 'treats', starter: 'Starter Pack', merch: 'merch', all: 'Kismet' },
  },
  goal: {
    instructions: 'What is the single main action the visitor should take on this page?',
    options: { find_store: 'Find a physical store that sells it', buy: 'Buy or add to cart online', subscribe: 'Start a subscription', signup: 'Leave an email address', quiz: 'Take the dog quiz', register: 'Register for or attend an event' },
  },
  tone: {
    instructions: 'What tone of voice fits this campaign best?',
    options: { playful: 'Fun, cheeky, dog-loving', clinical: 'Science, proof, vet-approved', urgent: 'Limited time, act now', warm: 'Community, family, story' },
  },
};

/* Copy bank. Lines are written once by a human, on brand; Jev only picks. Slots: {retailer} {product} {offer} {name}
   Every campaign has one headline per ANGLE, so two versions of the same brief never say the same thing. */
export const ANGLES = { urgent: 'Act now, limited time, direct', warm: 'Emotional, family, community', plain: 'Practical, clear, helpful', clinical: 'Evidence, science, vets', playful: 'Fun, cheeky, dog-loving' };
export const CAMPAIGNS = {
  retail: { describe: 'Kismet is now sold at a retailer or in physical stores; help people find it there', theme: 'electric',
    eyebrow: ['Now in stores', 'New at {retailer}', 'In the pet aisle'],
    headline: { urgent: 'Run, don’t walk,\nto {retailer}', warm: 'Kismet is now\nat {retailer}', plain: 'Find Kismet\nat {retailer}', clinical: 'Vet-approved,\nnow at {retailer}', playful: 'Sniff us out\nat {retailer}' },
    cta: ['Find a store', 'Find {retailer} near you', 'Shop at {retailer}'], marquee: ['Now at {retailer}', 'In stores now', 'Find us in the pet aisle'] },
  launch: { describe: 'A new product is launching or being introduced', theme: 'submarine',
    eyebrow: ['New', 'Just dropped', 'New · {product}'],
    headline: { urgent: '{name}\nis here', warm: 'Made for the\nbowl they love', plain: 'Meet {name}', clinical: 'New. Proven.\nGut-approved.', playful: 'Pour on\nthe good stuff' },
    cta: ['Shop the launch', 'Try {name}', 'Add to my bowl'], marquee: ['New {product}', 'Just launched', 'Meet {name}'] },
  promo: { describe: 'A discount, sale, coupon or limited-time offer', theme: 'submarine',
    eyebrow: ['Limited time', 'This week only', 'Special offer'],
    headline: { urgent: '{offer}.\nThis week only.', warm: 'A little treat\nfor your best friend', plain: '{offer}\nyour first order', clinical: 'Proven food,\n{offer}', playful: 'Bowl goals,\n{offer}' },
    cta: ['Get {offer}', 'Claim the offer', 'Shop the sale'], marquee: ['{offer}', 'Limited time only', 'Subscribe & save'] },
  event: { describe: 'An event, parade, pop-up, meetup or sponsorship with a date and place', theme: 'skittles',
    eyebrow: ['Save the date', 'Presented by Kismet', 'Join us'],
    headline: { urgent: 'Save your spot\nbefore it’s gone', warm: 'Dogs, people,\none big party', plain: '{name}', clinical: 'Come meet\nthe vets', playful: 'Costumes on.\nTails up.' },
    cta: ['Register now', 'Save my spot', 'Get the details'], marquee: ['{name}', 'Presented by Kismet', 'Dogs welcome'] },
  subscription: { describe: 'Getting new customers to subscribe to dog food; the quiz, personalized plans', theme: 'electric',
    eyebrow: ['Personalized plans', 'Subscribe & save', 'Made for your dog'],
    headline: { urgent: 'Start today,\nsave {offer}', warm: 'A plan as unique\nas your dog', plain: 'From quiz\nto bowl', clinical: 'Fix the gut\nfuel the dog', playful: 'Better bowls,\nwaggier tails' },
    cta: ['Take the quiz', 'Build my plan', 'Get 30% off today'], marquee: ['Clinically proven food', 'Bowl goals', 'Subscribe & save 30%'] },
  story: { describe: 'Brand story, mission, ingredients, science, about us, partnerships', theme: 'salad',
    eyebrow: ['Our story', 'Why Kismet', 'The science'],
    headline: { urgent: 'Better food\ncan’t wait', warm: 'Made by\ndog people', plain: 'The good stuff,\nexplained', clinical: 'Real food,\nreal results', playful: 'We’re obsessed\nwith your dog' },
    cta: ['Meet the food', 'See the science', 'Shop Kismet'], marquee: ['About us', 'Our stories', 'Clinically proven'] },
};
/* Sub-copy is assembled from two picked parts (opening by angle + closing by goal): 5 × 6 combinations, zero generation. */
export const LEADS = { urgent: 'For a limited time only.', warm: 'Made with love by longtime dog people.', plain: 'Fresh-baked, gut-healthy dog food.', clinical: 'Clinically proven: 96% of dogs showed improved gut health in 45 days.', playful: 'Real food your dog will actually lose it over.' };
export const CLOSERS = { find_store: 'Now on the shelf in the pet aisle at {retailer} — no subscription needed.', buy: 'Add it to your cart and it ships free over $50.', subscribe: 'Subscribe to save 30% and skip or cancel anytime.', signup: 'Leave your email and we’ll send the details.', quiz: 'Take the 30-second quiz and we’ll match the right recipe.', register: 'Free to attend — treats are on us.' };

/* Page strategies: five different ways to tell the same campaign. Jev scores how well each fits the request;
   the three best become versions A, B and C. Each strategy has its own structure, hero, angle and rhythm. */
export const STRATEGIES = {
  direct: { label: 'Direct response', describe: 'Get to the action fast: one message, the offer or product, and one clear button', angle: 'urgent', hero: 'split',
    flow: ['hero', 'usp', 'marquee:accent', 'spotlight', 'products', 'offer', 'plans', 'guarantee', 'cta:accent', 'sticky_cta'] },
  story: { label: 'Storytelling', describe: 'Tell a story with emotion and lifestyle photography before asking for anything', angle: 'warm', hero: 'fold',
    flow: ['hero', 'logos', 'ingredients', 'progress', 'zigzag', 'marquee:soft', 'founder', 'gallery', 'reviews', 'steps', 'cta'] },
  utility: { label: 'Utility first', describe: 'Be practical: help people find, locate, check or do something right away', angle: 'plain', hero: 'page',
    flow: ['hero', 'locator', 'steps', 'products', 'retailers', 'callout', 'faq', 'newsletter'] },
  proof: { label: 'Proof & trust', describe: 'Convince skeptics with evidence: reviews, numbers, science and guarantees', angle: 'clinical', hero: 'fold',
    flow: ['hero', 'number_strip', 'press_quotes', 'before_after', 'compare', 'progress', 'rating_summary', 'reviews', 'guarantee', 'faq', 'cta'] },
  showcase: { label: 'Product showcase', describe: 'Show the products like a catalog and let people browse', angle: 'playful', hero: 'collage',
    flow: ['hero', 'marquee:brand', 'categories', 'products', 'bundle', 'ingredients', 'tabbed', 'testimonial', 'cta:panel'] },
  launchpad: { label: 'Launch pad', describe: 'Introduce one new thing: present it, explain why it matters and let people get it', angle: 'playful', hero: 'center',
    flow: ['announce', 'hero', 'features', 'video', 'spotlight', 'accordion_media', 'benefits', 'ugc', 'offer', 'cta:accent'] },
  editorial: { label: 'Editorial', describe: 'Educate or explain with longer reading content, like an article or a letter', angle: 'clinical', hero: 'pagehead',
    flow: ['hero', 'figure', 'prose', 'founder', 'text_cols', 'specs', 'stories', 'newsletter'] },
  guide: { label: 'Guide', describe: 'Teach people how to do something step by step, with practical tips and answers', angle: 'plain', hero: 'stack',
    flow: ['hero', 'text_cols', 'process', 'icon_list', 'callout', 'media_cards', 'faq', 'banner'] },
  gathering: { label: 'Gathering', describe: 'Invite people to an event or community moment: when, where, who and how to join', angle: 'warm', hero: 'event',
    flow: ['hero', 'countdown', 'event_details', 'image_duo', 'team', 'ugc', 'signup', 'faq', 'cta:panel'] },
  buybox: { label: 'Buy box', describe: 'Sell one specific product right at the top like a product page, then remove every doubt', angle: 'urgent', hero: 'product',
    flow: ['hero', 'usp', 'icon_list', 'accordion_media', 'specs', 'rating_summary', 'reviews', 'bundle', 'guarantee', 'faq', 'sticky_cta'] },
  manifesto: { label: 'Manifesto', describe: 'Lead with a bold brand statement and beliefs, then back them up', angle: 'playful', hero: 'minimal',
    flow: ['hero', 'marquee:accent', 'zigzag', 'number_strip', 'statement', 'team', 'stories', 'cta:accent'] },
};

const PHOTOS = { picnic: 'assets/img/hero-picnic.jpg', family: 'assets/img/people-family.jpg', about: 'assets/img/about-us.jpg' };
const PRODUCTS = {
  food: [['Chicken & Barley Recipe', '$31.49', 'product-chicken.jpg', 'Best Seller'], ['Salmon & Brown Rice Recipe', '$34.99', 'product-salmon.jpg', 'New'], ['Freeze-Dried Nugs', '$12.99', 'product-nugs.jpg', 'Pairs well']],
  toppers: [['Freeze-Dried Nugs', '$12.99', 'product-nugs.jpg', 'Best Seller'], ['Beef Squares', '$17.49', 'product-beef-squares.jpg', 'New'], ['Salmon Sticks', '$12.59', 'product-salmon-sticks.jpg', 'Fan favorite']],
  treats: [['Salmon Sticks', '$12.59', 'product-salmon-sticks.jpg', 'Best Seller'], ['Beef Squares', '$17.49', 'product-beef-squares.jpg', 'New'], ['Freeze-Dried Nugs', '$12.99', 'product-nugs.jpg', 'Pairs well']],
};
PRODUCTS.starter = PRODUCTS.food; PRODUCTS.merch = PRODUCTS.treats; PRODUCTS.all = PRODUCTS.food;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const br = s => esc(s).replace(/\n/g, '<br>');
const icon = n => `<span class="k-icon k-icon--${n}"></span>`;
const wavy = (label, mod = '') => `<a href="#" class="k-wavy ${mod}">${esc(label)}</a>`;

/* Each section: when (plain-English statement Jev scores with a Noul), fixed (always / never asked), render(ctx, variant). */
const HERO_KEY = { hero_center: 'center', hero_collage: 'collage', page_head: 'pagehead', hero_offer: 'offer', hero_video: 'video', hero_product: 'product', hero_minimal: 'minimal', hero_stack: 'stack', hero_quiz: 'quiz', hero_event: 'event' };
const HERO_LIB = Object.fromEntries(Object.entries(HERO_KEY).map(([k, v]) => [v, k]));
export const SECTIONS = {
  header: { label: 'Header', fixed: true, render: () => `
<header class="k-header"><div class="k-header__promo"><span>Free shipping on $50+</span>${icon('burst')}<span>Subscribe &amp; Save 30% on your first order + Free Gift with order two</span>${icon('burst')}<span>Try Kismet Risk-free. 100% Money-back Guarantee</span></div>
<div class="k-header__bar"><div class="k-header__side"><button class="k-header__action k-header__menu" aria-label="Menu">${icon('menu')}</button><nav class="k-header__links"><a href="#">Shop ${icon('chevron-down')}</a><a href="#">About</a><a href="#">Ingredients</a><a href="#">Tails ${icon('chevron-down')}</a><a href="#">Find a Store</a></nav></div><a href="#" class="k-logo k-header__logo" aria-label="Kismet"></a><div class="k-header__side k-header__side--end"><a href="#" class="k-header__action">${icon('dog')}</a><a href="#" class="k-header__action">${icon('cart')}<span class="k-header__count">2</span></a></div></div></header>` },

  hero: { label: 'Hero', fixed: true, variants: { fold: 'Full photo with text on top', split: 'Text panel next to a photo', page: 'Compact photo header with buttons', center: 'Centered on a color with product image', collage: 'Text with a photo collage', pagehead: 'Compact title header, no photo', offer: 'The discount as the headline', video: 'Video poster with play button', product: 'One product with price and buy button', minimal: 'Words only on a dark color', stack: 'Headline over a wide photo card with facts', quiz: 'Starts a quiz or sign-up in the hero', event: 'Date block with event details' },
    /* which hero fits — Jev answers this as one choice question */
    variantWhen: { fold: 'A full lifestyle photo with the headline on top works best: emotional, brand-led campaigns', split: 'A text panel beside a photo works best: a message that needs a sentence of explanation and two actions', page: 'A compact photo header with buttons is enough: practical pages where the task matters more than the image', ...Object.fromEntries(LIBRARY.filter(b => b.hero).map(b => [HERO_KEY[b.id], b.when])) },
    render: (c, v) => HERO_LIB[v] ? LIB[HERO_LIB[v]].render(c) : v === 'split' ? `
<section class="k-split-hero"><img class="k-media k-split-hero__photo" src="${c.photo}" alt=""><div class="k-split-hero__panel"><p class="k-eyebrow">${esc(c.eyebrow)}</p><h1 class="k-display k-split-hero__title">${br(c.headline)}</h1><p class="k-lead">${esc(c.sub)}</p>${c.offer ? `<div class="k-row k-gap-xs k-row--wrap"><span class="k-badge k-badge--promo">${esc(c.offer)}</span><span class="k-badge">Limited time</span></div>` : ''}<div class="k-split-hero__actions">${wavy(c.cta)}${wavy(c.cta2, 'k-wavy--secondary')}</div></div></section>` : v === 'page' ? `
<section class="k-fold k-fold--page" style="background-image:url('${c.photo}')"><div class="k-fold__content"><div class="k-fold__text"><h1 class="k-fold__title">${br(c.headline)}</h1><p class="k-fold__desc">${esc(c.sub)}</p></div><div class="k-fold__actions"><a href="#" class="k-btn k-btn--lg">${esc(c.cta)}</a><a href="#" class="k-btn k-btn--neutral k-btn--lg">${esc(c.cta2)}</a></div></div></section>` : `
<section class="k-fold" style="background-image:url('${c.photo}')"><div class="k-fold__content"><div class="k-fold__text"><h1 class="k-fold__title">${br(c.headline)}</h1><p class="k-fold__desc">${esc(c.sub)}</p></div><div class="k-fold__actions">${wavy(c.cta)}</div></div></section>` },

  logos: { label: 'Press logos', when: 'The page benefits from showing press logos and credibility right under the hero', prior: 0.6, render: () => `
<div class="k-logos"><div class="k-logos__track">${['today', 'drew', 'tonight-show', 'parade', 'fast-company', 'people'].map(n => `<img src="assets/img/press-${n}.svg" alt="">`).join('')}</div></div>` },

  marquee: { label: 'Marquee', when: 'A bold scrolling text band would reinforce the campaign message', prior: 0.75, variants: { accent: 'Colored band, loud', ink: 'Dark text on the page, calm', soft: 'Soft pink band, friendly', brand: 'Turquoise band, fresh' },
    render: (c, v) => `
<div class="k-marquee k-marquee--${v || 'accent'}" aria-hidden="true"><div class="k-marquee__track">${icon('burst')}<span class="k-marquee__item">${esc(c.marquee)}</span></div></div>` },

  split: { label: '50/50 content', when: 'The page should explain what the product or offer is, with a photo, short copy and bullet points', prior: 0.6, variants: { left: 'Photo on the left', right: 'Photo on the right' },
    render: (c, v) => `
<section class="k-split ${v === 'right' ? 'k-split--reverse' : ''}"><img class="k-media k-split__media" src="assets/img/${c.products[0][2]}" alt=""><div class="k-split__content"><p class="k-eyebrow">${esc(c.eyebrow)}</p><h2 class="k-display k-split__title">${esc(c.splitTitle)}</h2><p class="k-lead">Vet-approved, superfood-powered and clinically proven to improve digestion and support whole-body health.</p><ul class="k-bullets"><li>${icon('check')}Real protein is the #1 ingredient</li><li>${icon('check')}Pre + probiotics for gut health</li><li>${icon('check')}No fillers, no fridge needed</li></ul>${wavy(c.cta)}</div></section>` },

  products: { label: 'Product row', when: 'The page should show specific products people can buy or look for', prior: 0.7, render: c => `
<section class="k-section k-product-row"><div class="k-product-row__head"><div class="k-product-row__titles"><h2 class="k-product-row__title">${esc(c.productsTitle)}</h2><p class="k-product-row__desc">Real protein first, pre + probiotics in every bowl, and a 45-day money-back promise.</p></div><a href="#" class="k-btn k-btn--neutral">See all products</a></div>
<div class="k-product-row__list">${c.products.map(p => `<article class="k-card k-card--simple"><div class="k-card__media"><img src="assets/img/${p[2]}" alt=""><span class="k-card__rating">4.8 ${icon('star')}</span><span class="k-card__tag">${esc(c.cardTag || p[3])}</span><div class="k-card__info"><div class="k-card__price"><span class="k-card__amount">${p[1]}</span></div><h3 class="k-card__name">${esc(p[0])}</h3></div></div><div class="k-card__body"><div class="k-card__actions"><button class="k-card__cta">${esc(c.cardCta)}</button></div></div></article>`).join('')}</div>
<div class="k-slider-nav"><button class="k-slider-nav__btn" data-dir="prev" disabled>${icon('chevron-left')}</button><button class="k-slider-nav__btn" data-dir="next">${icon('chevron-right')}</button></div></section>` },

  locator: { label: 'Store locator', when: 'Visitors need to find a physical store or check local stock', prior: 0.15, render: c => `
<section class="k-section k-bg-muted"><div class="k-container"><div class="k-panel" style="max-width:720px;margin-inline:auto;padding:var(--space-lg);gap:var(--space-md);background:var(--color-bg-surface);border-radius:var(--radius-xl)"><h2 class="text-heading-xl k-text">Find Kismet near you</h2><p class="k-c-secondary">Enter your ZIP code to see which ${esc(c.retailerLabel)} stores have Kismet in stock today.</p><label class="k-field is-filled"><span class="k-field__box"><span class="k-field__text"><span class="k-field__label">ZIP code</span><input class="k-field__input" placeholder=" " value="72712"></span>${icon('location')}</span></label><button class="k-btn k-btn--lg k-btn--block">Search stores</button>
${[['Supercenter · Bentonville', '2.1 mi · In stock'], ['Neighborhood Market · Rogers', '4.8 mi · In stock'], ['Supercenter · Springdale', '9.3 mi · Low stock']].map(r => `<a class="k-list-item" href="#">${icon('location')}<span class="k-list-item__text"><span class="k-list-item__title">${esc(c.retailerLabel)} ${r[0]}</span><span class="k-list-item__desc">${r[1]}</span></span>${icon('chevron-right')}</a>`).join('')}</div></div></section>` },

  offer: { label: 'Offer band', when: 'There is a discount, coupon, code or limited-time deal to highlight', prior: 0.3, render: c => `
<section class="k-section" style="background:var(--color-marquee-accent-bg)"><div class="k-container k-stack k-gap-lg" style="align-items:center;text-align:center"><span class="k-sticker k-sticker--brand">${esc(c.offerShort)}</span><h2 class="k-display text-display-md" style="color:var(--color-marquee-accent-text)">${esc(c.offerTitle)}</h2><p class="k-lead" style="max-width:48ch">Show this page at checkout or use the code below. One per customer, while supplies last.</p><span class="k-badge k-badge--solid">Code · KISMET${esc(c.offerCode)}</span></div></section>` },

  steps: { label: '3 steps', when: 'The page should explain how it works in a few simple steps', prior: 0.4, render: c => `
<section class="k-steps"><div class="k-steps__head"><p class="k-eyebrow">How it works</p><h2 class="k-display k-steps__title">${esc(c.stepsTitle)}</h2></div><div class="k-steps__list">${c.steps.map((s, i) => `<div class="k-steps__item"><img src="assets/img/${c.products[i % c.products.length][2]}" alt=""><h3 class="k-display">${esc(s[0])}</h3><p>${esc(s[1])}</p></div>`).join('')}</div>${wavy(c.cta)}</section>` },

  values: { label: 'Guarantees', when: 'Visitors may hesitate and need reassurance: guarantees, cancel anytime, risk-free', prior: 0.4, render: () => `
<section class="k-values">${[['100% Money-Back Guarantee', 'Your dog doesn’t love it? Full refund. No hoops.'], ['Cancel or skip anytime', 'Manage everything from your account in 2 taps.'], ['No-fridge, shelf-stable', 'Dry food that stays fresh in the pantry.']].map((v, i) => `<div class="k-values__card"><span class="k-values__num">${i + 1}</span><h3>${v[0]}</h3><p>${v[1]}</p></div>`).join('')}</section>` },

  faq: { label: 'FAQ', when: 'The page should answer common questions before people decide', prior: 0.3, render: c => `
<section class="k-section"><div class="k-container" style="max-width:820px"><h2 class="text-heading-xl k-text" style="margin-bottom:var(--space-lg)">Questions? We’ve got you</h2>${c.faq.map((q, i) => `<details class="k-accordion"${i ? '' : ' open'}><summary><span>${esc(q[0])}</span><span class="k-accordion__toggle"></span></summary><div class="k-accordion__body"><p>${esc(q[1])}</p></div></details>`).join('')}</div></section>` },

  signup: { label: 'Email signup', when: 'The page should capture email addresses, for an offer, a waitlist or updates', prior: 0.3, render: c => `
<section class="k-signup"><p class="k-eyebrow">${esc(c.eyebrow)}</p><h2 class="k-display k-signup__title">${esc(c.signupTitle)}</h2><p class="k-lead">We’ll email it to you.</p><form class="k-signup__form" onsubmit="return false"><label class="k-field"><span class="k-field__box"><span class="k-field__text"><span class="k-field__label">Enter your email</span><input class="k-field__input" type="email" placeholder=" "></span></span></label><button class="k-wavy" type="submit">Send it to me</button></form><p class="k-signup__legal">By signing up you agree to receive emails from Kismet. Unsubscribe anytime.</p></section>` },

  story: { label: 'Brand story', when: 'The page should share who Kismet is: founders, mission, community', prior: 0.25, render: c => `
<section class="k-split k-split--reverse" style="background:var(--color-bg-page)"><img class="k-media k-split__media" src="assets/img/people-family.jpg" alt=""><div class="k-split__content"><p class="k-eyebrow">Our story</p><h2 class="k-display k-split__title">Made by dog people, for dog people.</h2><p class="k-lead">Founded by longtime dog lovers who understand the reality of being a pet parent today — and what you both need to feel your best.</p><a href="#" class="k-btn k-btn--inverse k-btn--lg">Read our story ${icon('arrow-right')}</a></div></section>` },

  stats: { label: 'Proof numbers', when: 'The page should show clinical results, numbers or statistics as proof', prior: 0.3, render: () => `
<section class="k-section" style="background:var(--color-bg-highlight)"><div class="k-container k-grid" style="--k-cols-desktop:3;text-align:center">${[['96%', 'of dogs showed improved gut health'], ['45 days', 'to see the difference, or your money back'], ['#1', 'ingredient is always real protein']].map(x => `<div class="k-stack k-gap-sm" style="align-items:center"><span class="k-display text-display-xl k-text" style="color:var(--color-text-primary)">${x[0]}</span><p class="k-lead" style="max-width:24ch">${x[1]}</p></div>`).join('')}</div></section>` },

  reviews: { label: 'Reviews', when: 'The page should include customer reviews or testimonials', prior: 0.35, render: () => `
<section class="k-section" style="background:var(--color-accent-secondary)"><div class="k-container k-stack k-gap-xl"><div class="k-stack k-gap-md" style="align-items:center;text-align:center"><span class="k-rating k-rating--md k-rating--pill"><span class="k-rating__score">4.9</span><span class="k-rating__stars">${icon('star').repeat(5)}</span><span class="k-rating__count">(578 reviews)</span></span><h2 class="k-display text-display-md k-text">Dogs (and their humans) love Kismet.</h2></div><div class="k-grid" style="--k-cols-desktop:3">${[['Chopper C.', 'Fantastic food! Two weeks in and no more tummy troubles.'], ['Shiny P.', 'A topper like this is hard to find. Bowl licked clean, every time.'], ['Benji T.', 'My picky eater finally finishes dinner. The vets were right.']].map(r => `<div class="k-values__card"><span class="k-rating"><span class="k-rating__stars">${icon('star').repeat(5)}</span></span><p class="k-lead" style="color:var(--color-text-primary)">${r[1]}</p><p class="k-eyebrow">${r[0]}</p></div>`).join('')}</div></div></section>` },

  ingredients: { label: 'Ingredients strip', when: 'The page should highlight real ingredients and what the food is made of', prior: 0.25, render: () => `
<section class="k-section k-bg-surface"><div class="k-container k-stack k-gap-xl" style="align-items:center;text-align:center"><h2 class="k-display text-display-sm k-text">Antioxidant-rich superfoods, gut-loving pre- and probiotics.</h2><div class="k-grid" style="--k-cols:3;--k-cols-desktop:3;width:100%;max-width:900px">${[['apples', 'Source of vitamin C'], ['grain', 'Fiber and B vitamins'], ['carrots', 'Beta-carotene and vitamin A']].map(x => `<div class="k-stack k-gap-sm" style="align-items:center"><img src="assets/img/ingredient-${x[0]}.png" alt="" style="width:120px;height:120px;object-fit:contain"><p class="k-c-secondary" style="text-box:none;line-height:1.3">${x[1]}</p></div>`).join('')}</div></div></section>` },

  cta: { label: 'Closing CTA', when: 'The page should end with one last strong call to action', prior: 0.6, render: c => `
<section class="k-signup"><p class="k-eyebrow">${esc(c.eyebrow)}</p><h2 class="k-display k-signup__title">${esc(c.closing)}</h2>${wavy(c.cta)}</section>` },

  footer: { label: 'Footer', fixed: true, render: () => `
<footer class="k-footer"><div class="k-footer__wordmark"><span class="k-logo"></span></div><div class="k-footer__content"><a href="#" class="k-footer__signup">Sign Up</a><div class="k-footer__legal"><div class="k-footer__legal-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">*Offer T&amp;C</a></div><p class="k-footer__copy">© 2026 Kismet, Inc.</p></div><div class="k-footer__cols"><div class="k-footer__col"><h2 class="k-footer__heading">Explore</h2><div class="k-footer__links"><a href="#">Shop All</a><a href="#">About Us</a><a href="#">Ingredients</a><a href="#">Tails</a><a href="#">Quiz</a><a href="#">Find a Store</a></div></div><div class="k-footer__col"><h2 class="k-footer__heading">Support</h2><div class="k-footer__links"><a href="#">FAQs</a><a href="#">Account</a><a href="#">Shipping &amp; Returns</a><a href="#">Contact Us</a></div></div></div></div></footer>` },
};

/* Merge the section library: every non-hero block becomes available to the builder (and to Jev). Library versions replace the inline ones. */
for (const b of LIBRARY) if (!b.hero) SECTIONS[b.id] = { label: b.label, when: b.when, prior: b.prior, variants: b.variants, cat: b.cat, tones: b.tones, mq: b.mq, render: (c, v) => b.render(c, v) };

/* Page rhythm (see css/bands.css): every body section sits on a colour band. `tones` is the order of preference per section,
   `mq` the marquee that can name it. Strips keep their own look and are never wrapped. */
export const STRIPS = ['announce', 'header', 'hero', 'logos', 'marquee', 'countdown', 'number_strip', 'footer', 'sticky_cta'];
export const DEFAULT_TONES = ['cream', 'sage', 'pink', 'sun'];
const TONES = { products: ['sage', 'sun', 'coral', 'ink', 'cream'], split: ['cream', 'pink', 'sage'], steps: ['cream', 'sage', 'pink'], values: ['sage', 'cream'], signup: ['ink', 'coral', 'sun'], locator: ['sage', 'cream', 'pink'], offer: ['sun', 'coral'], plans: ['sage', 'cream'], spotlight: ['cream', 'pink', 'sage'], bundle: ['sun', 'pink', 'sage'], features: ['cream', 'sage'], benefits: ['sage', 'cream'], timeline: ['cream', 'pink'], founder: ['ink', 'coral'], statement: ['ink', 'coral', 'sun'], gallery: ['cream', 'aqua'], ugc: ['pink', 'cream', 'aqua'], categories: ['sage', 'cream'], guarantee: ['pink', 'sun', 'cream'], retailers: ['sage', 'cream'], press_quotes: ['cream', 'sage'], before_after: ['cream', 'pink'], rating_summary: ['sun', 'sage'], newsletter: ['sun', 'pink', 'ink'], banner: ['cream', 'sage'], team: ['pink', 'cream'], event_details: ['sun', 'sage'], zigzag: ['cream', 'sage'], icon_list: ['sage', 'pink'], media_cards: ['aqua', 'sage', 'cream'], process: ['cream', 'sage'], video: ['ink', 'cream'] };
const MQ = { products: c => c.marquee, steps: 'How it works', locator: 'Find a store', plans: 'Pick your plan', features: 'Why Kismet', benefits: 'Happy dogs', timeline: 'What to expect', gallery: 'Kismet dogs', ugc: 'Seen on the feed', categories: 'Shop all', bundle: 'Better together', team: 'The pack', offer: c => c.offer || 'The deal', media_cards: 'Good to know', spotlight: c => c.marquee, split: c => c.marquee, event_details: 'Save the date', before_after: 'The difference', guarantee: 'Risk free' };
for (const id of Object.keys(SECTIONS)) { SECTIONS[id].tones = SECTIONS[id].tones || TONES[id] || DEFAULT_TONES; SECTIONS[id].mq = SECTIONS[id].mq || MQ[id]; }

/* Page grammar: canonical order. Optional sections keep this order unless the user moves them. */
export const ORDER = ['announce', 'header', 'hero', 'countdown', 'usp', 'logos', 'marquee', 'stats', 'number_strip', 'press_quotes', 'statement', 'split', 'text_cols', 'features', 'icon_list', 'benefits', 'zigzag', 'event_details', 'spotlight', 'products', 'bundle', 'categories', 'plans', 'locator', 'retailers', 'offer', 'banner', 'ingredients', 'accordion_media', 'tabbed', 'specs', 'compare', 'before_after', 'progress', 'timeline', 'process', 'video', 'figure', 'image_duo', 'story', 'founder', 'team', 'prose', 'callout', 'media_cards', 'gallery', 'ugc', 'rating_summary', 'reviews', 'testimonial', 'stories', 'steps', 'values', 'guarantee', 'faq', 'contact', 'newsletter', 'signup', 'cta', 'footer', 'sticky_cta'];
export const OPTIONAL = ORDER.filter(id => !SECTIONS[id].fixed);
export { PHOTOS, PRODUCTS };
