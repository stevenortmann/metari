/* Metari x Figure proposal page controller.
 * Room generator, shift log, human/robot reveal and the 3D building.
 * Everything here runs in the browser. Nothing is sent anywhere and no robot performance is shown. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = false; try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ------------------------------------------------------------ room generator */
  var LINENS = [
    { n: 'White, charcoal runner', d: '#eef1f0', a: '#3b4348' },
    { n: 'Sand linen, woven throw', d: '#e3d7bf', a: '#b89d6e' },
    { n: 'Rust floral', d: '#9c4f2c', a: '#ead9c0' },
    { n: 'Grey stripe', d: '#c4cbce', a: '#69767d' }
  ];
  var OPTS = [
    { k: 'bed', label: 'Beds', v: ['King', 'Two queens', 'Queen', 'Twin pair'] },
    { k: 'side', label: 'Layout', v: ['Headboard on the left wall', 'Headboard on the right wall'] },
    { k: 'linen', label: 'Linens', v: LINENS.map(function (l) { return l.n; }) },
    { k: 'pillows', label: 'Pillows', v: ['2 pillows', '3 pillows', '4 pillows', '6 pillows'] },
    { k: 'state', label: 'Start state', v: ['Made to standard', 'Just checked out', 'Family stay', 'Half turned down'] },
    { k: 'towels', label: 'Towels', v: ['Folded on the bed', 'On the bathroom rack', 'Dropped on the floor', 'Stacked on a bench'] },
    { k: 'light', label: 'Light', v: ['Daylight', 'Morning sun', 'Afternoon haze', 'Lamps only'] },
    { k: 'chair', label: 'Seating', v: ['Armchair by the window', 'Desk chair', 'No chair'] }
  ];
  var TOTAL = OPTS.reduce(function (p, o) { return p * o.v.length; }, 1);
  var ROOMS = ['4F-12', '4F-14', '4F-16', '4F-18', '4F-21', '4F-23', '5F-02', '5F-04', '5F-07', '5F-09', '5F-11', '5F-15'];
  var st = { seen: {}, made: 0, track: 'eval', cur: null, prev: null, roomI: 0, clock: 6 * 60 + 40, busy: false };

  function decode(idx) {
    var out = {}, n = idx;
    for (var i = OPTS.length - 1; i >= 0; i--) { var len = OPTS[i].v.length; out[OPTS[i].k] = n % len; n = Math.floor(n / len); }
    return out;
  }
  function fid(idx) { return 'R-' + idx.toString(16).toUpperCase().padStart(4, '0'); }
  function pick() {
    var idx, guard = 0;
    do { idx = Math.floor(Math.random() * TOTAL); guard++; } while (st.seen[idx] && guard < 5000);
    return idx;
  }
  function hhmm(m) { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }

  function bedRects(type) {
    switch (type) {
      case 0: return [[22, 78, 160, 136]];
      case 1: return [[22, 34, 140, 104], [22, 150, 140, 104]];
      case 2: return [[22, 92, 146, 112]];
      default: return [[22, 50, 136, 74], [22, 150, 136, 74]];
    }
  }

  function plan(c) {
    var L = LINENS[c.linen], beds = bedRects(c.bed), pillows = [2, 3, 4, 6][c.pillows];
    var g = [];
    // furniture group (mirrored when the headboard is on the right wall)
    var f = [];
    var perBed = Math.max(1, Math.ceil(pillows / beds.length));
    beds.forEach(function (b, bi) {
      var x = b[0], y = b[1], w = b[2], h = b[3];
      f.push('<g class="pop" style="animation-delay:' + (bi * 80) + 'ms;transform-origin:' + (x + w / 2) + 'px ' + (y + h / 2) + 'px">');
      f.push('<rect class="bed-frame" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3"/>');
      // nightstand
      f.push('<rect class="furn" x="' + x + '" y="' + (y - 18 < 22 ? y + h + 4 : y - 18) + '" width="20" height="14" rx="2"/>');
      if (c.state === 1) {
        f.push('<rect x="' + (x + 30) + '" y="' + (y + 4) + '" width="' + (w - 34) + '" height="' + (h - 8) + '" fill="#f6f7f6" rx="3"/>');
        f.push('<path d="M' + (x + 46) + ' ' + (y + 10) + ' q 40 30 ' + (w - 40) + ' 6 l 8 ' + (h - 14) + ' q -50 14 ' + (-(w - 30)) + ' -6 z" fill="' + L.d + '" opacity=".92" transform="rotate(-7 ' + (x + w / 2) + ' ' + (y + h / 2) + ')"/>');
      } else if (c.state === 3) {
        f.push('<rect x="' + (x + 30) + '" y="' + (y + 4) + '" width="' + (w - 34) + '" height="' + (h - 8) + '" fill="' + L.d + '" rx="3"/>');
        f.push('<polygon points="' + (x + 30) + ',' + (y + 4) + ' ' + (x + 30 + (w - 34) * .55) + ',' + (y + 4) + ' ' + (x + 30) + ',' + (y + h * .55) + '" fill="#f6f7f6"/>');
        f.push('<rect x="' + (x + w * .72) + '" y="' + (y + 4) + '" width="14" height="' + (h - 8) + '" fill="' + L.a + '" opacity=".9"/>');
      } else {
        f.push('<rect x="' + (x + 30) + '" y="' + (y + 4) + '" width="' + (w - 34) + '" height="' + (h - 8) + '" fill="' + L.d + '" rx="3"/>');
        f.push('<rect x="' + (x + w * .72) + '" y="' + (y + 4) + '" width="14" height="' + (h - 8) + '" fill="' + L.a + '" opacity=".9"/>');
      }
      // pillows along the headboard
      for (var p = 0; p < perBed; p++) {
        var ph = (h - 14) / perBed - 3, py = y + 7 + p * ((h - 14) / perBed);
        if (c.state === 1 && p === perBed - 1) f.push('<rect class="pillow" x="' + (x + w + 8) + '" y="' + (y + h - 30) + '" width="16" height="22" rx="4" transform="rotate(24 ' + (x + w + 16) + ' ' + (y + h - 19) + ')"/>');
        else f.push('<rect class="pillow" x="' + (x + 6) + '" y="' + py + '" width="20" height="' + Math.max(10, ph) + '" rx="4"/>');
      }
      f.push('</g>');
      if (c.towels === 0) f.push('<g class="pop" style="animation-delay:260ms;transform-origin:' + (x + w * .5) + 'px ' + (y + h * .5) + 'px"><rect class="towel" x="' + (x + w * .45) + '" y="' + (y + h * .38) + '" width="20" height="14" rx="1.5"/><rect class="towel" x="' + (x + w * .45 + 3) + '" y="' + (y + h * .38 - 4) + '" width="20" height="14" rx="1.5"/></g>');
    });
    if (c.towels === 3) {
      var lb = beds[beds.length - 1];
      f.push('<g class="pop" style="animation-delay:300ms;transform-origin:' + (lb[0] + lb[2] + 18) + 'px 150px"><rect class="furn" x="' + (lb[0] + lb[2] + 8) + '" y="' + (beds[0][1] + 10) + '" width="18" height="' + (beds.length > 1 ? 200 : lb[3] - 20) + '" rx="2"/><rect class="towel" x="' + (lb[0] + lb[2] + 10) + '" y="' + (beds[0][1] + 24) + '" width="14" height="18"/><rect class="towel" x="' + (lb[0] + lb[2] + 10) + '" y="' + (beds[0][1] + 46) + '" width="14" height="18"/></g>');
    }
    // desk and tv on the opposite wall
    f.push('<g class="pop" style="animation-delay:120ms;transform-origin:385px 120px"><rect class="furn" x="372" y="64" width="26" height="110" rx="2"/><rect x="396" y="88" width="3" height="60" fill="#0d1a1f" stroke="#55707a" stroke-width=".6"/></g>');
    if (c.chair === 0) f.push('<g class="pop" style="animation-delay:180ms;transform-origin:330px 48px"><rect class="furn" x="312" y="30" width="34" height="32" rx="8"/><rect x="316" y="34" width="26" height="8" rx="3" fill="#3f5a63"/></g>');
    if (c.chair === 1) f.push('<g class="pop" style="animation-delay:180ms;transform-origin:356px 118px"><circle class="furn" cx="356" cy="118" r="11"/></g>');
    // mess
    var mess = [];
    if (c.state === 1) mess = [[200, 230, '#cfd6d8', 0], [232, 120, '#4b5d66', 30], [300, 200, '#8a6f52', -20], [214, 60, '#cfd6d8', 15]];
    if (c.state === 2) mess = [[210, 70, '#e9b872', 0], [236, 96, '#f08c7e', 25], [250, 230, '#3DE8B0', -15], [290, 160, '#9bb7ff', 40], [214, 182, '#e9b872', 10], [320, 236, '#f08c7e', 0]];
    mess.forEach(function (m, i) { f.push('<rect class="mess pop" style="animation-delay:' + (340 + i * 50) + 'ms;transform-origin:' + m[0] + 'px ' + m[1] + 'px" x="' + (m[0] - 8) + '" y="' + (m[1] - 5) + '" width="16" height="10" rx="3" fill="' + m[2] + '" transform="rotate(' + m[3] + ' ' + m[0] + ' ' + m[1] + ')"/>'); });
    if (c.state === 1) f.push('<g class="pop" style="animation-delay:420ms;transform-origin:250px 250px"><rect class="furn" x="226" y="236" width="48" height="30" rx="3"/><rect x="230" y="240" width="40" height="22" fill="#0d1a1f"/></g>');
    // bathroom (bottom right in local coordinates)
    f.push('<rect class="bath" x="292" y="196" width="106" height="82"/><text class="label" x="345" y="242" text-anchor="middle"' + (c.side === 1 ? ' transform="translate(690,0) scale(-1,1)"' : '') + '>Bath</text>');
    if (c.towels === 1) f.push('<g class="pop" style="animation-delay:300ms;transform-origin:345px 205px"><rect x="312" y="200" width="66" height="4" fill="#55707a"/><rect class="towel" x="318" y="204" width="16" height="12"/><rect class="towel" x="340" y="204" width="16" height="12"/><rect class="towel" x="360" y="204" width="14" height="12"/></g>');
    if (c.towels === 2) f.push('<g class="pop" style="animation-delay:300ms;transform-origin:280px 220px"><rect class="towel" x="262" y="206" width="20" height="13" rx="2" transform="rotate(-25 272 212)"/><rect class="towel" x="276" y="250" width="22" height="12" rx="2" transform="rotate(18 287 256)"/></g>');

    var light = [
      '<rect x="20" y="20" width="380" height="260" fill="#bfe8ff" opacity=".045"/>',
      '<rect x="20" y="20" width="380" height="260" fill="url(#stMorning)"/>',
      '<rect x="20" y="20" width="380" height="260" fill="#ffe9c4" opacity=".06"/>',
      '<rect x="20" y="20" width="380" height="260" fill="#000" opacity=".38"/>'
    ][c.light];
    var lamps = '';
    if (c.light === 3) beds.forEach(function (b) { var ly = b[1] - 18 < 22 ? b[1] + b[3] + 11 : b[1] - 11; var lx = c.side === 1 ? 420 - (b[0] + 10) : b[0] + 10; lamps += '<circle cx="' + lx + '" cy="' + ly + '" r="38" fill="url(#stLamp)"/>'; });

    g.push('<defs><linearGradient id="stMorning" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd27a" stop-opacity=".22"/><stop offset=".7" stop-color="#ffd27a" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="stLamp"><stop offset="0" stop-color="#ffcf7d" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf7d" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="stSweep" x1="0" x2="1"><stop offset="0" stop-color="#3DE8B0" stop-opacity="0"/><stop offset=".5" stop-color="#3DE8B0" stop-opacity=".16"/><stop offset="1" stop-color="#3DE8B0" stop-opacity="0"/></linearGradient></defs>');
    g.push('<rect class="floor" x="20" y="20" width="380" height="260"/>');
    g.push('<g class="anim"' + (c.side === 1 ? ' transform="translate(420,0) scale(-1,1)"' : '') + '>' + f.join('') + '</g>');
    g.push(light + lamps);
    g.push('<rect class="wall" x="20" y="20" width="380" height="260"/><line class="glass" x1="70" y1="20" x2="350" y2="20"/>');
    g.push('<text class="label" x="210" y="14" text-anchor="middle">Window</text><text class="label" x="' + (c.side === 1 ? 170 : 250) + '" y="295" text-anchor="middle">Entry</text>');
    // ceiling cameras
    [[30, 30, 45], [390, 30, 135], [30, 270, -45], [390, 270, -135]].forEach(function (cm) {
      g.push('<path class="fov" d="M' + cm[0] + ' ' + cm[1] + ' l ' + (Math.cos((cm[2] - 25) * Math.PI / 180) * 70) + ' ' + (Math.sin((cm[2] - 25) * Math.PI / 180) * 70) + ' A 70 70 0 0 1 ' + (cm[0] + Math.cos((cm[2] + 25) * Math.PI / 180) * 70) + ' ' + (cm[1] + Math.sin((cm[2] + 25) * Math.PI / 180) * 70) + ' z"/><circle class="cam" cx="' + cm[0] + '" cy="' + cm[1] + '" r="3.2"/>');
    });
    if (!reduce) g.push('<rect class="sweep" x="0" y="20" width="200" height="260"/>');
    return g.join('');
  }

  function attrs(c, prev) {
    return OPTS.map(function (o) {
      var changed = prev && prev[o.k] !== c[o.k];
      return '<dt>' + esc(o.label) + '</dt><dd' + (changed ? ' class="chg"' : '') + '>' + esc(o.v[c[o.k]]) + '</dd>';
    }).join('');
  }

  function log(lines) {
    var ol = $('#st-log'); if (!ol) return;
    lines.forEach(function (l) {
      var li = document.createElement('li');
      li.innerHTML = '<time>' + hhmm(st.clock) + '</time><span>' + l + '</span>';
      ol.insertBefore(li, ol.firstChild);
    });
    while (ol.children.length > 60) ol.removeChild(ol.lastChild);
  }

  function redress(opts) {
    opts = opts || {};
    var idx = pick();
    st.seen[idx] = st.track; st.made++;
    st.prev = st.cur; st.cur = decode(idx);
    st.roomI = (st.roomI + 1) % ROOMS.length;
    st.clock += opts.step || 25;
    var room = ROOMS[st.roomI], id = fid(idx), track = st.track;
    $('#st-plan').innerHTML = '<title id="st-plan-t">Top-down plan of setup ' + id + ': ' + esc(OPTS.map(function (o) { return o.v[st.cur[o.k]]; }).join(', ')) + '</title>' + plan(st.cur);
    $('#st-attrs').innerHTML = attrs(st.cur, st.prev);
    $('#st-id').textContent = id;
    $('#st-room').textContent = 'Room ' + room;
    var flag = $('#st-flag');
    flag.textContent = track === 'eval' ? 'Held out for evaluation' : 'Training capture';
    flag.classList.toggle('train', track === 'train');
    $('#st-made').textContent = st.made.toLocaleString();
    $('#st-rep').textContent = '0';
    if (!opts.quiet) log(['Room <b>' + room + '</b> re-dressed to <b>' + id + '</b> &middot; ' + (track === 'eval' ? '<span class="ok">held out for evaluation</span>' : '<span class="tr">training capture</span>') + ' &middot; new setup, never logged before']);
    return { room: room, id: id, track: track };
  }

  function nightShift() {
    if (st.busy) return; st.busy = true;
    var btns = [$('#st-new'), $('#st-night')]; btns.forEach(function (b) { b.disabled = true; });
    st.clock = 22 * 60 - 25;
    log(['<b>Night shift starts</b> &middot; 6 rooms on the evaluation and capture plan']);
    var n = 0, total = 6, gap = reduce ? 0 : 1500;
    var origTrack = st.track;
    function step() {
      if (n >= total) {
        st.clock += 10; st.track = origTrack; syncTrack();
        log(['<b>Shift complete</b> &middot; 6 new setups, 0 repeats, every room checked before hand-off']);
        st.busy = false; btns.forEach(function (b) { b.disabled = false; });
        return;
      }
      st.track = n % 3 === 2 ? 'train' : 'eval'; syncTrack();
      var r = redress({ step: 35 });
      var t1 = reduce ? 0 : 520, t2 = reduce ? 0 : 1000;
      setTimeout(function () { st.clock += 6; log(['Supervisor check on <b>' + r.room + '</b> passed &middot; setup matches recipe ' + r.id]); }, t1);
      setTimeout(function () {
        st.clock += 4;
        log([r.track === 'eval' ? 'Room <b>' + r.room + '</b> handed to Figure for Helix trials &middot; <span class="ok">scored by Figure</span>' : 'Housekeeper capture session in <b>' + r.room + '</b> logged &middot; <span class="tr">data goes to Figure</span>']);
        n++; setTimeout(step, gap);
      }, t2);
    }
    step();
  }

  function syncTrack() {
    $$('.seg-b').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-track') === st.track)); });
  }

  function initStudio() {
    if (!$('#studio-app')) return;
    $('#st-total').textContent = TOTAL.toLocaleString();
    redress({ quiet: true });
    log(['Room <b>' + ROOMS[st.roomI] + '</b> ready &middot; setup <b>' + fid(Object.keys(st.seen).map(Number)[0]) + '</b> held out for evaluation']);
    $('#st-new').addEventListener('click', function () { redress(); });
    $('#st-night').addEventListener('click', nightShift);
    $$('.seg-b').forEach(function (b) {
      b.addEventListener('click', function () { if (st.busy) return; st.track = b.getAttribute('data-track'); syncTrack(); });
    });
  }

  /* ------------------------------------------------------------ reveal */
  var PAIRS = [
    { id: 'guest', tab: 'Guest room', h: '/1x/img/swap_human.jpg', r: '/micro1/img/guest-room-robot.jpg', who: 'Housekeeper capture', cap: 'Towels on the bed &middot; hotel guest room', alt: 'housekeeper places folded towels on a bed in an instrumented guest room' },
    { id: 'hospital', tab: 'Hospital room (mock)', h: '/figure/img/pair-hospital-human.jpg', r: '/figure/img/pair-hospital-robot.jpg', who: 'Nursing assistant capture', cap: 'Changing a bed &middot; mock hospital room, no patient', alt: 'nursing assistant pulls a fitted sheet over an empty hospital bed in a mock patient room' },
    { id: 'kitchen', tab: 'Kitchen', h: '/figure/img/pair-kitchen-human.jpg', r: '/figure/img/pair-kitchen-robot.jpg', who: 'Kitchen porter capture', cap: 'Loading a dish rack &middot; restaurant kitchen', alt: 'kitchen porter loads plates into a dish rack at a commercial dish station' },
    { id: 'dining', tab: 'Dining room', h: '/figure/img/pair-dining-human.jpg', r: '/figure/img/pair-dining-robot.jpg', who: 'Server capture', cap: 'Busing a table &middot; restaurant dining room', alt: 'server stacks used plates into a bus tub after service' },
    { id: 'apartment', tab: 'Apartment', h: '/figure/img/pair-apartment-human.jpg', r: '/figure/img/pair-apartment-robot.jpg', who: 'Housekeeper capture', cap: 'Folding laundry &middot; apartment living room', alt: 'housekeeper folds towels from a laundry basket in an apartment living room' },
    { id: 'bathroom', tab: 'Bathroom', h: '/figure/img/pair-bathroom-human.jpg', r: '/figure/img/pair-bathroom-robot.jpg', who: 'Housekeeper capture', cap: 'Wiping the shower glass &middot; hotel bathroom', alt: 'housekeeper wipes a glass shower door in a hotel bathroom' }
  ];
  function initReveal() {
    var r = $('#reveal'), input = $('#rv-range'), tabs = $('#rv-tabs'); if (!r || !input) return;
    input.addEventListener('input', function () { r.style.setProperty('--p', input.value + '%'); r.classList.add('used'); });
    if (!tabs) return;
    tabs.innerHTML = PAIRS.map(function (p, i) { return '<button type="button" role="tab" data-pair="' + p.id + '" aria-selected="' + (i === 0) + '">' + esc(p.tab) + '</button>'; }).join('');
    function show(id) {
      var p = PAIRS.filter(function (x) { return x.id === id; })[0]; if (!p) return;
      $$('#rv-tabs [data-pair]').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-pair') === id)); });
      r.classList.add('swap');
      setTimeout(function () {
        $('#rv-human').src = p.h; $('#rv-human').alt = 'Concept rendering: ' + p.alt;
        $('#rv-robot').src = p.r; $('#rv-robot').alt = 'The same room and camera view with an illustrative robot doing the same task';
        $('#rv-tag-l').textContent = p.who; $('#rv-cap').innerHTML = p.cap;
        r.classList.remove('swap');
      }, reduce ? 0 : 180);
    }
    tabs.addEventListener('click', function (e) { var b = e.target.closest('[data-pair]'); if (b) show(b.getAttribute('data-pair')); });
    PAIRS.forEach(function (p) { [p.h, p.r].forEach(function (u) { var im = new Image(); im.src = u; }); });
  }

  /* ------------------------------------------------------------ building */
  var INFO = {
    guest: { tracks: ['Train', 'Evaluate'], what: 'Bedrooms dressed to recipes, from city king to just checked out. The core of the program.', tasks: ['Making beds to a hotel standard', 'Folding and placing towels', 'Tidying a room after checkout', 'Restocking amenities'] },
    bathroom: { tracks: ['Train', 'Evaluate'], what: 'Real hotel bathrooms with different fixtures, glass and layouts.', tasks: ['Swapping used towels for fresh ones', 'Wiping vanities, mirrors and glass', 'Replacing amenities and emptying bins'] },
    residential: { tracks: ['Train', 'Evaluate'], what: 'A suite set up like a small apartment: living room, kitchenette and dining table.', tasks: ['Tidying a living room', 'Folding throws and arranging cushions', 'Clearing and wiping a table'] },
    laundry: { tracks: ['Train'], what: 'A working hotel laundry with attendants folding to standard every shift.', tasks: ['Folding towels at volume', 'Sorting and stacking linen', 'Loading and unloading machines'] },
    boh: { tracks: ['Train'], what: 'Housekeeping carts, linen shelves and amenity stock.', tasks: ['Loading a housekeeping cart', 'Restocking shelves by label', 'Counting and bagging linen'] },
    corridor: { tracks: ['Evaluate'], what: 'Long guest corridors with doors, carts and turns.', tasks: ['Pushing a cart down a corridor', 'Opening and holding doors', 'Finding the right room'] },
    elevator: { tracks: ['Evaluate'], what: 'A service elevator set up for repeatable rides.', tasks: ['Calling and boarding an elevator', 'Riding with a cart between floors'] },
    kitchen: { tracks: ['Train', 'Later'], what: 'A commercial kitchen with chefs on a normal prep and plating rhythm.', tasks: ['Loading and unloading dish racks', 'Wiping down stations', 'Simple plating'] },
    cafe: { tracks: ['Train', 'Later'], what: 'A restaurant floor that can be reset between services.', tasks: ['Busing tables', 'Resetting place settings', 'Carrying trays'] },
    senior: { tracks: ['Train', 'Evaluate'], what: 'Mock senior living suites with railed beds, grab bars and mobility aids. Staff only, no residents, no care claims.', tasks: ['Making a railed bed', 'Fetching and placing everyday items', 'Tidying a suite to a checklist'] },
    lobby: { tracks: ['Later'], what: 'Arrival and luggage areas for when Helix starts working around guests.', tasks: ['Carrying bags', 'Tidying seating areas'] }
  };
  var ORDER = ['guest', 'bathroom', 'residential', 'senior', 'laundry', 'boh', 'corridor', 'elevator', 'kitchen', 'cafe', 'lobby'];
  var scene = null, sel = 'guest', loading = false;
  function label(id) { var A = window.MetariArchitecture; var r = A && A.ROOMS && A.ROOMS.filter(function (x) { return x.id === id; })[0]; return r ? r.label : id; }
  function panel() {
    var p = $('#fl-panel'); if (!p) return; var i = INFO[sel];
    p.innerHTML = '<span class="mono">Room &middot; concept</span><h3>' + esc(label(sel)) + '</h3><div>' + i.tracks.map(function (t) { return '<span class="tag' + (t === 'Train' ? ' t' : '') + '">' + esc(t) + '</span>'; }).join('') + '</div><p>' + esc(i.what) + '</p><h4>What Figure could do here</h4><ul>' + i.tasks.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '<div class="fl-chips" role="group" aria-label="Pick a room">' + ORDER.map(function (id) { return '<button type="button" data-room="' + id + '" aria-pressed="' + (id === sel) + '">' + esc(label(id)) + '</button>'; }).join('') + '</div>';
  }
  function choose(id, focus) { if (!INFO[id]) return; sel = id; panel(); if (scene) scene.select(id, !!focus); }
  function loadScript(src) { return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = function () { rej(new Error('Failed to load ' + src)); }; document.head.appendChild(s); }); }
  function mountScene() {
    if (scene || loading) return; loading = true;
    loadScript('/figure/js/plans.js').then(function () { return loadScript('/figure/js/architecture.js'); }).then(function () { return loadScript('/figure/js/scene.js'); }).then(function () {
      scene = window.MetariScene.mount($('#fl-scene'), {
        labelIds: ORDER,
        getState: function () { var cov = {}; ORDER.forEach(function (id) { cov[id] = INFO[id].tracks.indexOf('Later') >= 0 ? .35 : (INFO[id].tracks.length > 1 ? 1 : .7); }); return { allocated: ORDER, coverage: cov, layer: 'coverage', cameras: false, paths: false }; },
        onPick: function (id) { if (INFO[id]) choose(id, false); }
      });
      if (scene.fallback) $('#fl-2d').setAttribute('aria-pressed', 'true');
      panel(); scene.select(sel, false);
    }).catch(function (e) { console.error(e); $('#fl-scene').innerHTML = '<p class="scene-note mono" style="padding:14px">The 3D building could not load. The room list on the right still works.</p>'; });
  }
  function initFloor() {
    if (!$('#fl-scene')) return;
    panel();
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-room]'); if (b && b.closest('#fl-panel')) { choose(b.getAttribute('data-room'), true); return; }
      var f = e.target.closest('[data-floor]');
      if (f) { $$('[data-floor]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === f)); }); var v = f.getAttribute('data-floor'); if (scene) scene.floor(v === 'all' ? 'all' : +v); }
    });
    $('#fl-rot-l').addEventListener('click', function () { scene && scene.rotate(-1); });
    $('#fl-rot-r').addEventListener('click', function () { scene && scene.rotate(1); });
    $('#fl-2d').addEventListener('click', function () { if (!scene) return; var m = scene.toggle2d(); $('#fl-2d').setAttribute('aria-pressed', String(m === '2d')); });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { mountScene(); io.disconnect(); } }); }, { rootMargin: '400px 0px' });
      io.observe($('#floor'));
    } else mountScene();
  }


  /* ------------------------------------------------------------ 24 hour clock + order */
  var SHIFTS = [
    { id: 'day', from: 6, to: 14, name: 'Day shift', sub: 'Rooms, breakfast, morning routines', col: '#3DE8B0' },
    { id: 'swing', from: 14, to: 22, name: 'Swing shift', sub: 'Dinner service, laundry, turns', col: '#E6DCCC' },
    { id: 'night', from: 22, to: 30, name: 'Night shift', sub: 'Evaluations, resets, deep cleans', col: '#7FB6FF' }
  ];
  function pt(cx, cy, r, h) { var a = (h / 24) * 2 * Math.PI - Math.PI / 2; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function arc(cx, cy, r, h1, h2) { var a = pt(cx, cy, r, h1), b = pt(cx, cy, r, h2), large = (h2 - h1) > 12 ? 1 : 0; return 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1); }
  function shiftAt(h) { var x = h < 6 ? h + 24 : h; return SHIFTS.filter(function (s) { return x >= s.from && x < s.to; })[0]; }
  function drawClock() {
    var svg = $('#clock24'); if (!svg) return;
    var now = new Date(), h = now.getHours() + now.getMinutes() / 60, cur = shiftAt(h), cx = 160, cy = 160, g = [];
    g.push('<title id="c24-t">A 24 hour clock showing three shifts: day from 06:00, swing from 14:00 and night from 22:00</title>');
    SHIFTS.forEach(function (s) { g.push('<path class="c24-seg' + (s === cur ? ' on' : '') + '" stroke="' + s.col + '" d="' + arc(cx, cy, 118, s.from + .08, s.to - .08) + '"/>'); });
    for (var i = 0; i < 24; i++) { var a = pt(cx, cy, 134, i), b = pt(cx, cy, i % 6 === 0 ? 146 : 140, i); g.push('<line class="c24-tick" x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '"/>'); if (i % 6 === 0) { var t = pt(cx, cy, 98, i); g.push('<text class="c24-hr" x="' + t[0].toFixed(1) + '" y="' + (t[1] + 3).toFixed(1) + '" text-anchor="middle">' + String(i).padStart(2, '0') + '</text>'); } }
    var hd = pt(cx, cy, 128, h);
    g.push('<line class="c24-hand" x1="' + cx + '" y1="' + cy + '" x2="' + hd[0].toFixed(1) + '" y2="' + hd[1].toFixed(1) + '"/><circle class="c24-dot" cx="' + hd[0].toFixed(1) + '" cy="' + hd[1].toFixed(1) + '" r="5"/><circle cx="' + cx + '" cy="' + cy + '" r="4" fill="#3DE8B0"/>');
    g.push('<text class="c24-lbl" x="' + cx + '" y="' + (cy + 30) + '" text-anchor="middle">' + esc(cur.name) + '</text><text class="c24-sub" x="' + cx + '" y="' + (cy + 46) + '" text-anchor="middle">' + esc(cur.sub) + '</text>');
    svg.innerHTML = g.join('');
    var cap = $('#c24-now'); if (cap) cap.innerHTML = 'Your time ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ' &middot; <b>' + esc(cur.name) + '</b> would be on the floor';
  }
  var ENVS = {
    'Hotel guest rooms': ['Making beds', 'Folding and placing towels', 'Tidying after checkout'],
    'Hospital rooms (mock)': ['Changing a bed', 'Restocking a supply cart', 'Wiping down surfaces'],
    'Restaurant kitchens': ['Loading dish racks', 'Wiping stations', 'Simple plating'],
    'Dining rooms': ['Busing tables', 'Resetting place settings'],
    'Bathrooms': ['Swapping towels', 'Wiping glass and vanities'],
    'Senior living suites (mock)': ['Making a railed bed', 'Fetching everyday items'],
    'Apartments': ['Folding laundry', 'Loading a dishwasher', 'Tidying a living room'],
    'Laundry & linen': ['Folding towels at volume', 'Sorting linen']
  };
  function initOrder() {
    var env = $('#o-env'), task = $('#o-task'), out = $('#o-out'); if (!env) return;
    env.innerHTML = Object.keys(ENVS).map(function (k) { return '<option>' + esc(k) + '</option>'; }).join('');
    function fill() { task.innerHTML = ENVS[env.value].map(function (t) { return '<option>' + esc(t) + '</option>'; }).join(''); }
    env.addEventListener('change', fill); fill();
    $('#o-go').addEventListener('click', function () {
      var now = new Date(), h = now.getHours(), cur = shiftAt(h), idx = SHIFTS.indexOf(cur), next = SHIFTS[(idx + 1) % 3];
      var held = $('#o-var').value.indexOf('Held out') === 0;
      var lib = !held && ['Making beds', 'Folding and placing towels', 'Busing tables', 'Loading dish racks', 'Folding towels at volume', 'Folding laundry'].indexOf(task.value) >= 0;
      out.innerHTML = 'Order logged: <b>' + esc(task.value) + '</b> in ' + esc(env.value) + '. ' +
        (lib ? 'Proactive library already has this task, available now. ' : '') +
        'New capture scheduled into the <b>' + esc(next.name.toLowerCase()) + '</b> (starts ' + String(next.from % 24).padStart(2, '0') + ':00). ' +
        (held ? 'Rooms used will be held out from all training capture.' : 'Delivered to Figure as it is captured.');
    });
  }

  function init() { initStudio(); initReveal(); initFloor(); drawClock(); setInterval(drawClock, 60000); initOrder(); }
  function start() {
    if (document.documentElement.classList.contains('gated')) window.addEventListener('metari:unlocked', init, { once: true });
    else init();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
