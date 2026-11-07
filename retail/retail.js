/* Metari Retail page behaviour: nav, reveal and the inquiry form. No network calls except the form submit. */
(function(){
  'use strict';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return [].slice.call((r || document).querySelectorAll(s)); };

  /* nav + reveal */
  var nav = $('#nav');
  function onScroll(){ nav.classList.toggle('scrolled', window.scrollY > 24); }
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
  var tg = $('#navToggle'), nl = $('#navLinks');
  tg.addEventListener('click', function(){ var o = nl.classList.toggle('open'); tg.setAttribute('aria-expanded', o); });
  $$('a', nl).forEach(function(a){ a.addEventListener('click', function(){ nl.classList.remove('open'); tg.setAttribute('aria-expanded', false); }); });
  var els = $$('.reveal:not(.in)');
  if (!('IntersectionObserver' in window) || RM) { els.forEach(function(e){ e.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(e){ io.observe(e); });
  }

  /* inquiry form (Web3Forms, the same service as the homepage) */
  var f = $('#rtForm'); if (!f) return;
  var out = $('#rfStatus'), btn = $('button[type=submit]', f);
  var mail = '<a href="mailto:steve@metari.io?subject=Metari%20Retail%20inquiry">steve@metari.io</a>';
  $$('[data-interest]').forEach(function(a){ a.addEventListener('click', function(){ var s = $('#rfInterest'); if (s) s.value = a.getAttribute('data-interest'); }); });
  f.addEventListener('submit', function(e){
    e.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    out.className = 'gf-status'; out.textContent = 'Sending…'; btn.disabled = true;
    var data = {}; new FormData(f).forEach(function(v, k){ data[k] = v; });
    fetch('https://api.web3forms.com/submit', {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body:JSON.stringify(data)})
      .then(function(r){ return r.json(); })
      .then(function(j){
        if (j && j.success) { f.reset(); out.className = 'gf-status ok'; out.textContent = 'Thank you. Your inquiry was sent. We will reply from steve@metari.io.'; }
        else { out.className = 'gf-status err'; out.innerHTML = 'The form could not be sent. Please email ' + mail + ' instead.'; }
      })
      .catch(function(){ out.className = 'gf-status err'; out.innerHTML = 'Network error. Please email ' + mail + ' instead.'; })
      .then(function(){ btn.disabled = false; });
  });
})();
