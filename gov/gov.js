/* Metari Government page behaviour: nav, reveal, environment details, the Requirement-to-Evidence
   Explorer, the public-source registry and the inquiry form. No network calls except the form submit. */
(function(){
  'use strict';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return [].slice.call((r || document).querySelectorAll(s)); };
  var esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
  var D = window.GOV;

  /* ---------- nav + reveal ---------- */
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

  /* ---------- environment details ---------- */
  var ENV = {
    facility: { k:'Facility operations', h:'Cart preparation, supply replenishment and room reset',
      tasks:['Cart preparation','Supply replenishment','Linen handling','Room reset','Cleaning-tool manipulation'],
      out:['Expert demonstrations','Task-step labels','Repeatability observations'],
      ex:'Example: a linen cart is prepared to a par list, moved to a mock room and the room is reset to a written standard. The same room is held still so attempts can be compared.', scen:'restock' },
    logistics: { k:'Logistics and material movement', h:'Tote transfers, shelf access and doorway navigation',
      tasks:['Tote transfers','Shelf access','Sorting','Cart loading','Doorway navigation'],
      out:['Synchronized episodes','Motion and route records where supported','Handling and intervention logs'],
      ex:'Example: GOV-DEMO-001 in the explorer below. A tote is collected, carried through a doorway and placed at a defined restock bay.', scen:'restock' },
    maintenance: { k:'Maintenance and skilled trades', h:'Tool selection and work-area preparation on training equipment',
      tasks:['Selecting tools','Preparing work areas','Handling components','Accessing mock equipment'],
      out:['Expert task sequences','Hand-object interactions','Error categories'],
      ex:'Example: GOV-DEMO-002 in the explorer below. Training equipment only, de-energized, with a technician present.', scen:'maintenance' },
    inspection: { k:'Inspection and infrastructure · Partner-led expansion', h:'Nonhazardous confined-access mock-ups',
      tasks:['Access-hatch entry','Corridor constraints','Marker and gauge views on mock pipework'],
      out:['Repeatable scenario definitions','Inspection evaluation records'],
      ex:'Example: GOV-DEMO-003 in the explorer below. Inspection platforms and specialist expertise would come from a qualified partner. Metari does not build field robots or operate hazardous test infrastructure.', scen:'inspection' }
  };
  var envBtns = $$('[data-env]'), envPanel = $('#envDetail');
  function showEnv(key, focusPanel){
    var e = ENV[key]; if (!e) return;
    envBtns.forEach(function(b){ var on = b.getAttribute('data-env') === key; b.setAttribute('aria-expanded', on); b.closest('.genv').classList.toggle('sel', on); });
    envPanel.innerHTML =
      '<div class="ed-head"><span class="k">' + esc(e.k) + '</span><h3>' + esc(e.h) + '</h3></div>' +
      '<div class="ed-cols"><div><b>Example tasks</b><ul>' + e.tasks.map(function(t){ return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' +
      '<div><b>Proposed outputs</b><ul>' + e.out.map(function(t){ return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' +
      '<div><b>How it would run</b><p>' + esc(e.ex) + '</p><button type="button" class="btn btn-sm" data-goscen="' + e.scen + '">Open in the explorer</button></div></div>';
    envPanel.hidden = false;
    if (focusPanel) envPanel.focus({preventScroll:true});
  }
  envBtns.forEach(function(b){ b.addEventListener('click', function(){ showEnv(b.getAttribute('data-env'), true); }); });
  document.addEventListener('click', function(ev){
    var t = ev.target.closest('[data-goscen]'); if (!t) return;
    setScenario(t.getAttribute('data-goscen'));
    var ex = $('#explorer'); if (ex) ex.scrollIntoView({behavior: RM ? 'auto' : 'smooth', block:'start'});
  });

  /* ---------- explorer ---------- */
  var KEYS = ['layout','object','clutter','lighting','assist'];
  var LETTER = {layout:'L', object:'O', clutter:'C', lighting:'I', assist:'A'};
  var STAGES = [
    {k:'req', t:'Requirement'},
    {k:'cfg', t:'Configured scenario'},
    {k:'cap', t:'Capture / test'},
    {k:'qa',  t:'Quality review'},
    {k:'pkg', t:'Evidence package'}
  ];
  var st = { sc:'restock', v:{layout:0, object:0, clutter:0, lighting:0, assist:0}, stage:-1, log:[] };
  var timer = null;

  function S(){ return D.SCENARIOS[st.sc]; }
  function cfgId(){ var s = S(); return 'CFG-' + s.code + '-' + KEYS.map(function(k){ return LETTER[k] + (st.v[k] + 1); }).join(''); }
  function heldOut(){ var s = S(); return st.v.layout === s.vars.layout.opts.length - 1; }
  function varText(k){ return S().vars[k].opts[st.v[k]][1]; }
  function summary(){ return KEYS.map(varText).join(', '); }
  function heldName(){ var o = S().vars.layout.opts; return o[o.length - 1][0]; }

  function checklist(){
    var s = S(), v = st.v, items = [];
    items.push('Requirement ' + reqId() + ' linked to ' + cfgId());
    items.push('Calibration and time sync checked on every fixed camera');
    items.push('Expert demonstrations reviewed and accepted before training use');
    if (heldOut()) items.push('Confirm no training demonstrations were recorded in this held-out configuration');
    else items.push('Confirm this configuration is excluded from the held-out set');
    if (v.clutter > 0) items.push('Clutter layout photographed before every trial');
    if (v.lighting > 0) items.push('Exposure check on fixed cameras for ' + varText('lighting'));
    if (st.sc === 'maintenance') items.push('Training equipment confirmed de-energized before each session');
    if (s.partner) items.push('Partner platform version and operator recorded per trial');
    var a = v.assist, alab = s.vars.assist.opts[a][0];
    if (st.sc === 'inspection') items.push('Every operator takeover logged with time and reason (' + alab.toLowerCase() + ')');
    else if (a > 0) items.push('Every ' + alab.toLowerCase() + ' intervention logged with time and reason');
    else items.push('Any human intervention ends the autonomous attempt and is logged');
    items.push('Robot hardware and model version recorded for every trial');
    items.push('Reviewer disposition recorded before delivery');
    return items;
  }
  function reqId(){ return 'REQ-' + S().code + '-01'; }

  function renderTabs(){
    var host = $('#xTabs');
    host.innerHTML = Object.keys(D.SCENARIOS).map(function(k){
      var s = D.SCENARIOS[k], on = k === st.sc;
      return '<button type="button" role="tab" id="tab-' + k + '" aria-controls="xRecord" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-sc="' + k + '">' +
        '<span class="t">' + esc(s.tab) + '</span>' + (s.partner ? '<span class="p">Partner-led concept</span>' : '<span class="p">' + esc(s.id) + '</span>') + '</button>';
    }).join('');
    $$('[role=tab]', host).forEach(function(b, i, all){
      b.addEventListener('click', function(){ setScenario(b.getAttribute('data-sc')); });
      b.addEventListener('keydown', function(e){
        var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!d) return; e.preventDefault();
        var n = all[(i + d + all.length) % all.length]; setScenario(n.getAttribute('data-sc')); $('#tab-' + n.getAttribute('data-sc')).focus();
      });
    });
  }

  function renderControls(){
    var s = S();
    $('#xVars').innerHTML = KEYS.map(function(k){
      var V = s.vars[k];
      return '<fieldset class="seg"><legend>' + esc(V.label) + '</legend><div class="opts">' +
        V.opts.map(function(o, i){
          var id = 'v-' + k + '-' + i;
          return '<input type="radio" name="v-' + k + '" id="' + id + '" value="' + i + '"' + (st.v[k] === i ? ' checked' : '') + '><label for="' + id + '">' + esc(o[0]) + (k === 'layout' && i === V.opts.length - 1 ? ' <small>held-out</small>' : '') + '</label>';
        }).join('') + '</div></fieldset>';
    }).join('');
    $$('#xVars input').forEach(function(inp){
      inp.addEventListener('change', function(){ st.v[inp.name.slice(2)] = +inp.value; stopRun(); st.stage = -1; st.log = []; renderRecord(); });
    });
  }

  function li(a){ return a.map(function(t){ return '<li>' + esc(t) + '</li>'; }).join(''); }

  function renderRecord(){
    var s = S(), ho = heldOut(), cid = cfgId();
    $('#xRecId').textContent = s.id;
    $('#xRecName').textContent = s.name;
    $('#xPartner').hidden = !s.partner;
    $('#xReq').innerHTML =
      '<dl class="spec"><div><dt>Requirement</dt><dd>' + esc(reqId()) + '</dd></div><div><dt>Task</dt><dd>' + esc(s.task) + '</dd></div></dl>' +
      '<b class="sub">Success conditions</b><ul class="ticks">' + li(s.success) + '</ul>' +
      '<b class="sub">Evaluation dimensions</b><div class="tags">' + s.dims.map(function(d){ return '<span>' + esc(d) + '</span>'; }).join('') + '</div>';
    $('#xEnvTxt').innerHTML =
      '<dl class="spec"><div><dt>Environment</dt><dd>' + esc(s.env) + '</dd></div>' +
      '<div><dt>Variations</dt><dd>' + esc(summary().charAt(0).toUpperCase() + summary().slice(1)) + '</dd></div>' +
      '<div><dt>Test config</dt><dd class="mono">' + esc(cid) + '</dd></div>' +
      '<div><dt>Assignment</dt><dd><span class="assign ' + (ho ? 'ho' : 'tr') + '">' + (ho ? 'Held-out evaluation' : 'Training') + '</span></dd></div></dl>' +
      '<p class="small">' + esc(heldName()) + ' configurations are reserved for held-out evaluation. They never appear in training demonstrations, so a result reflects the robot, not memorized conditions.</p>';
    $('#xCap').innerHTML = '<p class="small">' + esc(s.expert) + '</p><ul class="ticks">' + li(s.capture) + '</ul>';
    var a = s.vars.assist.opts[st.v.assist][0];
    $('#xTest').innerHTML = '<ul class="ticks">' + li(s.test.map(function(t){ return t.replace('see assistance mode', a); })) + '</ul>';
    var ck = checklist();
    $('#xChecks').innerHTML = ck.map(function(c){ return '<li><i aria-hidden="true"></i><span>' + esc(c) + '</span><em>Pending</em></li>'; }).join('');
    $('#xFields').innerHTML =
      '<div><dt>Program record</dt><dd class="mono">' + esc(s.id) + '</dd></div>' +
      '<div><dt>Test config</dt><dd class="mono">' + esc(cid) + '</dd></div>' +
      '<div><dt>Split</dt><dd>' + (ho ? 'Held-out evaluation' : 'Training') + '</dd></div>' +
      '<div><dt>Robot hardware</dt><dd>Recorded per trial · none recorded</dd></div>' +
      '<div><dt>Model version</dt><dd>Recorded per trial · none recorded</dd></div>' +
      '<div><dt>Results</dt><dd><span class="nm">Not measured</span></dd></div>' +
      '<div><dt>Reviewer disposition</dt><dd><span class="nm">Not reviewed</span></dd></div>';
    $('#xArtifacts').innerHTML = [
      ['Program specification', s.id + '-SPEC'],
      ['Training dataset manifest', ho ? 'Not applicable: held-out config' : s.id + '-DATA-' + cid.slice(4)],
      ['Evaluation report', s.id + '-EVAL'],
      ['Evidence index', s.id + '-INDEX']
    ].map(function(r){ return '<li><b>' + esc(r[0]) + '</b><span class="mono">' + esc(r[1]) + '</span><em>Not produced</em></li>'; }).join('');
    $('#xPlan').innerHTML = plan();
    $('#xPlanCap').textContent = 'Schematic of the proposed ' + s.tab.toLowerCase() + ' layout: ' + summary() + '.';
    renderTrail();
    var live = $('#xLive'); if (live) live.textContent = s.name + ', configuration ' + cid + ', ' + (ho ? 'held-out evaluation' : 'training') + '.';
  }

  function renderTrail(){
    var host = $('#xTrail');
    host.innerHTML = STAGES.map(function(g, i){
      var cls = i < st.stage ? 'done' : i === st.stage ? 'cur' : '';
      return '<li class="' + cls + '"><button type="button" data-stage="' + i + '" aria-current="' + (i === st.stage ? 'step' : 'false') + '"><span class="n">0' + (i + 1) + '</span>' + esc(g.t) + '</button></li>';
    }).join('');
    $$('button', host).forEach(function(b){ b.addEventListener('click', function(){ stopRun(); goStage(+b.getAttribute('data-stage')); }); });
    var log = $('#xLog');
    log.innerHTML = st.log.length ? st.log.map(function(e){ return '<li><span class="mono">' + esc(e[0]) + '</span><span>' + esc(e[1]) + '</span><em>Synthetic</em></li>'; }).join('')
      : '<li class="empty"><span>Select a stage or step through the trail. Events shown here are synthetic and generated in your browser.</span></li>';
    $$('.xpanel').forEach(function(p){ p.classList.toggle('hl', st.stage >= 0 && p.getAttribute('data-stage').split(' ').indexOf(STAGES[st.stage].k) > -1); });
  }

  function eventFor(i){
    var s = S(), ck = checklist();
    return [
      [reqId(), 'Requirement opened from ' + s.id + ' with ' + s.success.length + ' success conditions'],
      [cfgId(), 'Scenario configured: ' + summary() + (heldOut() ? '. Marked held-out' : '. Marked training')],
      ['T-001', 'Capture plan and test conditions attached. Trial defined, not run'],
      ['QA', 'Review checklist generated with ' + ck.length + ' items. Disposition: not reviewed'],
      ['PKG', 'Evidence package manifest drafted. Results: not measured']
    ][i];
  }
  function goStage(i){
    st.stage = i; st.log = [];
    for (var k = 0; k <= i; k++) st.log.push(eventFor(k));
    renderTrail();
  }
  function stopRun(){ if (timer) { clearInterval(timer); timer = null; } var b = $('#xRun'); if (b) { b.textContent = 'Step through the trail'; b.setAttribute('aria-pressed', 'false'); } }
  function run(){
    if (timer) { stopRun(); return; }
    var b = $('#xRun'); b.textContent = 'Pause'; b.setAttribute('aria-pressed', 'true');
    if (RM) { goStage(STAGES.length - 1); stopRun(); return; }
    var i = st.stage >= STAGES.length - 1 ? -1 : st.stage;
    timer = setInterval(function(){ i++; goStage(i); if (i >= STAGES.length - 1) stopRun(); }, 1100);
  }

  function setScenario(k){
    if (!D.SCENARIOS[k]) return;
    stopRun(); st.sc = k; st.v = {layout:0, object:0, clutter:0, lighting:0, assist:0}; st.stage = -1; st.log = [];
    renderTabs(); renderControls(); renderRecord();
  }

  function download(){
    var s = S(), out = {
      notice: 'Illustrative; not an actual customer deliverable. Generated in the browser from the Metari Government explorer. No program, trial or result exists.',
      program: s.id, name: s.name, requirement: reqId(), task: s.task,
      successConditions: s.success, environment: s.env,
      configuration: { id: cfgId(), split: heldOut() ? 'held-out evaluation' : 'training' },
      variables: KEYS.reduce(function(o, k){ o[s.vars[k].label] = s.vars[k].opts[st.v[k]][0]; return o; }, {}),
      expertDemonstration: s.expert, capturePlan: s.capture, testConditions: s.test,
      evaluationDimensions: s.dims, evidenceChecklist: checklist(),
      fields: { robotHardware: null, modelVersion: null, results: 'not measured', reviewerDisposition: 'not reviewed' },
      partnerLed: !!s.partner, generated: new Date().toISOString().slice(0, 10)
    };
    var blob = new Blob([JSON.stringify(out, null, 2)], {type:'application/json'});
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = s.id + '-illustrative-spec.json';
    document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ---------- schematic plan (SVG) ---------- */
  function plan(){
    var v = st.v, f = [];
    var c = {wall:'#3a3f48', fill:'#14171d', acc:'#2efea9', warn:'#f5c451', dim:'#9BA0AB', red:'#ff8a76'};
    function cam(x, y, r){ return '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ')"><rect x="-5" y="-4" width="10" height="8" rx="1.5" fill="#d6e0ff"/><path d="M5 -3 L13 -7 L13 7 L5 3Z" fill="#d6e0ff" opacity=".55"/></g>'; }
    function box(x, y){ return '<rect x="' + x + '" y="' + y + '" width="12" height="10" rx="1.5" fill="#6b6f78"/>'; }
    var clutterPts = [[150,96],[118,150],[176,160],[232,92],[250,170],[126,110]];
    if (st.sc === 'restock') {
      var dw = [44, 30, 44][v.layout], dy = v.layout === 2 ? 52 : 100;
      f.push('<rect x="20" y="40" width="360" height="160" fill="' + c.fill + '" stroke="' + c.wall + '" stroke-width="2"/>');
      f.push('<path d="M210 40 V' + dy + ' M210 ' + (dy + dw) + ' V200" stroke="' + c.wall + '" stroke-width="5"/>');
      f.push('<path d="M210 ' + dy + ' a' + dw + ' ' + dw + ' 0 0 1 ' + dw * .7 + ' ' + dw * .72 + '" fill="none" stroke="' + c.dim + '" stroke-dasharray="2 3"/>');
      // shelving: two bays, three shelves shown as bands
      for (var b = 0; b < 2; b++) for (var s2 = 0; s2 < 3; s2++) {
        var tgt = b === 1 && s2 === [1, 0, 2][v.object];
        f.push('<rect x="' + (322 + b * 26) + '" y="' + (72 + s2 * 34) + '" width="22" height="28" rx="2" fill="' + (tgt ? 'rgba(46,254,169,.25)' : '#262a32') + '" stroke="' + (tgt ? c.acc : c.wall) + '"/>');
      }
      f.push('<text x="333" y="64" class="pt">SHELVING</text>');
      f.push('<rect x="36" y="128" width="34" height="22" rx="3" fill="#4b4f58"/><text x="36" y="166" class="pt">CART</text>');
      f.push('<rect x="84" y="56" width="40" height="40" fill="none" stroke="' + c.warn + '" stroke-dasharray="4 3"/><circle cx="104" cy="76" r="9" fill="#e9ecef"/><text x="84" y="50" class="pt">ROBOT START</text>');
      f.push('<path d="M70 139 C130 140 180 ' + (dy + dw / 2) + ' 212 ' + (dy + dw / 2) + ' S300 ' + (86 + [1, 0, 2][v.object] * 34) + ' 344 ' + (86 + [1, 0, 2][v.object] * 34) + '" fill="none" stroke="' + c.acc + '" stroke-width="1.6" stroke-dasharray="5 4"/>');
      f.push('<rect x="28" y="176" width="160" height="18" fill="none" stroke="' + c.red + '" stroke-dasharray="3 3"/><text x="34" y="189" class="pt" fill="' + c.red + '">HUMAN ZONE · EVALUATOR</text>');
      for (var i = 0; i < [0, 3, 6][v.clutter]; i++) f.push(box(clutterPts[i][0], clutterPts[i][1]));
      f.push(cam(26, 46, 35) + cam(374, 46, 145) + cam(374, 196, 215));
    } else if (st.sc === 'maintenance') {
      var mir = v.layout === 2, pl = v.layout === 1, X = function(x){ return mir ? 400 - x : x; };
      f.push('<rect x="20" y="40" width="360" height="160" fill="' + c.fill + '" stroke="' + c.wall + '" stroke-width="2"/>');
      var bx0 = pl ? 150 : 70, px = pl ? 40 : 300;
      f.push('<rect x="' + Math.min(X(bx0), X(bx0 + 200)) + '" y="46" width="200" height="34" rx="3" fill="#3b3326" stroke="#6b5a3e"/>');
      var ti = [2, 7, 5][v.object];
      for (var t = 0; t < 10; t++) {
        var tg = t === ti, sim = v.object === 2 && (t === 4 || t === 6);
        f.push('<rect x="' + (X(bx0 + 8 + t * 19) - (mir ? 12 : 0)) + '" y="50" width="12" height="7" rx="1.5" fill="' + (tg ? c.acc : sim ? '#9aa1ad' : '#555b66') + '"/>');
      }
      f.push('<rect x="' + Math.min(X(px), X(px + 60)) + '" y="46" width="60" height="44" rx="3" fill="#262a32" stroke="' + c.wall + '"/><text x="' + (Math.min(X(px), X(px + 60)) + 8) + '" y="102" class="pt">PANEL</text>');
      var padX = pl ? 108 : 276; f.push('<rect x="' + (X(padX) - (mir ? 18 : 0)) + '" y="62" width="18" height="12" fill="none" stroke="' + c.acc + '" stroke-dasharray="3 2"/><text x="' + (X(padX) - (mir ? 18 : 0)) + '" y="88" class="pt" fill="' + c.acc + '">PAD</text>');
      var rx = X(200), tx = X(bx0 + 14 + ti * 19), pdx = X(padX + 9);
      f.push('<rect x="' + (rx - 20) + '" y="130" width="40" height="40" fill="none" stroke="' + c.warn + '" stroke-dasharray="4 3"/><circle cx="' + rx + '" cy="150" r="9" fill="#e9ecef"/><text x="' + (rx - 20) + '" y="182" class="pt">ROBOT START</text>');
      f.push('<path d="M' + rx + ' 141 C' + rx + ' 110 ' + tx + ' 100 ' + tx + ' 60 M' + tx + ' 60 C' + tx + ' 100 ' + pdx + ' 100 ' + pdx + ' 74" fill="none" stroke="' + c.acc + '" stroke-width="1.6" stroke-dasharray="5 4"/>');
      var hz = X(pl ? 300 : 40); f.push('<rect x="' + (mir ? hz - 80 : hz) + '" y="96" width="80" height="34" fill="none" stroke="' + c.red + '" stroke-dasharray="3 3"/><text x="' + ((mir ? hz - 80 : hz) + 6) + '" y="124" class="pt" fill="' + c.red + '">TECHNICIAN</text>');
      var bc = [20, 70, 110, 150, 40, 130];
      for (var j = 0; j < [0, 3, 6][v.clutter]; j++) f.push('<rect x="' + (X(bx0 + bc[j]) - (mir ? 10 : 0)) + '" y="68" width="10" height="7" rx="1" fill="#8a8f99"/>');
      f.push('<text x="26" y="214" class="pt">' + ['BENCH LAYOUT A', 'LAYOUT A, PANEL LEFT', 'LAYOUT B, MIRRORED'][v.layout] + ' · TARGET TOOL AND PAD IN GREEN</text>');
      f.push(cam(26, 194, -35) + cam(374, 194, 215));
    } else {
      var turn = v.layout === 2, gap = [64, 38, 38][v.layout];
      f.push('<rect x="20" y="40" width="360" height="160" fill="' + c.fill + '" stroke="' + c.wall + '" stroke-width="2"/>');
      var mk, hatch;
      if (!turn) {
        f.push('<rect x="30" y="' + (120 - gap / 2 - 14) + '" width="282" height="14" fill="#5a4a32"/><rect x="30" y="' + (120 + gap / 2) + '" width="282" height="14" fill="#5a4a32"/>');
        f.push('<path d="M54 120 H306" stroke="' + c.acc + '" stroke-width="1.6" stroke-dasharray="5 4"/>');
        f.push('<path d="M326 120 H372 M344 52 V190" stroke="#7d8591" stroke-width="5"/>');
        hatch = '<rect x="312" y="102" width="12" height="36" fill="#8a8f99"/><text x="300" y="96" class="pt">HATCH</text>';
        mk = [[[344,66],[362,120],[344,176]], [[330,64],[362,104],[336,180]], [[358,72],[332,140],[364,176]]][v.object];
      } else {
        f.push('<path d="M30 76 H236 V196" fill="none" stroke="#5a4a32" stroke-width="12"/><path d="M30 142 H178 V196" fill="none" stroke="#5a4a32" stroke-width="12"/>');
        f.push('<path d="M54 109 H207 V172 H238" fill="none" stroke="' + c.acc + '" stroke-width="1.6" stroke-dasharray="5 4"/>');
        f.push('<path d="M250 172 H372 M300 120 V196 M250 140 H372" stroke="#7d8591" stroke-width="5"/>');
        hatch = '<rect x="230" y="156" width="12" height="32" fill="#8a8f99"/><text x="246" y="110" class="pt">HATCH, AFTER TURN</text>';
        mk = [[[270,156],[326,184],[356,128]], [[262,128],[318,160],[356,184]], [[284,184],[340,140],[362,170]]][v.object];
      }
      f.push(hatch);
      mk.forEach(function(p, n){ f.push('<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8" fill="#08090c" stroke="' + c.acc + '"/><text x="' + (p[0] - 3) + '" y="' + (p[1] + 3.5) + '" class="pt" fill="' + c.acc + '">' + (n + 1) + '</text>'); });
      f.push('<rect x="34" y="111" width="18" height="18" rx="3" fill="#e9ecef"/><text x="30" y="' + (turn ? 168 : 160) + '" class="pt">PLATFORM</text>');
      if (v.clutter > 0) f.push('<path d="M80 ' + (turn ? 100 : 112) + ' C110 130 140 100 170 ' + (turn ? 116 : 126) + '" stroke="#c9a14a" stroke-width="2.5" fill="none"/>');
      if (v.clutter > 1) f.push(box(120, turn ? 100 : 116) + box(150, turn ? 112 : 110));
      f.push('<text x="26" y="214" class="pt">NONHAZARDOUS MOCK-UP · MARKERS IN GREEN · PARTNER PLATFORM</text>');
      f.push(cam(26, 46, 35) + cam(374, 46, 145));
    }
    // lighting effect per scenario: 'none' | 'dim' | 'glare' | 'spot' (dark room, one pool of light)
    var FX = {restock:['none','dim','glare'], maintenance:['spot','none','dim'], inspection:['none','dim','spot']}[st.sc][st.v.lighting];
    var spot = st.sc === 'inspection' ? [43, 120] : (function(){ var m = st.v.layout === 2; return [m ? 230 : 170, 64]; })();
    if (FX === 'dim') f.push('<rect x="20" y="40" width="360" height="160" fill="#000" opacity=".38" pointer-events="none"/>');
    if (FX === 'glare') f.push('<circle cx="345" cy="120" r="64" fill="url(#glare)" pointer-events="none"/>');
    if (FX === 'spot') f.push('<rect x="20" y="40" width="360" height="160" fill="#000" opacity=".3" pointer-events="none"/><circle cx="' + spot[0] + '" cy="' + spot[1] + '" r="58" fill="url(#glare)" opacity=".7" pointer-events="none"/>');
    return '<defs><radialGradient id="glare"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>' + f.join('');
  }

  function initExplorer(){
    if (!$('#xTabs')) return;
    renderTabs(); renderControls(); renderRecord();
    $('#xRun').addEventListener('click', run);
    $('#xReset').addEventListener('click', function(){ stopRun(); st.stage = -1; st.log = []; renderTrail(); });
    $('#xDownload').addEventListener('click', download);
  }

  /* ---------- sources ---------- */
  function renderSources(){
    var host = $('#sources'); if (!host || !D.SOURCES) return;
    host.innerHTML = D.SOURCES.map(function(s){
      return '<article class="src reveal in"><span class="k">' + esc(s.org) + '</span><h3><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.title) + '</a></h3>' +
        '<p>' + esc(s.note) + '</p>' +
        (s.related ? '<p class="rel">Related: <a href="' + esc(s.related.url) + '" target="_blank" rel="noopener">' + esc(s.related.title) + '</a> (' + esc(s.related.sourceDate) + ')</p>' : '') +
        '<dl><div><dt>Type</dt><dd>' + esc(s.kind) + '</dd></div><div><dt>Source date</dt><dd>' + esc(s.sourceDate) + '</dd></div><div><dt>Checked</dt><dd>' + esc(s.checked) + '</dd></div></dl></article>';
    }).join('');
  }

  /* ---------- inquiry form (Web3Forms, the same service as the homepage) ---------- */
  function initForm(){
    var f = $('#govForm'); if (!f) return; var out = $('#gfStatus'), btn = $('button[type=submit]', f);
    $$('[data-interest]').forEach(function(a){ a.addEventListener('click', function(){ var s = $('#gfInterest'); if (s) s.value = a.getAttribute('data-interest'); }); });
    f.addEventListener('submit', function(e){
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      out.className = 'gf-status'; out.textContent = 'Sending…'; btn.disabled = true;
      var data = {}; new FormData(f).forEach(function(v, k){ data[k] = v; });
      fetch('https://api.web3forms.com/submit', {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body:JSON.stringify(data)})
        .then(function(r){ return r.json(); })
        .then(function(j){
          if (j && j.success) { f.reset(); out.className = 'gf-status ok'; out.textContent = 'Thank you. Your inquiry was sent. We will reply from steve@metari.io.'; }
          else { out.className = 'gf-status err'; out.innerHTML = 'The form could not be sent. Please email <a href="mailto:steve@metari.io?subject=Metari%20Government%20inquiry">steve@metari.io</a> instead.'; }
        })
        .catch(function(){ out.className = 'gf-status err'; out.innerHTML = 'Network error. Please email <a href="mailto:steve@metari.io?subject=Metari%20Government%20inquiry">steve@metari.io</a> instead.'; })
        .then(function(){ btn.disabled = false; });
    });
  }

  renderSources(); initExplorer(); initForm();
  window.GOV_UI = { setScenario: setScenario };
})();
