/* Metari x micro1: simple browser-side gate, same mechanism as /1x.
 * This keeps casual visitors out. It is NOT security: the page source and assets are public
 * to anyone who requests them directly. Use Vercel deployment protection for real access control. */
(function () {
  'use strict';
  var HASH = '66c660fbe0a9c6d74bd69cad07458e8f29ad4bc62a6f00b1cb3cc32dcd7f5b8c';
  var KEY = 'metari-micro1-gate';
  var root = document.documentElement;
  function unlocked() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  if (unlocked()) { root.classList.remove('gated'); return; }
  function build() {
    var g = document.createElement('div');
    g.id = 'pw-gate';
    g.innerHTML = '<div class="gate-card" role="dialog" aria-modal="true" aria-labelledby="gate-h">' +
      '<div class="gate-top"><svg class="mark" role="img" aria-label="Metari"><use href="#metari-mark"/></svg>' +
      '<span class="gate-lock mono">Private page</span>' +
      '<h1 id="gate-h">Metari &times; micro1</h1>' +
      '<p class="gate-sub">Prepared for the micro1 robotics team. Enter the credentials you were sent to continue.</p></div>' +
      '<form class="gate-form" id="gate-form" autocomplete="off" novalidate>' +
      '<label class="field">Username<input id="gate-user" autocapitalize="none" autocorrect="off" spellcheck="false" required></label>' +
      '<label class="field">Password<input id="gate-pass" type="password" required></label>' +
      '<button class="btn primary" type="submit" id="gate-btn">View the page</button></form>' +
      '<p class="gate-err" id="gate-err" role="alert" aria-live="polite"></p>' +
      '<p class="gate-foot">Metari &middot; physical intelligence</p></div>';
    document.body.insertBefore(g, document.body.firstChild);
    var form = g.querySelector('#gate-form'), err = g.querySelector('#gate-err'), btn = g.querySelector('#gate-btn');
    setTimeout(function () { try { g.querySelector('#gate-user').focus(); } catch (e) { } }, 60);
    form.addEventListener('submit', function (e) {
      e.preventDefault(); err.textContent = ''; btn.disabled = true;
      var u = g.querySelector('#gate-user').value.trim().toLowerCase(), p = g.querySelector('#gate-pass').value.trim().toLowerCase();
      if (!window.crypto || !crypto.subtle) { btn.disabled = false; err.textContent = 'This browser cannot check the password. Try another browser.'; return; }
      crypto.subtle.digest('SHA-256', new TextEncoder().encode(u + ':' + p)).then(function (buf) {
        var h = Array.prototype.map.call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, '0'); }).join('');
        btn.disabled = false;
        if (h === HASH) {
          try { sessionStorage.setItem(KEY, '1'); } catch (x) { }
          root.classList.remove('gated'); g.remove();
          window.dispatchEvent(new Event('metari:unlocked'));
          var t = document.querySelector('main, #ws-main'); if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
        } else { err.textContent = 'That username or password is not recognised.'; g.querySelector('#gate-pass').value = ''; g.querySelector('#gate-pass').focus(); }
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
