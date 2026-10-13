/* Kismet — Ingredients page: ingredient card → sideblade with the ingredient detail and the products made with it.
   Desktop: panel on the left (565px) over a scrim. Mobile: full screen. Esc / scrim / back arrow close it; focus is trapped and restored. */
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  var P = { /* the products of the catalogue (sample data). sub = subscription card, otherwise the simple card */
    chicken:  { n: 'Chicken & Barley Recipe', p: '$31.49', u: '$3.50 / lb', one: '$44.99', r: '4.8', tag: 'Best Seller', i: 'lp-chicken.jpg', sub: 1 },
    salmon:   { n: 'Salmon & Brown Rice Recipe', p: '$34.99', u: '$3.89 / lb', one: '$49.99', r: '4.8', i: 'lp-salmon.jpg', sub: 1 },
    multi:    { n: 'Multivitamin Topper', p: '$17.99', i: 'lp-multivitamin.jpg' },
    hip:      { n: 'Hip & Joint Topper', p: '$17.99', i: 'lp-hip-joint.jpg' },
    nugs:     { n: 'Sweet Potato Nugs', p: '$28.99', i: 'product-nugs.jpg' },
    sticks:   { n: 'Premium Salmon Sticks', p: '$16.99', i: 'product-salmon-sticks.jpg' }
  };
  var BOTH = ['chicken', 'salmon'];
  var MAP = { /* ingredient → products that contain it (proposal: must come from product tags) */
    'Real Chicken': ['chicken', 'multi', 'hip', 'nugs'],
    'Real Salmon': ['salmon', 'sticks'],
    'Barley': ['chicken'], 'Brown Rice': ['salmon'], 'Sweet Potato': ['nugs']
  };

  var blade, panel, lastFocus, cart = 2;
  var NOTE = { 'Pre & Probiotics': ['What Do Probiotics Do for Dogs?', 'https://kismetpets.com/blogs/answers/what-do-probiotics-do-for-dogs'] };
  var CHECK = '<span class="k-icon k-icon--check" aria-hidden="true"></span>';
  function build() {
    blade = document.createElement('div'); blade.className = 'k-blade'; blade.hidden = true;
    blade.innerHTML = '<div class="k-blade__scrim" data-close></div>' +
      '<div class="k-blade__panel" role="dialog" aria-modal="true" aria-labelledby="blade-t">' +
      '<div class="k-blade__head"><button class="k-blade__back" type="button" aria-label="Back to ingredients" data-close><span class="k-icon k-icon--arrow-left"></span></button><h2 class="k-blade__navtitle" id="blade-t"></h2></div>' +
      '<div class="k-blade__body">' +
      '<div class="k-blade__hero" data-r style="--i:0"><img alt=""></div>' +
      '' +
      '<ul class="k-blade__benefits" data-r style="--i:1"></ul>' +
      '<div class="k-blade__note" data-r style="--i:3"><b>Every ingredient is checked before it reaches a recipe.</b><span>Our manufacturing partner monitors what arrives, against specification, every delivery.</span><a href="#made" data-close data-goto="made">How it’s made <span class="k-icon k-icon--arrow-right" aria-hidden="true"></span></a></div>' +
      '<section class="k-blade__sec" data-r style="--i:4" aria-labelledby="blade-s"><div><h3 class="k-blade__sub" id="blade-s"></h3><p class="k-blade__lead"></p></div><ul class="k-blade__track" tabindex="0" aria-label="Products"></ul><div class="k-slider-nav"><button class="k-slider-nav__btn" data-dir="prev" aria-label="Previous" type="button"><span class="k-icon k-icon--chevron-left"></span></button><button class="k-slider-nav__btn" data-dir="next" aria-label="Next" type="button"><span class="k-icon k-icon--chevron-right"></span></button></div></section>' +
      '</div></div>';
    document.body.appendChild(blade); panel = $('.k-blade__panel', blade);
    var tr = $('.k-blade__track', blade); tr.addEventListener('scroll', sync, { passive: true });
  }
  function sync() { var t = $('.k-blade__track', blade), p = $('[data-dir="prev"]', blade), n = $('[data-dir="next"]', blade); p.disabled = t.scrollLeft < 8; n.disabled = t.scrollLeft + t.clientWidth > t.scrollWidth - 8; $('.k-slider-nav', blade).hidden = t.scrollWidth <= t.clientWidth + 8; }
  function productCard(p) {
    var media = '<div class="k-card__media"><img src="../assets/img/' + p.i + '" alt="" loading="lazy">' + (p.r ? '<span class="k-card__rating">' + p.r + ' <span class="k-icon k-icon--star"></span></span>' : '') + (p.tag ? '<span class="k-card__tag">' + p.tag + '</span>' : '') +
      '<div class="k-card__info"><div class="k-card__price"><span class="k-card__amount">' + p.p + '</span>' + (p.u ? '<span class="k-card__unit">' + p.u.replace(' / ', '/') + '</span>' : '') + '</div><h3 class="k-card__name">' + p.n + '</h3></div></div>';
    if (!p.sub) return '<li><article class="k-card k-card--simple k-card--mobile">' + media + '<div class="k-card__body"><div class="k-card__actions"><button class="k-card__cta" type="button" aria-label="Add ' + p.n + ' to cart">Add to cart</button></div></div></article></li>';
    return '<li><article class="k-card k-card--mobile">' + media + '<div class="k-card__body">' +
      '<div class="k-card__options"><div><div class="k-card__sizes" data-k-choice><button class="k-card__size" type="button">4lb Bag</button><button class="k-card__size" type="button" aria-pressed="true">9lb Bag</button><button class="k-card__size" type="button">19lb Bag</button></div><button class="k-card__delivery" type="button"><b>Delivery</b> every 3 weeks <span class="k-icon k-icon--chevron-down"></span></button></div></div>' +
      '<div class="k-card__actions"><button class="k-card__cta" type="button">Subscribe &amp; Save 30% — ' + p.p + '</button><button class="k-card__alt" type="button">One-time purchase — ' + p.one + '</button></div>' +
      '<ul class="k-card__perks"><li>Save 10% on all future subscription orders</li><li>Free gift with your second order</li><li>Skip or cancel anytime</li><li>100% money-back guarantee</li></ul></div></article></li>';
  }
  function open(card) {
    if (!blade) build();
    var name = $('.k-icard__name', card).textContent.trim(), img = $('.k-icard__ph img', card);
    var keys = MAP[name] || BOTH, list = keys.map(function (k) { return P[k]; });
    $('.k-blade__navtitle', blade).textContent = name;
    var im = $('.k-blade__hero img', blade); im.src = img.src; im.alt = img.alt;
    $('.k-blade__hero', blade).style.setProperty('--tint', getComputedStyle(card).getPropertyValue('--tint') || '');
    $('.k-blade__benefits', blade).innerHTML = $$('.k-icard__list li', card).map(function (li) { return '<li>' + CHECK + li.textContent + '</li>'; }).join('');
    var nt = NOTE[name], a = $('.k-blade__note a', blade); if (nt) { a.href = nt[1]; a.removeAttribute('data-close'); a.removeAttribute('data-goto'); a.target = '_blank'; a.rel = 'noopener'; a.childNodes[0].nodeValue = nt[0] + ' '; } else { a.href = '#made'; a.setAttribute('data-close', ''); a.setAttribute('data-goto', 'made'); a.removeAttribute('target'); a.childNodes[0].nodeValue = 'How it’s made '; }
    $('.k-blade__sub', blade).textContent = 'Made with ' + name;
    $('.k-blade__lead', blade).textContent = list.length + (list.length === 1 ? ' Kismet product contains' : ' Kismet products contain') + ' this ingredient.';
    var tr = $('.k-blade__track', blade); tr.innerHTML = list.map(productCard).join(''); tr.scrollLeft = 0;
    lastFocus = card; blade.classList.remove('is-open', 'is-closing'); blade.hidden = false; document.body.classList.add('has-blade'); $('.k-blade__body', blade).scrollTop = 0;
    void blade.offsetWidth; setTimeout(function () { blade.classList.add('is-open'); sync(); }, 30);
    setTimeout(function () { $('.k-blade__back', blade).focus({ preventScroll: true }); }, 60);
  }
  function close() {
    if (!blade || blade.hidden || blade.classList.contains('is-closing')) return;
    blade.classList.add('is-closing'); blade.classList.remove('is-open');
    setTimeout(function () { blade.hidden = true; blade.classList.remove('is-closing'); document.body.classList.remove('has-blade'); if (lastFocus) lastFocus.focus({ preventScroll: true }); }, 340);
  }

  $$('.k-icard').forEach(function (c) {
    c.setAttribute('role', 'button'); c.setAttribute('tabindex', '0'); c.setAttribute('aria-haspopup', 'dialog');
    c.setAttribute('aria-label', $('.k-icard__name', c).textContent.trim() + ': see details and products');
    var go = document.createElement('span'); go.className = 'k-icon k-icon--arrow-up-right k-icard__go'; go.setAttribute('aria-hidden', 'true'); c.appendChild(go);
  });
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-close]'))) { if (t.getAttribute('data-goto')) { var g = document.getElementById(t.getAttribute('data-goto')); e.preventDefault(); close(); setTimeout(function () { if (g) g.scrollIntoView({ behavior: 'smooth' }); }, 360); return; } close(); return; }
    if ((t = e.target.closest('.k-icard'))) { e.preventDefault(); open(t); return; }
    if ((t = e.target.closest('.k-card__cta, .k-card__alt'))) {
      if (t.dataset.busy) return; t.dataset.busy = '1'; var l = t.textContent; t.textContent = 'Added'; cart++; $$('.k-header__count').forEach(function (c) { c.textContent = cart; });
      setTimeout(function () { t.textContent = l; delete t.dataset.busy; }, 1600);
    }
  });
  document.addEventListener('keydown', function (e) {
    var c = e.target.closest && e.target.closest('.k-icard');
    if (c && (e.key === 'Enter' || e.key === ' ') && (!blade || blade.hidden)) { e.preventDefault(); open(c); return; }
    if (!blade || blade.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') { var f = $$('button, a[href], [tabindex="0"]', panel).filter(function (n) { return n.offsetParent !== null && !n.disabled; }); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });
  window.addEventListener('message', function (e) { var d = e.data; if (d && d.type === 'kismet-proto' && d.theme && window.Kismet) window.Kismet.setTheme(d.theme); });
  if (window.parent !== window) window.parent.postMessage({ type: 'kismet-proto-ready' }, '*');
  if (location.hash.indexOf('open=') > -1) { var n = decodeURIComponent(location.hash.split('open=')[1]); var t = $$('.k-icard').filter(function (c) { return $('.k-icard__name', c).textContent.trim() === n; })[0]; if (t) setTimeout(function () { open(t); }, 300); }

  /* ---------- Find by product: pick a product, its ingredients light up (proposal data; production = product tags) ---------- */
  var PI = { /* product → ingredients inside it */
    chicken: ['Real Chicken', 'Barley', 'Beet Pulp', 'Carrots', 'Kale', 'Apples', 'Cranberries', 'Pre & Probiotics', 'Rosemary Extract'],
    salmon:  ['Real Salmon', 'Brown Rice', 'Beet Pulp', 'Carrots', 'Kale', 'Apples', 'Cranberries', 'Pre & Probiotics', 'Rosemary Extract'],
    multi:   ['Real Chicken', 'Carrots', 'Kale', 'Cranberries', 'Pre & Probiotics'],
    hip:     ['Real Chicken', 'Apples', 'Rosemary Extract'],
    nugs:    ['Real Chicken', 'Sweet Potato', 'Carrots'],
    sticks:  ['Real Salmon', 'Rosemary Extract']
  };
  function finder() {
    var box = $('#finder'); if (!box) return;
    var grid = box.parentNode, list = $('.k-ifind__list', box), input = $('.k-field__input', box), empty = $('.k-ifind__empty', box), res = $('.k-ifind__result', box), count = $('.k-ifind__count', box), cur = null, orig = null;
    function nm(c) { return $('.k-icard__name', c).textContent.trim(); }
    list.innerHTML = Object.keys(P).map(function (k) { return '<li data-k="' + k + '"><button class="k-ifind__p" type="button" aria-pressed="false" data-k="' + k + '"><img src="../assets/img/' + P[k].i + '" alt="">' + P[k].n.replace(/ Recipe$/, '') + '</button></li>'; }).join('');
    function show(k) {
      cur = k; grid.classList.toggle('is-filtered', !!k);
      $$('.k-ifind__p', box).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-k') === k)); });
      var n = 0, cards = $$('.k-icard', grid), first = cards.map(function (c) { return c.getBoundingClientRect(); });
      if (!orig) orig = cards.slice();
      cards.forEach(function (c) { var on = !!k && PI[k].indexOf(nm(c)) > -1; c.classList.toggle('is-in', on); if (on) n++; });
      /* the product's ingredients come first (in the product's own order), the others follow in the page order */
      var lit = k ? PI[k].map(function (name) { return orig.filter(function (c) { return nm(c) === name; })[0]; }).filter(Boolean) : [];
      lit.concat(orig.filter(function (c) { return lit.indexOf(c) < 0; })).forEach(function (c) { grid.appendChild(c); });
      /* FLIP: glide every card from where it was to where it is now */
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && cards[0].animate) {
        var moved = 0;
        cards.forEach(function (c, i) {
          var a = first[i], b = c.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top; if (!dx && !dy) return;
          var rank = $$('.k-icard', grid).indexOf(c);
          c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 720, delay: Math.min(rank, 11) * 28, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
          moved++;
        });
      }
      res.hidden = !k; if (k) count.textContent = P[k].n + ' is made with ' + n + ' of these ingredients.';
    }
    list.addEventListener('click', function (e) { var b = e.target.closest('.k-ifind__p'); if (!b) return; var k = b.getAttribute('data-k'); show(cur === k ? null : k); });
    $('.k-ifind__clear', box).addEventListener('click', function () { show(null); input.value = ''; input.dispatchEvent(new Event('input')); input.focus(); });
    input.addEventListener('input', function () {
      var v = input.value.trim().toLowerCase(), any = 0;
      $$('li', list).forEach(function (li) { var ok = !v || P[li.getAttribute('data-k')].n.toLowerCase().indexOf(v) > -1; li.hidden = !ok; if (ok) any++; });
      empty.hidden = !!any;
    });
  }
  finder();
})();
