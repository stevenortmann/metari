/* Shared "Sectors" menu for Metari sector pages.
   Put <div class="sx" data-sectors></div> inside #navLinks. Renders a dropdown on desktop
   and an inline list when the page's nav has collapsed into the mobile menu. */
(function(){
  'use strict';
  var SECTORS = [
    ['/hospitality', 'Hospitality', 'Hotels, rooms, laundry and events'],
    ['/food-service', 'Food service', 'Kitchens, restaurants and coffee'],
    ['/retail', 'Retail', 'Stores, delivery and distribution centers'],
    ['/health', 'Health', 'Controlled mock care environments'],
    ['/gov', 'Government', 'Programs for public facilities and logistics']
  ];
  var css = '' +
    '.sx{position:relative}' +
    '.sx-btn{display:inline-flex;align-items:center;gap:6px;background:none;border:0;font:inherit;font-size:14px;color:var(--dim,#9BA0AB);cursor:pointer;padding:8px 0;white-space:nowrap;transition:color .25s}' +
    '.sx-btn:hover,.sx.open .sx-btn{color:var(--text,#EEF0F3)}' +
    '.sx-btn svg{width:12px;height:12px;opacity:.7;transition:transform .25s}' +
    '.sx.open .sx-btn svg{transform:rotate(180deg)}' +
    '.sx-menu{position:absolute;top:calc(100% + 12px);right:-10px;min-width:300px;padding:8px;border-radius:14px;background:rgba(14,15,19,.97);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.09);box-shadow:0 24px 60px rgba(0,0,0,.55);opacity:0;visibility:hidden;transform:translateY(-6px);transition:opacity .2s,transform .2s,visibility 0s linear .2s;z-index:80}' +
    '.sx-menu:before{content:"";position:absolute;left:0;right:0;top:-14px;height:14px}' +
    '.sx.open .sx-menu{opacity:1;visibility:visible;transform:none;transition:opacity .2s,transform .2s,visibility 0s}' +
    '.sx-menu a{display:block;padding:10px 12px;border-radius:9px;transition:background .2s}' +
    '.sx-menu a:hover,.sx-menu a:focus-visible{background:rgba(255,255,255,.05)}' +
    '.sx-menu a b{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:var(--text,#EEF0F3)}' +
    '.sx-menu a span{display:block;margin-top:2px;font-size:12.5px;color:var(--faint,#80858f)}' +
    '.sx-menu a.cur b:after{content:"You are here";font:500 10px "JetBrains Mono",monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--accent,#2EFEA9)}' +
    '.sx-menu .sx-all{margin-top:4px;border-top:1px solid rgba(255,255,255,.06);border-radius:0 0 9px 9px;font-size:13px;color:var(--dim,#9BA0AB)}' +
    '.sx.inline{width:100%;padding:12px 0 6px;border-bottom:1px solid rgba(255,255,255,.055)}' +
    '.sx.inline .sx-btn{pointer-events:none;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint,#80858f);padding:0 0 4px}' +
    '.sx.inline .sx-btn svg{display:none}' +
    '.sx.inline .sx-menu{position:static;opacity:1;visibility:visible;transform:none;min-width:0;padding:0;background:none;border:0;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none}' +
    '.sx.inline .sx-menu a{padding:9px 0}' +
    '.sx.inline .sx-menu a b{font-size:16px}' +
    '.sx.inline .sx-menu a span,.sx.inline .sx-all{display:none}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var here = location.pathname.replace(/\/+$/, '') || '/';
  var chev = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  [].slice.call(document.querySelectorAll('[data-sectors]')).forEach(function(host, n){
    var id = 'sxMenu' + n;
    host.innerHTML = '<button type="button" class="sx-btn" aria-expanded="false" aria-controls="' + id + '">Sectors' + chev + '</button>' +
      '<div class="sx-menu" id="' + id + '">' + SECTORS.map(function(s){
        var cur = here === s[0];
        return '<a href="' + s[0] + '"' + (cur ? ' class="cur" aria-current="page"' : '') + '><b>' + s[1] + '</b><span>' + s[2] + '</span></a>';
      }).join('') + '<a class="sx-all" href="/#environments">All environments &rarr;</a></div>';
    var btn = host.querySelector('.sx-btn'), timer;
    function set(o){ host.classList.toggle('open', o); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); }
    function hoverable(){ return !host.classList.contains('inline') && window.matchMedia('(hover:hover)').matches; }
    btn.addEventListener('click', function(e){ e.stopPropagation(); set(!host.classList.contains('open')); });
    host.addEventListener('mouseenter', function(){ if (hoverable()) { clearTimeout(timer); set(true); } });
    host.addEventListener('mouseleave', function(){ if (hoverable()) { timer = setTimeout(function(){ set(false); }, 140); } });
    host.addEventListener('focusout', function(e){ if (!host.contains(e.relatedTarget)) set(false); });
    document.addEventListener('click', function(e){ if (!host.contains(e.target)) set(false); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && host.classList.contains('open')) { set(false); btn.focus(); } });
    // inline mode whenever the page nav is the collapsed mobile panel
    var links = document.getElementById('navLinks');
    function mode(){ var inl = !!links && getComputedStyle(links).position === 'fixed'; host.classList.toggle('inline', inl); if (inl) set(false); }
    mode(); window.addEventListener('resize', mode);
  });
})();
