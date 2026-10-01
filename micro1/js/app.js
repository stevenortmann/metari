/* Metari x micro1 partnership page controller. */
(function () {
  'use strict';
  var M = window.MetariOrder, V = window.MetariViews, esc = V.esc;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var KEY = 'metari.micro1.state';
  var prog = null, st = null, ctl = null, scene = null, sceneLoading = false;
  var ui = { layer: 'coverage', cameras: false, selected: null, evView: 'fixed_side_rgb', evItem: null, lastSceneKey: '' };

  var APPROVALS = [['protocol', 'Protocol'], ['geographic_eligibility', 'Geographic eligibility'], ['site_access', 'Site access'], ['operator_consent', 'Operator consent'], ['safety_review', 'Safety review'], ['data_rights', 'Data rights'], ['commercial_scope', 'Commercial scope']];
  var SCOPE = [
    { id: 'guest', tab: 'Guest rooms', img: '/1x/img/swap_human.jpg', robot: '/micro1/img/guest-room-robot.jpg', alt: 'Concept rendering: housekeeper in a head-mounted capture rig places towels on a bed in an instrumented guest room', cap: 'Guest-room suite', sub: 'Linen placement', tag: 'Pilot scope', task: 'TASK-LINEN' },
    { id: 'laundry', tab: 'Laundry & linen', img: '/micro1/img/evidence/laundry-overview.jpg', alt: 'Concept rendering: laundry attendant folding towels at a steel table in front of linen shelving', cap: 'Laundry & linen', sub: 'Sorting and folding', tag: 'Pilot scope', task: 'TASK-LAUNDRY' },
    { id: 'boh', tab: 'Service & supply', img: '/micro1/img/evidence/cart-overview.jpg', alt: 'Concept rendering: houseperson loading towels and amenities from labelled shelving onto a service cart', cap: 'Service & supply', sub: 'Cart and shelf replenishment', tag: 'Pilot scope', task: 'TASK-CART' },
    { id: 'kitchen', tab: 'Kitchen', img: '/micro1/img/kitchen.jpg', alt: 'Concept rendering: two chefs plating at a hotel kitchen pass, one wearing a head-mounted camera, with ceiling cameras', cap: 'Commercial kitchen', sub: 'Later order', tag: 'Expansion example', exp: true,
      example: 'Plating and pass handoff, dish-station loading, cold-storage restock.', evidence: 'Tool and hand contact at working height, heat and sharp-tool zones marked; separate safety protocol before any capture.', reset: 'Station layout, ticket load, tool set, lighting.' },
    { id: 'senior', tab: 'Accessible living (mock)', img: '/micro1/img/accessible-living.jpg', alt: 'Concept rendering: staff member making a railed bed in a mock accessible-living suite with a walking frame and ceiling camera', cap: 'Accessible living (mock)', sub: 'Non-clinical, no residents', tag: 'Expansion example', exp: true,
      example: 'Bed-making with rails, mobility-aid placement, room tidy between occupants.', evidence: 'Same three-view profile. No residents, patients or care tasks; staff actors only under a capture agreement.', reset: 'Furniture layout, aids present, lighting, clutter.' }
  ];

  function persist() { try { sessionStorage.setItem(KEY, M.encode(st)); } catch (e) { } }
  function restore() {
    var q = new URLSearchParams(location.search).get('s');
    if (q) return M.decode(q, prog);
    try { var s = sessionStorage.getItem(KEY); if (s) return M.decode(s, prog); } catch (e) { }
    return M.initialState();
  }

  /* ------------------------------------------------------------ render */
  function render(msg) {
    if (!prog) return;
    var c = M.counts(prog, st), pi = M.phaseIndex(st.phase);
    $('#phase').textContent = M.PHASE_LABEL[st.phase] + (ctl && ctl.running ? '' : (st.phase === 'CAPTURING' && st.gate !== 'flagged' && st.gate !== 'inspected' ? ' (paused)' : ''));
    $('#clock').textContent = M.simClock(prog, st.cursor) + ' (sim)';
    $('#bar').style.width = (c.progress * 100).toFixed(1) + '%';
    $('#metrics').innerHTML = V.metrics(prog, st);

    // issues + approvals
    var iss = M.issues(st);
    $('#issues').innerHTML = iss.map(function (i) { return '<li class="' + i.level + '"><b>' + (i.level === 'block' ? 'Blocked' : 'Flagged') + ' · ' + esc(i.code) + '</b>' + esc(i.text) + '</li>'; }).join('');
    $('#approvals').innerHTML = APPROVALS.map(function (a) { return '<li><span>' + a[1] + '</span><span class="st' + (st.assumed ? ' ok' : '') + '">' + (st.assumed ? 'Assumed (demo)' : 'Unconfirmed') + '</span></li>'; }).join('');
    var editable = pi <= 1;
    $('#profile').value = st.profile; $('#location').value = st.location;
    $('#profile').disabled = !editable; $('#location').disabled = !editable;
    $('#guided').checked = st.guided; $('#guided').disabled = st.cursor > prog.firstReject;

    // primary button
    var b = $('#primary'), label = '', dis = false;
    if (st.phase === 'DRAFT') label = 'Submit brief locally';
    else if (st.phase === 'NEEDS_CONFIRMATION') { label = 'Apply assumed demo approvals'; dis = M.blocked(st); }
    else if (st.phase === 'DEMO_APPROVED' || st.phase === 'CONFIGURED') { label = ctl.running ? 'Configuring' : 'Start collection'; dis = ctl.running; }
    else if (st.phase === 'CAPTURING') {
      if (st.gate === 'flagged' || st.gate === 'inspected') label = 'Review flagged sample';
      else { label = ctl.running ? 'Collecting' : 'Resume collection'; dis = ctl.running; }
    }
    else if (st.phase === 'QA_REVIEW') { label = ctl.running ? 'Reconciling' : 'Finish QA'; dis = ctl.running; }
    else if (st.phase === 'READY_FOR_DELIVERY') label = 'Close demo';
    else label = 'Replay';
    b.textContent = label; b.disabled = dis;
    var tb = $('#top-run'); tb.textContent = st.phase === 'DRAFT' || st.phase === 'NEEDS_CONFIRMATION' ? 'Run the order' : label; tb.disabled = dis;
    var cta = $('#scene-cta'), gateOpen = st.gate === 'flagged' || st.gate === 'inspected';
    if ((st.phase === 'DRAFT' || st.phase === 'NEEDS_CONFIRMATION') && !M.blocked(st)) { cta.hidden = false; cta.innerHTML = '<button class="cta-play" type="button" data-act="autorun"><span class="tri" aria-hidden="true"></span><span><b>Run the simulated order</b><small>Fictional order M1-DEMO-001 &middot; runs in your browser</small></span></button>'; }
    else if (gateOpen) { cta.hidden = false; cta.innerHTML = '<button class="cta-play warn" type="button" data-act="inspect"><span class="tri" aria-hidden="true"></span><span><b>Review the flagged sample</b><small>' + esc(prog.seq[prog.firstReject].id) + ' failed preflight' + (ui.gateLeft > 0 ? ' &middot; auto-continues in ' + ui.gateLeft + 's' : '') + '</small></span></button>'; }
    else if (st.phase === 'CAPTURING' && !ctl.running) { cta.hidden = false; cta.innerHTML = '<button class="cta-play" type="button" data-act="autorun"><span class="tri" aria-hidden="true"></span><span><b>Resume collection</b><small>' + M.counts(prog, st).captured + ' of ' + prog.total + ' attempts captured</small></span></button>'; }
    else { cta.hidden = true; cta.innerHTML = ''; }
    armGate(gateOpen);
    var p = $('#pause'); p.disabled = !(st.phase === 'CAPTURING' || st.phase === 'QA_REVIEW' || st.phase === 'DEMO_APPROVED' || st.phase === 'CONFIGURED') || st.gate === 'flagged' || st.gate === 'inspected';
    p.textContent = ctl.running ? 'Pause' : 'Resume';
    if (!ctl.running && p.textContent === 'Resume' && st.phase !== 'CAPTURING' && st.phase !== 'QA_REVIEW') p.disabled = true;
    $('#speed').setAttribute('aria-pressed', String(ctl.speed > 1));

    // gate
    var g = $('#gate');
    if (st.gate === 'flagged' || st.gate === 'inspected') {
      var it = prog.seq[prog.firstReject];
      g.innerHTML = '<div class="gate"><span class="mono">Human decision required</span><p><b>' + esc(it.id) + '</b> failed preflight: hand/object contact not visible in the fixed side view. This is a capture defect, not evidence about any robot.' + (ui.gateLeft > 0 ? ' Auto-continues in ' + ui.gateLeft + 's.' : '') + '</p><div class="row"><button class="btn sm" type="button" data-act="inspect">Inspect evidence</button>' + (st.gate === 'inspected' ? '<button class="btn sm primary" type="button" data-act="reset-request">Request reset and recapture</button>' : '') + '</div></div>';
    } else g.innerHTML = '';

    // trace
    $('#trace').innerHTML = V.traceRows(M.trace(prog, st, 14)).replace(/<li class="tr ([a-z]+)">([\s\S]*?)<\/li>/g, function (m, k, body) {
      var ref = /<dt>Ref<\/dt><dd class="mono">([^<]+)<\/dd>/.exec(body);
      return '<li class="tr ' + k + '">' + body + (ref && prog.byId[ref[1]] ? '<button class="btn sm ghost" type="button" data-ev="' + ref[1] + '" style="margin-top:6px">View evidence</button>' : '') + '</li>';
    });

    // room chips + dock + legend
    var alloc = M.allocatedRooms(st);
    $('#room-chips').innerHTML = ['guest', 'laundry', 'boh'].map(function (r) {
      var t = V.taskForRoom(r), pct = Math.round((c.byRoom[r] || 0) * 100);
      return '<button class="chip" type="button" data-room="' + r + '" aria-pressed="' + (ui.selected === r) + '">' + esc({guest:'Guest-room suites',laundry:'Laundry & linen',boh:'Service & supply'}[r]) + (alloc.length ? ' · ' + pct + '%' : '') + '</button>';
    }).join('');
    $('#dock').innerHTML = V.roomInfo(prog, st, ui.selected);
    $('#legend').innerHTML = ui.layer === 'off' ? '<span>No overlay</span>' : ui.layer === 'allocation' ? '<span><i class="sw"></i>Allocated to this order (simulated). Other rooms carry no overlay.</span>' : '<span>Accepted coverage, simulated:</span><span class="ramp" aria-hidden="true"></span><span>0% to 100% of the room\'s accepted quota. Not temperature, activity or success rate.</span>';
    $('#task-chips').innerHTML = Object.keys(M.TASKS).map(function (t) { var r = M.ZONES[M.TASKS[t].zone].room; return '<button class="chip" type="button" data-room="' + r + '" aria-pressed="' + (ui.selected === r) + '">' + esc(M.TASKS[t].name) + '</button>'; }).join('');

    renderEval();
    $('#open-ws').href = '/micro1/command-center/?s=' + encodeURIComponent(M.encode(st)) + (ui.selected ? '&room=' + ui.selected : '');
    if (msg) $('#status').textContent = msg;
    else if (!c.reconciles) $('#status').textContent = 'Reconciliation error.';

    if (scene && scene.activity) {
      var cur = M.current(prog, st), roomsAct = {};
      if (alloc.length) ['guest', 'laundry', 'boh'].forEach(function (r) { var t = V.taskForRoom(r); roomsAct[r] = { text: c.byTask[t].accepted + '/' + c.byTask[t].target, active: ctl.running && st.phase === 'CAPTURING' && cur && cur.room === r }; });
      var ev = null;
      if (st.cursor > (ui.lastCursor || 0) && st.phase === 'CAPTURING') {
        var pick = null;
        for (var i = ui.lastCursor || 0; i < st.cursor; i++) { var it = prog.seq[i]; if (!pick || it.disp === 'rejected' || (it.disp === 'held_for_review' && pick.disp === 'accepted')) pick = it; }
        var now = Date.now();
        if (pick && (pick.disp !== 'accepted' || now - (ui.lastChip || 0) > 380)) {
          ui.lastChip = now;
          ev = { room: pick.room, cls: pick.disp === 'accepted' ? 'ok' : pick.disp === 'rejected' ? 'bad' : 'hold', text: pick.disp === 'accepted' ? (pick.recaptureOf ? '↻ recapture accepted' : '+1 accepted') : pick.disp === 'rejected' ? '✕ capture defect' : '◐ held for review' };
        }
      }
      ui.lastCursor = st.cursor;
      scene.activity(roomsAct, ev);
    }
    var key = st.phase + '|' + c.accepted + '|' + ui.layer + '|' + ui.cameras;
    if (scene && key !== ui.lastSceneKey) { ui.lastSceneKey = key; scene.refresh(); }
    persist();
  }

  function renderEval() {
    var box = $('#eval-box'), pi = M.phaseIndex(st.phase), E = M.evaluationScenario();
    if (pi < M.phaseIndex('READY_FOR_DELIVERY')) {
      box.innerHTML = '<span class="mono muted">Try Loop B</span><p style="margin:8px 0 0">The capability-gap scenario opens once the fictional order is ready for agreed delivery. Run it in the console above, or fast-forward.</p><div class="row"><button class="btn sm" type="button" data-act="ff"' + (M.blocked(st) ? ' disabled' : '') + '>Fast-forward the order</button></div>' + (M.blocked(st) ? '<p class="small muted" style="margin:8px 0 0">Blocked: the selected capture profile is not available. Change it in the console first.</p>' : '');
      return;
    }
    var h = '<span class="mono" style="color:var(--amber)">Loop B &middot; fictional scenario</span>';
    if (st.evalState === 'none') h += '<p style="margin:8px 0 0">Import a fictional evaluation finding from a model owner. It is kept apart from the capture QA you just watched.</p><div class="row"><button class="btn sm primary" type="button" data-act="import">Import fictional finding</button></div>';
    else {
      h += '<h3 style="margin-top:8px;color:var(--text)">' + esc(E.finding.id) + ': capability gap</h3><p class="muted">' + esc(E.finding.summary) + '</p><p class="small" style="color:var(--sand)">' + esc(E.finding.not) + '</p>';
      if (st.evalState === 'imported') h += '<div class="row"><button class="btn sm primary" type="button" data-act="propose">Draft a follow-up brief</button></div>';
      else h += '<dl class="kv" style="margin-top:12px"><dt>Proposed order</dt><dd class="mono">' + esc(E.brief.order_id) + ' · ' + esc(E.brief.status) + '</dd><dt>Task</dt><dd>' + esc(E.brief.task) + '</dd><dt>Variants</dt><dd>' + esc(E.brief.variants) + '</dd><dt>Evaluation</dt><dd>' + esc(E.brief.evaluation) + '</dd><dt>Approvals</dt><dd>' + E.brief.approvals.map(esc).join(', ') + '</dd></dl><div class="row"><button class="btn sm" type="button" data-act="save-followup">Save follow-up brief (.json)</button></div>';
    }
    box.innerHTML = h;
  }

  /* ------------------------------------------------------------ actions */
  function doAct(a) {
    var r = M.act(prog, st, a); render(r.msg); return r.ok;
  }
  // Keep the demo alive: if nobody acts on the review gate, a rule-based reviewer continues it.
  var gateTimer = 0;
  function armGate(open) {
    if (!open || ui.gateHeld) { if (gateTimer && !open) { clearInterval(gateTimer); gateTimer = 0; ui.gateLeft = 0; } return; }
    if (gateTimer) return;
    ui.gateLeft = 12;
    gateTimer = setInterval(function () {
      if (document.hidden) return;
      ui.gateLeft--;
      if (ui.gateLeft <= 0) {
        clearInterval(gateTimer); gateTimer = 0;
        if (st.gate === 'flagged' || st.gate === 'inspected') { M.act(prog, st, 'request_reset'); ctl.play(true); render('No reviewer response, so the demo\'s rule-based reviewer requested a reset and recapture. Use Replay to try the review yourself.'); }
      } else render();
    }, 1000);
  }
  function holdGate() { ui.gateHeld = true; if (gateTimer) { clearInterval(gateTimer); gateTimer = 0; } ui.gateLeft = 0; }
  function autoRun(auto) {
    if (M.blocked(st)) { render('Blocked: change the capture profile to the fixture profile first.'); return; }
    if (st.phase === 'DRAFT') M.act(prog, st, 'submit');
    if (st.phase === 'NEEDS_CONFIRMATION') M.act(prog, st, 'assume');
    if (st.phase === 'DEMO_CLOSED' || st.phase === 'READY_FOR_DELIVERY') return;
    if (st.gate === 'flagged' || st.gate === 'inspected') return render();
    ctl.play(true);
    render(auto ? 'Demo started automatically. Approvals are assumed for this fictional order only; nothing leaves your browser.' : 'Running. Approvals are assumed for this fictional order only; nothing leaves your browser.');
  }
  function primary() {
    switch (st.phase) {
      case 'DRAFT': doAct('submit'); break;
      case 'NEEDS_CONFIRMATION': if (doAct('assume')) ctl.play(true); break;
      case 'DEMO_APPROVED': case 'CONFIGURED': ctl.play(true); break;
      case 'CAPTURING': if (st.gate === 'flagged' || st.gate === 'inspected') { holdGate(); openEvidence(prog.seq[prog.firstReject], true); } else ctl.play(true); break;
      case 'QA_REVIEW': ctl.play(true); break;
      case 'READY_FOR_DELIVERY': doAct('close'); break;
      case 'DEMO_CLOSED': replay(); break;
    }
  }
  function replay() {
    ctl.reset(); ui.gateHeld = false; M.act(prog, st, 'submit');
    if (!M.blocked(st) && M.act(prog, st, 'assume').ok) { ctl.play(true); render('Replaying. The assumed demo approvals were re-applied for this fictional order.'); }
    else render('Replay stopped at confirmation: resolve the blocked prerequisite first.');
  }
  function fastForward() {
    if (M.blocked(st)) return render('Blocked: change the capture profile first.');
    ctl.pause();
    if (st.phase === 'DRAFT') M.act(prog, st, 'submit');
    if (st.phase === 'NEEDS_CONFIRMATION') M.act(prog, st, 'assume');
    if (st.phase === 'DEMO_APPROVED') M.act(prog, st, 'configure');
    if (st.phase === 'CONFIGURED') M.act(prog, st, 'start');
    if (st.gate === 'flagged' || st.gate === 'inspected') st.gate = 'reset_requested';
    var guided = st.guided; st.guided = false;
    while (st.phase === 'CAPTURING') M.advance(prog, st, 500);
    st.guided = guided;
    M.finishQA(prog, st);
    render('Fast-forwarded to ready for agreed delivery. Counts come from the fixture records.');
  }

  function openEvidence(item, gate) {
    if (!item) return;
    ui.evItem = item; ui.evView = item.disp === 'rejected' ? 'fixed_side_rgb' : 'fixed_overview_rgb';
    if (gate && st.gate === 'flagged') M.act(prog, st, 'inspect');
    drawEvidence(gate);
    var d = $('#ev-dialog'); if (!d.open) { if (d.showModal) d.showModal(); else d.setAttribute('open', ''); }
    render(gate ? 'Evidence opened for ' + item.id + '.' : null);
  }
  function drawEvidence(gate) {
    var it = ui.evItem;
    $('#ev-title').textContent = 'Evidence · ' + it.id;
    $('#ev-body').innerHTML = V.evidence(prog, st, it, ui.evView);
    var isGate = it.idx === prog.firstReject && (st.gate === 'inspected' || st.gate === 'flagged');
    $('#ev-foot').innerHTML = (isGate ? '<button class="btn primary sm" type="button" data-act="reset-request">Request reset and recapture</button>' : '') + '<button class="btn sm" type="button" data-close>Close</button>';
  }
  function closeDialog() { var d = $('#ev-dialog'); if (d.open) { if (d.close) d.close(); else d.removeAttribute('open'); } }

  function selectRoom(id, focus) {
    ui.selected = id; if (scene) scene.select(id, focus); render();
  }

  /* ------------------------------------------------------------ scene (lazy) */
  function loadScript(src) { return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = function () { rej(new Error('Failed to load ' + src)); }; document.head.appendChild(s); }); }
  function mountScene() {
    if (scene || sceneLoading) return; sceneLoading = true;
    loadScript('/micro1/js/plans.js').then(function () { return loadScript('/micro1/js/architecture.js'); }).then(function () { return loadScript('/micro1/js/scene.js'); }).then(function () {
      scene = window.MetariScene.mount($('#scene'), {
        getState: function () { var c = M.counts(prog, st); return { allocated: M.allocatedRooms(st), coverage: c.byRoom, layer: ui.layer, cameras: ui.cameras, paths: false }; },
        onPick: function (id) { ui.selected = id; render(); }
      });
      if (scene.fallback) $('#plan2d').setAttribute('aria-pressed', 'true');
      if (ui.selected) scene.select(ui.selected, false);
    }).catch(function (e) { console.error(e); $('#scene').innerHTML = '<p class="scene-note mono" style="padding:14px">The spatial view could not load. The order, trace and evidence remain available.</p>'; });
  }

  /* ------------------------------------------------------------ gallery */
  function renderScope(id) {
    var s = SCOPE.filter(function (x) { return x.id === id; })[0] || SCOPE[0];
    $('#scope-tabs').innerHTML = SCOPE.map(function (x) { return '<button class="chip" role="tab" type="button" data-scope="' + x.id + '" aria-selected="' + (x.id === s.id) + '" aria-pressed="' + (x.id === s.id) + '"' + (x.id === s.id ? '' : ' tabindex="-1"') + '>' + esc(x.tab) + '</button>'; }).join('');
    var T = s.task ? M.TASKS[s.task] : null;
    var fig = s.robot
      ? '<figure><div class="reveal" id="reveal" style="--p:' + (ui.revealP || 50) + '%"><img src="' + s.robot + '" alt="The same guest room and camera view with an illustrative humanoid robot placing the folded towels" loading="lazy"><div class="rv-top"><img src="' + s.img + '" alt="' + esc(s.alt) + '"></div><div class="rv-line" aria-hidden="true"><span class="rv-grip"></span></div><span class="rv-hint mono">Slide to compare</span><span class="rv-tag l mono">Human capture</span><span class="rv-tag r mono">Humanoid trial</span><input class="rv-range" id="rv-range" type="range" min="0" max="100" value="' + (ui.revealP || 50) + '" step="0.1" aria-label="Drag to compare the human demonstration with a humanoid attempting the same task in the same room"></div><figcaption><b>Towel placement &middot; same room, same frame</b> Human demonstration and humanoid trial, one calibrated view &middot; concept rendering, illustrative robot</figcaption></figure>'
      : '<figure><img src="' + s.img + '" alt="' + esc(s.alt) + '" loading="lazy"><figcaption><b>' + esc(s.cap) + '</b> ' + esc(s.sub) + ' &middot; concept rendering</figcaption></figure>';
    $('#scope-panel').innerHTML = fig +
      '<div class="scope-copy"><span class="tag mono' + (s.exp ? ' exp' : '') + '">' + esc(s.tag) + '</span><h3>' + esc(T ? T.name : s.cap) + '</h3>' +
      '<dl><dt>Example task</dt><dd>' + esc(T ? T.steps.join(', then ') + '.' : s.example) + '</dd>' +
      '<dt>Required evidence</dt><dd>' + esc(T ? T.evidence : s.evidence) + '</dd>' +
      '<dt>Reset variables</dt><dd>' + (T ? T.reset.map(esc).join('<br>') : esc(s.reset)) + '</dd>' +
      '<dt>Operator</dt><dd>' + esc(T ? T.qualification : 'Scoped with the order; staff actors only') + '</dd></dl>' +
      (s.exp ? '<p class="small muted" style="margin-top:14px">Planned expansion example, not asserted buyer demand. Not allocated to the fictional order, so it carries no overlay in the console.</p>' : '<p class="small muted" style="margin-top:14px">Part of the fictional order M1-DEMO-001. Selected in the console above.</p>') + '</div>';
  }

  /* ------------------------------------------------------------ events */
  function bind() {
    document.addEventListener('input', function (e) { if (e.target.id !== 'rv-range') return; ui.revealP = +e.target.value; var r = $('#reveal'); r.style.setProperty('--p', ui.revealP + '%'); r.classList.add('used'); });
    $('#primary').addEventListener('click', primary);
    $('#top-run').addEventListener('click', function () { if (st.phase === 'DRAFT' || st.phase === 'NEEDS_CONFIRMATION') autoRun(false); else primary(); });
    $('#pause').addEventListener('click', function () { if (ctl.running) ctl.pause(); else ctl.play(true); });
    $('#reset').addEventListener('click', function () { ui.gateHeld = false; closeDialog(); ctl.reset(); ui.selected = null; if (scene) scene.reset(); render(); });
    $('#replay').addEventListener('click', function () { closeDialog(); replay(); });
    $('#speed').addEventListener('click', function () { ctl.speed = ctl.speed > 1 ? 1 : 4; render(ctl.speed > 1 ? 'Fast mode: more attempts per tick. Counts still come from the fixture.' : 'Normal speed.'); });
    $('#guided').addEventListener('change', function (e) { st.guided = e.target.checked; render(st.guided ? 'Guided review on: the run pauses at the first flagged sample.' : 'Guided review off: reviewer decisions are rule-based in this demo.'); });
    $('#profile').addEventListener('change', function (e) { st.profile = e.target.value; render(M.blocked(st) ? 'Blocked: that modality is not available in this capture profile.' : 'Capture profile set.'); });
    $('#location').addEventListener('change', function (e) { st.location = e.target.value; render(); });
    document.addEventListener('click', function (e) {
      var t = e.target.closest('button,[data-close]'); if (!t) return;
      if (t.hasAttribute('data-close')) return closeDialog();
      if (t.dataset.room) return selectRoom(t.dataset.room, true);
      if (t.dataset.ev) return openEvidence(prog.byId[t.dataset.ev], false);
      if (t.dataset.view && t.closest('.ev-tabs')) { ui.evView = t.dataset.view; drawEvidence(); var nb = $('.ev-tabs [data-view="' + ui.evView + '"]'); nb && nb.focus(); return; }
      if (t.dataset.floor) { $$('[data-floor]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === t)); }); if (scene) scene.floor(t.dataset.floor === 'all' ? 'all' : +t.dataset.floor); return; }
      if (t.dataset.view && t.closest('#scene-bar')) { if (!scene) return; var v = t.dataset.view; if (v === 'left') scene.rotate(-1); if (v === 'right') scene.rotate(1); if (v === 'in') scene.zoom(1); if (v === 'out') scene.zoom(-1); if (v === 'reset') { scene.reset(); ui.selected = null; $$('[data-floor]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.floor === 'all')); }); $('#explode').setAttribute('aria-pressed', 'true'); render(); } return; }
      if (t.dataset.scope) { renderScope(t.dataset.scope); selectRoom(t.dataset.scope, true); var nt = $('[data-scope="' + t.dataset.scope + '"]'); nt && nt.focus(); return; }
      var a = t.dataset.act;
      if (a === 'autorun') return autoRun(false);
      if (a === 'inspect') { holdGate(); return openEvidence(prog.seq[prog.firstReject], true); }
      if (a === 'reset-request') { M.act(prog, st, 'request_reset'); closeDialog(); render('Reset requested. The operator re-aims the side camera, resets the scene and captures a new attempt.'); ctl.play(true); return; }
      if (a === 'ff') return fastForward();
      if (a === 'import') return doAct('import_eval');
      if (a === 'propose') return doAct('propose_brief');
      if (a === 'save-followup') { V.download('metari-M1-DEMO-002-followup-brief.json', JSON.stringify(Object.assign({ concept: 'ILLUSTRATIVE CONCEPT. Fictional finding and draft brief. Nothing was sent.' }, M.evaluationScenario()), null, 2), 'application/json'); return; }
    });
    $('#explode').addEventListener('click', function (e) { var on = e.currentTarget.getAttribute('aria-pressed') !== 'true'; e.currentTarget.setAttribute('aria-pressed', String(on)); $$('[data-floor]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.floor === 'all')); }); if (scene) scene.explode(on); });
    $('#layer').addEventListener('change', function (e) { ui.layer = e.target.value; render(); });
    $('#cams').addEventListener('click', function (e) { ui.cameras = !ui.cameras; e.currentTarget.setAttribute('aria-pressed', String(ui.cameras)); ui.lastSceneKey = ''; render(ui.cameras ? 'Showing planned camera mounts. Concept geometry, not calibrated optics.' : null); });
    $('#plan2d').addEventListener('click', function (e) { if (!scene) return; if (scene.fallback) return render('3D is not available on this device; the 2D plan is shown.'); var m = scene.toggle2d(); e.currentTarget.setAttribute('aria-pressed', String(m === '2d')); });
    $('#scope-tabs').addEventListener('keydown', function (e) { if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return; var tabs = $$('[data-scope]'), i = tabs.indexOf(document.activeElement); if (i < 0) return; var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.click(); });
    $('#ev-dialog').addEventListener('close', function () { if (st.gate === 'flagged' || st.gate === 'inspected') ui.gateHeld = false; render(); });
  }

  /* ------------------------------------------------------------ boot */
  bind();
  M.load().then(function (p) {
    prog = p; st = restore();
    var room = new URLSearchParams(location.search).get('room'); if (room) ui.selected = room;
    ctl = new M.Controller(prog, st, render);
    renderScope('guest');
    render(st.phase === 'DRAFT' ? 'Ready. Submit the fictional brief to begin.' : 'Restored the simulated order from your last view.');
    window.MetariPlanner.mount($('#planner'));
    var host = $('#scene');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { if (en.some(function (x) { return x.isIntersecting; })) { io.disconnect(); mountScene(); } }, { rootMargin: '400px 0px' });
      io.observe(host);
      // Start the demo by itself the first time the console is properly in view.
      var started = false;
      var io2 = new IntersectionObserver(function (en) {
        if (started || !en.some(function (x) { return x.isIntersecting; })) return;
        started = true; io2.disconnect();
        if (!ctl.running && st.phase !== 'READY_FOR_DELIVERY' && st.phase !== 'DEMO_CLOSED') setTimeout(function () { autoRun(true); }, 700);
      }, { threshold: 0.35 });
      io2.observe($('#console'));
    } else mountScene();
    window.__metariDebug = { prog: prog, st: function () { return st; }, ctl: function () { return ctl; }, scene: function () { return scene; } };
  }).catch(function (e) {
    console.error(e);
    $('#status').textContent = 'The fictional fixture could not be loaded. The partnership description remains readable.';
  });
})();
