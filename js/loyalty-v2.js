/* Kismet — Loyalty points prototype v2 behaviors. No dependencies. Load after js/kismet.js.
   State machine (logged out ↔ logged in), profile dropdown, add to cart, copy link, product marquee, prototype switch.
   Embedded in loyalty-prototype.html? Tell the parent which state we are in; listen for {type:'kismet-proto', state}. */
(function () {
  'use strict';
  var body = document.body, root = document.documentElement;
  var q = new URLSearchParams(location.search);
  if (q.has('embed') || /embed/.test(location.hash)) root.classList.add('is-embed');
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- toast ---------- */
  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'k-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600);
  }

  /* ---------- marquees (the kit script skips the ones marked data-k-ready; we fill them once they are visible) ---------- */
  function fillMarquees() {
    $$('.k-marquee[data-k-ready]').forEach(function (el) {
      if (el.dataset.lFilled || !el.offsetWidth) return;
      var track = el.firstElementChild; if (!track || !track.offsetWidth) return;
      el.dataset.lFilled = '1';
      var copies = Math.max(2, Math.ceil((Math.max(el.offsetWidth, 1512) * 2) / track.offsetWidth));
      el.style.setProperty('--marquee-speed', Math.max(10, Math.round(track.offsetWidth / 40)) + 's');
      for (var i = 1; i < copies + 1; i++) { var c = track.cloneNode(true); c.setAttribute('aria-hidden', 'true'); el.appendChild(c); }
    });
    $$('.k-pmarq').forEach(function (el) {
      if (el.dataset.lFilled || !el.offsetWidth) return;
      var track = el.firstElementChild; if (!track || !track.offsetWidth) return;
      el.dataset.lFilled = '1';
      el.style.setProperty('--pmarq-speed', Math.max(30, Math.round(track.offsetWidth / 45)) + 's');
      var copies = Math.max(1, Math.ceil((el.offsetWidth * 2) / track.offsetWidth));
      for (var i = 0; i < copies; i++) { var c = track.cloneNode(true); c.setAttribute('aria-hidden', 'true'); $$('a,button', c).forEach(function (n) { n.tabIndex = -1; }); el.appendChild(c); }
    });
  }

  /* ---------- state ---------- */
  function setState(s, opts) {
    opts = opts || {};
    s = (s === 'in' || s === 'join') ? s : 'out';
    body.setAttribute('data-state', s);
    $$('[data-set-state]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set-state') === s)); });
    closeMenu(false);
    var pm = $('#pmenu'); if (pm) $$('[data-only]', pm).forEach(function (n) { n.hidden = (' ' + n.getAttribute('data-only') + ' ').indexOf(' ' + s + ' ') < 0; });
    var f = document.getElementById('footer-top'); if (f) f.style.setProperty('--footer-top', s === 'out' ? 'var(--color-bg-brand-secondary)' : 'var(--color-bg-surface-warm)');
    document.title = (s === 'out' ? 'Loyalty Points' : 'My Loyalty Points') + ' — Kismet';
    if (s === 'join') resetJoin(); closeModal(false);
    if (!opts.keepScroll) window.scrollTo(0, 0);
    fillMarquees();
    if (s !== 'out') { var sel = $('.k-ptab[aria-selected="true"]'); if (sel && sel.scrollIntoView) sel.scrollIntoView({ inline: 'center', block: 'nearest' }); }
    if (!opts.silent && window.parent !== window) window.parent.postMessage({ type: 'kismet-proto-state', state: s }, '*');
  }
  window.addEventListener('message', function (e) { var d = e.data; if (!d || d.type !== 'kismet-proto') return; if (d.theme && window.Kismet) window.Kismet.setTheme(d.theme); if (d.state) setState(d.state, { silent: true }); });

  /* ---------- profile dropdown ---------- */
  var btn = $('#profile-btn'), menu = $('#pmenu');
  function items() { return $$('#pmenu [data-only]:not([hidden]) a[role="menuitem"], #pmenu [data-only]:not([hidden]) .k-btn'); }
  function openMenu() { if (!menu) return; menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); var it = items()[0]; if (it) it.focus(); }
  function closeMenu(refocus) { if (!menu || menu.hidden) return; menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (refocus) btn.focus(); }
  if (btn && menu) {
    btn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); menu.hidden ? openMenu() : closeMenu(true); });
    document.addEventListener('click', function (e) { if (!menu.hidden && !e.target.closest('.k-pmenu-wrap')) closeMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (menu.hidden) return;
      if (e.key === 'Escape') { closeMenu(true); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { var l = items(), i = l.indexOf(document.activeElement); e.preventDefault(); l[(i + (e.key === 'ArrowDown' ? 1 : -1) + l.length) % l.length].focus(); }
    });
  }


  /* ---------- join (logged in, not a member yet) ---------- */
  function joinBtn() { return $('[data-join]'); }
  function resetJoin() { var c = $('#consent'); if (c) c.checked = false; syncJoin(); }
  function syncJoin() { var c = $('#consent'), b = joinBtn(); if (b) b.setAttribute('aria-disabled', String(!!c && !c.checked)); }
  document.addEventListener('change', function (e) { if (e.target.id === 'consent') syncJoin(); });

  /* ---------- rewards history dialog ---------- */
  var modal = null, lastFocus = null;
  function focusables() { return $$('button, a[href], input, [tabindex]:not([tabindex="-1"])', modal).filter(function (n) { return !n.disabled && n.offsetParent !== null; }); }
  function openModal(trigger, id) { modal = $('#' + (id || 'history')); if (!modal) return; lastFocus = trigger || document.activeElement; modal.hidden = false; body.classList.add('has-modal'); var c = $('[data-close-modal]', modal); if (c) c.focus(); }
  function closeModal(refocus) { if (!modal || modal.hidden) return; modal.hidden = true; body.classList.remove('has-modal'); if (refocus && lastFocus && lastFocus.focus) lastFocus.focus(); }
  document.addEventListener('keydown', function (e) {
    if (!modal || modal.hidden) return;
    if (e.key === 'Escape') { closeModal(true); return; }
    if (e.key === 'Tab') { var f = focusables(); if (!f.length) return; var first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
  });

  /* ---------- actions ---------- */
  var cart = 2;
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-join]'))) { e.preventDefault(); if (t.getAttribute('aria-disabled') === 'true') { toast('Please accept the terms to join'); return; } setState('in'); toast('Welcome to the club — 100 points added'); return; }
    if ((t = e.target.closest('[data-open-history]'))) { e.preventDefault(); openModal(t); return; }
    if ((t = e.target.closest('[data-close-modal]')) || e.target.classList.contains('k-modal__scrim')) { closeModal(true); return; }
    if ((t = e.target.closest('[data-action]'))) { var a = t.getAttribute('data-action'); if (a === 'birthday') openModal(t, 'birthday'); else if (a === 'instagram') toast('Opens Kismet on Instagram in a new tab'); else if (a === 'review') toast('Opens the review action (Yotpo popup)'); else toast('Opens the action in Yotpo'); return; }
    if ((t = e.target.closest('[data-save-birthday]'))) { closeModal(true); toast('Birthday saved — your 100 points arrive on the day'); return; }
    if ((t = e.target.closest('[data-login]'))) { e.preventDefault(); setState(q.get('member') === '0' ? 'join' : 'in'); toast('Signed in as Ben — prototype'); return; }
    if ((t = e.target.closest('[data-logout]'))) { e.preventDefault(); setState('out'); toast('Logged out'); return; }
    if ((t = e.target.closest('[data-goto]'))) {
      e.preventDefault(); var g = t.getAttribute('data-goto'); closeMenu(false);
      if (g === 'loyalty') { setState(body.getAttribute('data-state')); }
      else toast((g === 'account' ? 'My Account' : 'That page') + ' is not part of this prototype');
      return;
    }
    if ((t = e.target.closest('[data-soon]'))) { e.preventDefault(); toast('That tab is not part of this prototype'); return; }
    if ((t = e.target.closest('[data-copy]'))) {
      e.preventDefault(); try { navigator.clipboard.writeText(t.getAttribute('data-copy')); } catch (x) {}
      if (t.classList.contains('is-copied')) return;
      var lab = t.querySelector('.k-copybtn__label'), prev = lab ? lab.textContent : null; t.style.minWidth = t.offsetWidth + 'px'; t.classList.add('is-copied');
      if (lab) { lab.textContent = 'Copied'; var ic = document.createElement('span'); ic.className = 'k-icon k-icon--check'; ic.setAttribute('aria-hidden', 'true'); t.insertBefore(ic, lab); t._ic = ic; }
      setTimeout(function () { t.classList.remove('is-copied'); if (lab) lab.textContent = prev; if (t._ic) { t._ic.remove(); t._ic = null; } t.style.minWidth = ''; }, 2000); return;
    }
    if ((t = e.target.closest('.k-card__cta'))) {
      e.preventDefault(); if (t.dataset.busy) return; t.dataset.busy = '1'; var label = t.textContent; t.textContent = 'Added'; t.setAttribute('aria-live', 'polite');
      cart++; $$('.k-header__count').forEach(function (c) { c.textContent = cart; });
      toast('Added to cart'); setTimeout(function () { t.textContent = label; delete t.dataset.busy; }, 1600); return;
    }
    if ((t = e.target.closest('[data-set-state]'))) { setState(t.getAttribute('data-set-state')); return; }
    if ((t = e.target.closest('[data-use-reward]'))) { e.preventDefault(); toast('Reward applied — redeem it at checkout'); return; }
    if ((t = e.target.closest('a[href="#"]:not([data-login]):not([data-goto]):not([data-soon])'))) { e.preventDefault(); }
  });

  var start = q.get('state') || (location.hash === '#in' ? 'in' : 'out');
  function boot() { setState(start, { silent: true, keepScroll: true }); window.addEventListener('resize', fillMarquees); setTimeout(fillMarquees, 250); if (q.has('menu')) setTimeout(openMenu, 300); if (q.has('history')) setTimeout(function () { openModal(null); }, 300); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  if (window.parent !== window) window.parent.postMessage({ type: 'kismet-proto-ready' }, '*');
})();
