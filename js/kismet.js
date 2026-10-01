/* Kismet design system — behaviors for prototypes. No dependencies. Load with <script src=".../js/kismet.js" defer></script>.
   Everything is progressive: components render without it; the script adds the organic button shape, looping marquees
   and the small interactions (theme switch, slider navigation, stepper, single-choice groups, toggles). */
(function () {
  'use strict';
  var WAVY_FILL = 'M33.6 4C39.9 4 45.7 6.2 50.5 10.0C56.3 14.7 65.1 14.7 70.9 10.0C75.7 6.2 81.6 4 87.8 4C94.1 4 99.9 6.2 104.7 10.0C110.6 14.7 119.3 14.7 125.2 10.0C130.0 6.2 135.8 4 142.1 4C148.3 4 154.2 6.2 159.0 10.0C164.8 14.7 173.6 14.7 179.4 10.0C184.2 6.2 190.0 4 196.3 4C212.7 4 226 19.2 226 38C226 56.7 212.7 72 196.3 72C190.0 72 184.2 69.7 179.4 65.9C173.6 61.2 164.8 61.2 159.0 65.9C154.2 69.7 148.3 72 142.1 72C135.8 72 130.0 69.7 125.2 65.9C119.3 61.2 110.6 61.2 104.7 65.9C99.9 69.7 94.1 72 87.8 72C81.6 72 75.7 69.7 70.9 65.9C65.1 61.2 56.3 61.2 50.5 65.9C45.7 69.7 39.9 72 33.6 72C17.2 72 4 56.7 4 38C4 19.2 17.2 4 33.6 4Z';
  var NS = 'http://www.w3.org/2000/svg';
  var THEMES = ['electric', 'submarine', 'salad', 'skittles', 'lego'];

  function each(sel, fn, root) { Array.prototype.forEach.call((root || document).querySelectorAll(sel), fn); }

  /* Organic button: draws shadow + body with the same path so the scallops always line up. */
  function wavy(root) {
    each('.k-wavy', function (el) {
      if (el.querySelector('.k-wavy__shape')) return;
      if (!el.querySelector('.k-wavy__label')) { var s = document.createElement('span'); s.className = 'k-wavy__label'; while (el.firstChild) s.appendChild(el.firstChild); el.appendChild(s); }
      var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'k-wavy__shape'); svg.setAttribute('viewBox', '0 0 230 90'); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true');
      function path(cls, parent, dy) { var p = document.createElementNS(NS, 'path'); p.setAttribute('d', WAVY_FILL); p.setAttribute('class', cls); if (dy) p.setAttribute('transform', 'translate(0 ' + dy + ')'); p.setAttribute('vector-effect', 'non-scaling-stroke'); parent.appendChild(p); return p; }
      path('k-wavy__shadow', svg, 14);
      var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'k-wavy__body'); svg.appendChild(g);
      path('k-wavy__fill', g); path('k-wavy__stroke', g);
      el.insertBefore(svg, el.firstChild);
    }, root);
  }

  /* Marquees: duplicate the track so the loop is seamless. */
  function marquees(root) {
    each('.k-marquee, .k-logos', function (el) {
      if (el.dataset.kReady) return; el.dataset.kReady = '1';
      var track = el.firstElementChild; if (!track) return;
      var copies = el.classList.contains('k-logos') ? 2 : Math.max(2, Math.ceil((Math.max(el.offsetWidth, 1512) * 2) / Math.max(track.offsetWidth, 1)));
      if (!el.classList.contains('k-logos')) el.style.setProperty('--marquee-speed', Math.max(10, Math.round(track.offsetWidth / 40)) + 's');
      for (var i = 1; i < copies + 1; i++) { var c = track.cloneNode(true); c.setAttribute('aria-hidden', 'true'); el.appendChild(c); }
    }, root);
  }

  /* Theme: <html data-theme="submarine">. Any [data-k-theme="lego"] control switches it; <select data-k-theme-select> too. */
  function setTheme(name) {
    if (THEMES.indexOf(name) < 0) name = 'electric';
    document.documentElement.setAttribute('data-theme', name);
    try { localStorage.setItem('kismet-theme', name); } catch (e) {}
    each('[data-k-theme]', function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-k-theme') === name)); });
    each('[data-k-theme-select]', function (s) { s.value = name; });
  }
  function themes() {
    var saved = null; try { saved = localStorage.getItem('kismet-theme'); } catch (e) {}
    setTheme(document.documentElement.getAttribute('data-theme') || saved || 'electric');
    document.addEventListener('click', function (e) { var b = e.target.closest('[data-k-theme]'); if (b) setTheme(b.getAttribute('data-k-theme')); });
    document.addEventListener('change', function (e) { if (e.target.matches('[data-k-theme-select]')) setTheme(e.target.value); });
  }

  function interactions() {
    document.addEventListener('click', function (e) {
      var t;
      /* single-choice groups: chips, segmented control, card sizes → aria-pressed; tabs → aria-selected */
      if ((t = e.target.closest('[data-k-choice] > *'))) { each(':scope > *', function (x) { x.setAttribute('aria-pressed', String(x === t)); }, t.parentElement); }
      if ((t = e.target.closest('.k-tabs > .k-tab'))) { each(':scope > .k-tab', function (x) { x.setAttribute('aria-selected', String(x === t)); }, t.parentElement); if (t.parentElement.hasAttribute('data-k-panels')) { var tabs = [].slice.call(t.parentElement.children), ps = t.parentElement.parentElement.querySelectorAll(':scope > [data-k-panel]'); [].forEach.call(ps, function (x, i) { x.hidden = i !== tabs.indexOf(t); }); } }
      if ((t = e.target.closest('.k-menu > .k-option'))) { each(':scope > .k-option', function (x) { x.setAttribute('aria-selected', String(x === t)); }, t.parentElement); }
      /* quantity stepper: trash at 1 */
      if ((t = e.target.closest('.k-stepper__btn'))) {
        var st = t.closest('.k-stepper'), out = st.querySelector('.k-stepper__value'), n = parseInt(out.textContent, 10) || 1, max = parseInt(st.dataset.max || '99', 10);
        n = Math.min(max, Math.max(1, n + (t.dataset.step === '-1' ? -1 : 1))); out.textContent = n;
        var dec = st.querySelector('[data-step="-1"] .k-icon'); if (dec) { dec.classList.toggle('k-icon--trash', n === 1); dec.classList.toggle('k-icon--minus', n !== 1); }
        var inc = st.querySelector('[data-step="1"]'); if (inc) inc.disabled = n >= max;
      }
      /* slider navigation (mobile product rows) */
      if ((t = e.target.closest('.k-slider-nav__btn'))) {
        var list = t.closest('.k-slider-nav').previousElementSibling; if (list) { var card = list.firstElementChild; var step = card ? card.offsetWidth + 12 : list.clientWidth; list.scrollBy({ left: t.dataset.dir === 'prev' ? -step : step, behavior: 'smooth' }); }
      }
      /* toggles */
      if ((t = e.target.closest('.k-buybar__toggle'))) { var bar = t.closest('.k-buybar'); var open = bar.classList.toggle('is-open'); var lbl = t.querySelector('span:not(.k-icon)'); if (lbl) lbl.textContent = open ? 'Close' : 'Options'; }
      if ((t = e.target.closest('.k-alert__close'))) { t.closest('.k-alert').remove(); }
    });
    /* keep the slider buttons in sync with the scroll position */
    each('.k-slider-nav', function (nav) {
      var list = nav.previousElementSibling; if (!list) return;
      var prev = nav.querySelector('[data-dir="prev"]'), next = nav.querySelector('[data-dir="next"]');
      function sync() { if (prev) prev.disabled = list.scrollLeft < 8; if (next) next.disabled = list.scrollLeft + list.clientWidth > list.scrollWidth - 8; }
      list.addEventListener('scroll', sync, { passive: true }); window.addEventListener('resize', sync); sync();
    });
  }

  function init() { wavy(); marquees(); themes(); interactions(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.Kismet = { init: function (root) { wavy(root); marquees(root); }, setTheme: setTheme, themes: THEMES };
})();
