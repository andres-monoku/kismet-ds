/* Kismet — Halloween Dog Parade page behaviours (prototype). No dependencies. Load after js/kismet.js. */
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'k-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600);
  }
  function setError(field, on) { field.classList.toggle('is-error', on); }

  /* enter the draw */
  var form = $('#enter'), done = $('#enter-done');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = $('input', form), field = input.closest('.k-field'), ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value.trim());
    setError(field, !ok);
    if (!ok) { input.focus(); toast('Enter a valid email to join the draw'); return; }
    form.hidden = true; done.hidden = false; toast('You’re in the draw');
  });

  /* redeem a code (prototype: any code with 4+ characters works) */
  var code = $('#code'), msg = $('#code-msg'), cart = 2;
  function bump() { cart++; $$('.k-header__count').forEach(function (c) { c.textContent = cart; }); }
  if (code) code.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = $('input', code), field = input.closest('.k-field'), v = input.value.trim();
    msg.className = 'k-ncode__msg';
    if (v.length < 4) { setError(field, true); msg.classList.add('is-err'); msg.textContent = 'That code doesn’t look right. Check your email and try again.'; return; }
    setError(field, false); msg.classList.add('is-ok'); msg.textContent = 'Code applied. Your free 4 lb bag drops in with your first item.';
  });

  /* add to cart */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.k-card__cta, .k-card__alt');
    if (t) {
      e.preventDefault(); if (t.dataset.busy) return; t.dataset.busy = '1'; var label = t.textContent; t.textContent = 'Added';
      bump(); toast('Added to cart'); setTimeout(function () { t.textContent = label; delete t.dataset.busy; }, 1600); return;
    }
    if (e.target.closest('a[href="#"]')) e.preventDefault();
  });

  /* theme from the prototype shell */
  window.addEventListener('message', function (e) { var d = e.data; if (d && d.type === 'kismet-proto' && d.theme && window.Kismet) window.Kismet.setTheme(d.theme); });
  if (window.parent !== window) window.parent.postMessage({ type: 'kismet-proto-ready' }, '*');
})();
