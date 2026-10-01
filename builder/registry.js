/* Kismet Landing Builder — component registry.
   This file is the "logic" Jev works with. Jev never writes text or HTML: it only answers typed questions
   (choice / score / noul). Everything it can pick from is declared here:
     · CAMPAIGNS  — the kinds of landing we know how to build, with a copy bank (pre-written, on-brand lines with {slots})
     · SECTIONS   — the blocks of the design system, when each one is useful, and how to render it with kit classes
     · ENTITIES   — closed lists Jev chooses from to fill the {slots} (retailer, product, goal…)
   Add a campaign, a headline or a section here and the builder (and Jev) can use it immediately. */

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

/* Copy bank. Lines are written once by a human, on brand; Jev only picks. Slots: {retailer} {product} {offer} {name} */
export const CAMPAIGNS = {
  retail: {
    describe: 'Kismet is now sold at a retailer or in physical stores; help people find it there',
    eyebrow: ['Now in stores', 'New at {retailer}', 'In the pet aisle'],
    headline: ['Kismet is now\nat {retailer}', 'Find us at\n{retailer}', 'Fresh from the\npet aisle', 'Now on the shelf\nat {retailer}'],
    sub: ['Gut-healthy, fresh-baked dog food — now on the shelf in the pet aisle. Same recipes, same vets, no subscription needed.', 'Your dog’s favorite {product} is now a quick trip away. Look for the coral bag at {retailer}.'],
    cta: ['Find a store', 'Find {retailer} near you', 'Shop at {retailer}'],
    marquee: ['Now at {retailer}', 'In stores now', 'Find us in the pet aisle'],
    theme: 'electric',
  },
  launch: {
    describe: 'A new product is launching or being introduced',
    eyebrow: ['New', 'Just dropped', 'New · {product}'],
    headline: ['Meet {name}', 'Pour on\nthe good stuff', 'Something new\nfor the bowl', 'The newest way\nto fuel the dog'],
    sub: ['A new way to add flavor and gut support to every bowl. Made with real ingredients, pre + probiotics and nothing weird.', 'New from Kismet: {name}. Pairs perfectly with the rest of the bowl.'],
    cta: ['Shop the launch', 'Try {name}', 'Add to my bowl'],
    marquee: ['New {product}', 'Just launched', '{offer} launch week'],
    theme: 'submarine',
  },
  promo: {
    describe: 'A discount, sale, coupon or limited-time offer',
    eyebrow: ['Limited time', 'This week only', 'Special offer'],
    headline: ['{offer}\nyour first order', 'Bowl goals,\n{offer}', 'Save big on\nbetter food', 'Treat them.\n{offer}.'],
    sub: ['Clinically proven food with pre + probiotics. For a limited time, get {offer} when you subscribe.', 'Stock the pantry: {offer} on {product}, while supplies last.'],
    cta: ['Get {offer}', 'Claim the offer', 'Shop the sale'],
    marquee: ['{offer}', 'Limited time only', 'Subscribe & save'],
    theme: 'submarine',
  },
  event: {
    describe: 'An event, parade, pop-up, meetup or sponsorship with a date and place',
    eyebrow: ['Save the date', 'Presented by Kismet', 'Join us'],
    headline: ['{name}', 'See you\nat the parade', 'Dogs, people,\none big party', 'Come hang\nwith Kismet'],
    sub: ['Presented by Kismet. A celebration for dogs and their people — come for the costumes, stay for the snacks.', 'Join us for {name}. Free to attend, treats on us.'],
    cta: ['Register now', 'Save my spot', 'Get the details'],
    marquee: ['{name}', 'Presented by Kismet', 'Dogs welcome'],
    theme: 'skittles',
  },
  subscription: {
    describe: 'Getting new customers to subscribe to dog food; the quiz, personalized plans',
    eyebrow: ['Personalized plans', 'Subscribe & save', 'Made for your dog'],
    headline: ['Fix the gut\nfuel the dog', 'Better bowls,\ndelivered', 'From quiz\nto bowl', 'A plan as unique\nas your dog'],
    sub: ['Clinically proven food with pre + probiotics. 96% of dogs see improved gut health in 45 days.', 'Tell us about your dog and we’ll build the right plan. Skip or cancel anytime.'],
    cta: ['Take the quiz', 'Build my plan', 'Get 30% off today'],
    marquee: ['Clinically proven food', 'Bowl goals', 'Subscribe & save 30%'],
    theme: 'electric',
  },
  story: {
    describe: 'Brand story, mission, ingredients, science, about us, partnerships',
    eyebrow: ['Our story', 'Why Kismet', 'The science'],
    headline: ['Made by\ndog people', 'Real food,\nreal results', 'The good stuff,\nexplained', 'Better for dogs.\nProven.'],
    sub: ['Founded by longtime dog lovers, formulated with vets, and proven in clinical trials.', 'Real ingredients, gently baked, with pre + probiotics in every bowl.'],
    cta: ['Meet the food', 'See the science', 'Shop Kismet'],
    marquee: ['About us', 'Our stories', 'Clinically proven'],
    theme: 'salad',
  },
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
export const SECTIONS = {
  header: { label: 'Header', fixed: true, render: () => `
<header class="k-header"><div class="k-header__promo"><span>Free shipping on $50+</span>${icon('burst')}<span>Subscribe &amp; Save 30% on your first order + Free Gift with order two</span>${icon('burst')}<span>Try Kismet Risk-free. 100% Money-back Guarantee</span></div>
<div class="k-header__bar"><div class="k-header__side"><button class="k-header__action k-header__menu" aria-label="Menu">${icon('menu')}</button><nav class="k-header__links"><a href="#">Shop ${icon('chevron-down')}</a><a href="#">About</a><a href="#">Ingredients</a><a href="#">Tails ${icon('chevron-down')}</a><a href="#">Find a Store</a></nav></div><a href="#" class="k-logo k-header__logo" aria-label="Kismet"></a><div class="k-header__side k-header__side--end"><a href="#" class="k-header__action">${icon('dog')}</a><a href="#" class="k-header__action">${icon('cart')}<span class="k-header__count">2</span></a></div></div></header>` },

  hero: { label: 'Hero', fixed: true, variants: { fold: 'Full photo with text on top: emotional, lifestyle, big brand moment', split: 'Text panel next to a photo: lots of information such as dates, places, details or two buttons' },
    variantQuestion: 'Which hero layout fits this landing page better?',
    render: (c, v) => v === 'split' ? `
<section class="k-split-hero"><img class="k-media k-split-hero__photo" src="${c.photo}" alt=""><div class="k-split-hero__panel"><p class="k-eyebrow">${esc(c.eyebrow)}</p><h1 class="k-display k-split-hero__title">${br(c.headline)}</h1><p class="k-lead">${esc(c.sub)}</p><div class="k-split-hero__actions">${wavy(c.cta)}${wavy('Shop Kismet', 'k-wavy--secondary')}</div></div></section>` : `
<section class="k-fold" style="background-image:url('${c.photo}')"><div class="k-fold__content"><div class="k-fold__text"><h1 class="k-fold__title">${br(c.headline)}</h1><p class="k-fold__desc">${esc(c.sub)}</p></div><div class="k-fold__actions">${wavy(c.cta)}</div></div></section>` },

  logos: { label: 'Press logos', when: 'The page benefits from showing press logos and credibility right under the hero', prior: 0.6, render: () => `
<div class="k-logos"><div class="k-logos__track">${['today', 'drew', 'tonight-show', 'parade', 'fast-company', 'people'].map(n => `<img src="assets/img/press-${n}.svg" alt="">`).join('')}</div></div>` },

  marquee: { label: 'Marquee', when: 'A bold scrolling text band would reinforce the campaign message', prior: 0.75, variants: { accent: 'Colored band, loud', ink: 'Dark text on the page, calm', soft: 'Soft pink band, friendly', brand: 'Turquoise band, fresh' },
    variantQuestion: 'Which marquee style fits the tone of this campaign?',
    render: (c, v) => `
<div class="k-marquee k-marquee--${v || 'accent'}" aria-hidden="true"><div class="k-marquee__track">${icon('burst')}<span class="k-marquee__item">${esc(c.marquee)}</span></div></div>` },

  split: { label: '50/50 content', when: 'The page should explain what the product or offer is, with a photo, short copy and bullet points', prior: 0.6, variants: { left: 'Photo on the left', right: 'Photo on the right' },
    render: (c, v) => `
<section class="k-split ${v === 'right' ? 'k-split--reverse' : ''}"><img class="k-media k-split__media" src="assets/img/${c.products[0][2]}" alt=""><div class="k-split__content"><p class="k-eyebrow">${esc(c.eyebrow)}</p><h2 class="k-display k-split__title">${esc(c.splitTitle)}</h2><p class="k-lead">Vet-approved, superfood-powered and clinically proven to improve digestion and support whole-body health.</p><ul class="k-bullets"><li>${icon('check')}Real protein is the #1 ingredient</li><li>${icon('check')}Pre + probiotics for gut health</li><li>${icon('check')}No fillers, no fridge needed</li></ul>${wavy(c.cta)}</div></section>` },

  products: { label: 'Product row', when: 'The page should show specific products people can buy or look for', prior: 0.7, render: c => `
<section class="k-section k-product-row"><div class="k-product-row__head"><div class="k-product-row__titles"><h2 class="k-product-row__title">${esc(c.productsTitle)}</h2><p class="k-product-row__desc">Same recipes, same vets, same gut-health promise.</p></div><a href="#" class="k-btn k-btn--neutral">See all products ${icon('arrow-right')}</a></div>
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

  footer: { label: 'Footer', fixed: true, render: () => `
<footer class="k-footer"><div class="k-footer__wordmark"><span class="k-logo"></span></div><div class="k-footer__content"><a href="#" class="k-footer__signup">Sign Up</a><div class="k-footer__legal"><div class="k-footer__legal-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">*Offer T&amp;C</a></div><p class="k-footer__copy">© 2026 Kismet, Inc.</p></div><div class="k-footer__cols"><div class="k-footer__col"><h2 class="k-footer__heading">Explore</h2><div class="k-footer__links"><a href="#">Shop All</a><a href="#">About Us</a><a href="#">Ingredients</a><a href="#">Tails</a><a href="#">Quiz</a><a href="#">Find a Store</a></div></div><div class="k-footer__col"><h2 class="k-footer__heading">Support</h2><div class="k-footer__links"><a href="#">FAQs</a><a href="#">Account</a><a href="#">Shipping &amp; Returns</a><a href="#">Contact Us</a></div></div></div></div></footer>` },
};

/* Page grammar: canonical order. Optional sections keep this order unless the user moves them. */
export const ORDER = ['header', 'hero', 'logos', 'marquee', 'split', 'products', 'locator', 'offer', 'steps', 'values', 'faq', 'signup', 'footer'];
export const OPTIONAL = ORDER.filter(id => !SECTIONS[id].fixed);
export { PHOTOS, PRODUCTS };
