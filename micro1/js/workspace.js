/* Metari x micro1 Command Center workspace controller.
 * Same order model and state encoding as /micro1/, so the two views never disagree. */
(function () {
  'use strict';
  var M = window.MetariOrder, V = window.MetariViews, esc = V.esc, fmt = M.fmt;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var KEY = 'metari.micro1.state';
  var prog, st, ctl, scene = null;
  var ui = { view: 'overview', room: null, layer: 'coverage', cameras: false, epFilter: 'recent', ep: null, evView: 'fixed_overview_rgb', qPage: 0, trKind: 'all', trQuery: '', lastUrl: 0 };
  var APPROVALS = [['protocol', 'Protocol'], ['geographic_eligibility', 'Geographic eligibility'], ['site_access', 'Site access'], ['operator_consent', 'Operator consent'], ['safety_review', 'Safety review'], ['data_rights', 'Data rights'], ['commercial_scope', 'Commercial scope']];

  var VIEWS = [
    ['overview', 'Program overview'], ['orders', 'Data orders'], ['env', 'Environments'], ['ops', 'Human operations'],
    ['capture', 'Capture & evidence'], ['qa', 'QA & delivery'], ['eval', 'Evaluation feedback'], ['trace', 'Operational trace']
  ];

  function persist() {
    try { sessionStorage.setItem(KEY, M.encode(st)); } catch (e) { }
    var now = Date.now();
    if (now - ui.lastUrl > 800 || !ctl.running) {
      ui.lastUrl = now;
      var q = new URLSearchParams(location.search); q.set('s', M.encode(st)); q.set('view', ui.view); if (ui.room) q.set('room', ui.room); else q.delete('room');
      try { history.replaceState(null, '', location.pathname + '?' + q.toString()); } catch (e) { }
    }
    $('#back').href = '/micro1/?s=' + encodeURIComponent(M.encode(st)) + (ui.room ? '&room=' + ui.room : '') + '#order';
  }
  function restore() {
    var q = new URLSearchParams(location.search);
    if (q.get('view') && VIEWS.some(function (v) { return v[0] === q.get('view'); })) ui.view = q.get('view');
    if (q.get('room')) ui.room = q.get('room');
    if (q.get('s')) return M.decode(q.get('s'), prog);
    try { var s = sessionStorage.getItem(KEY); if (s) return M.decode(s, prog); } catch (e) { }
    return M.initialState();
  }

  /* ------------------------------------------------------------ header controls */
  function header(msg) {
    $('#phase').textContent = M.PHASE_LABEL[st.phase] + (st.phase === 'CAPTURING' && !ctl.running && st.gate !== 'flagged' && st.gate !== 'inspected' ? ' (paused)' : '');
    $('#clock').textContent = M.simClock(prog, st.cursor) + ' (sim)';
    var b = $('#primary'), label, dis = false;
    switch (st.phase) {
      case 'DRAFT': label = 'Submit brief locally'; break;
      case 'NEEDS_CONFIRMATION': label = 'Apply assumed demo approvals'; dis = M.blocked(st); break;
      case 'DEMO_APPROVED': case 'CONFIGURED': label = ctl.running ? 'Configuring' : 'Start collection'; dis = ctl.running; break;
      case 'CAPTURING': if (st.gate === 'flagged' || st.gate === 'inspected') label = 'Review flagged sample'; else { label = ctl.running ? 'Collecting' : 'Resume collection'; dis = ctl.running; } break;
      case 'QA_REVIEW': label = ctl.running ? 'Reconciling' : 'Finish QA'; dis = ctl.running; break;
      case 'READY_FOR_DELIVERY': label = 'Close demo'; break;
      default: label = 'Replay';
    }
    b.textContent = label; b.disabled = dis;
    var p = $('#pause'); p.textContent = ctl.running ? 'Pause' : 'Resume';
    p.disabled = !((st.phase === 'CAPTURING' || st.phase === 'QA_REVIEW') && st.gate !== 'flagged' && st.gate !== 'inspected') && !ctl.running;
    $('#speed').setAttribute('aria-pressed', String(ctl.speed > 1));
    $('#guided').checked = st.guided; $('#guided').disabled = st.cursor > prog.firstReject;
    $$('#tabs [data-v]').forEach(function (t) {
      var badge = t.querySelector('.badge');
      var show = (t.dataset.v === 'capture' && (st.gate === 'flagged' || st.gate === 'inspected')) || (t.dataset.v === 'orders' && M.blocked(st));
      if (show && !badge) t.insertAdjacentHTML('beforeend', '<span class="badge">' + (t.dataset.v === 'orders' ? 'Blocked' : 'Review') + '</span>');
      if (!show && badge) badge.remove();
    });
    if (msg) $('#status').textContent = msg;
  }

  /* ------------------------------------------------------------ views */
  function panel(title, meta, body, id) { return '<section class="panel"><div class="panel-h"><h2>' + title + '</h2>' + (meta ? '<span class="mono">' + meta + '</span>' : '') + '</div><div class="panel-b"' + (id ? ' id="' + id + '" data-live' : '') + '>' + (body || '') + '</div></section>'; }

  var parts = {
    stepper: function () {
      var pi = M.phaseIndex(st.phase);
      return '<ol class="stepper">' + M.PHASES.map(function (p, i) { var cls = i < pi ? 'done' : i === pi ? 'cur' + (p === 'NEEDS_CONFIRMATION' && M.blocked(st) ? ' blocked' : '') : ''; return '<li class="' + cls + '"' + (i === pi ? ' aria-current="step"' : '') + '><b>' + String(i + 1).padStart(2, '0') + '</b>' + esc(M.PHASE_LABEL[p]) + '</li>'; }).join('') + '</ol>';
    },
    decision: function () {
      var d = { cls: '', k: 'Next human decision', h: '', p: '', btn: '' };
      switch (st.phase) {
        case 'DRAFT': d.h = 'Submit the fictional brief'; d.p = 'It is recorded in this browser only.'; d.btn = 'Submit brief locally'; break;
        case 'NEEDS_CONFIRMATION': if (M.blocked(st)) { d.cls = 'warn'; d.h = 'Blocked prerequisite'; d.p = M.issues(st).filter(function (i) { return i.level === 'block'; })[0].text + ' Change the capture profile in Data orders.'; } else { d.h = 'Confirm approvals'; d.p = 'Seven approvals are unconfirmed. In this guided demo you can explicitly assume them for the fictional order only.'; d.btn = 'Apply assumed demo approvals'; } break;
        case 'DEMO_APPROVED': case 'CONFIGURED': d.h = 'Start simulated collection'; d.p = 'Rooms, operators and the capture profile are mapped.'; d.btn = 'Start collection'; break;
        case 'CAPTURING': if (st.gate === 'flagged' || st.gate === 'inspected') { d.cls = 'warn'; d.h = 'Review ' + prog.seq[prog.firstReject].id; d.p = 'Preflight QA flagged a capture defect. Inspect the evidence, then request a reset and recapture.'; d.btn = 'Review flagged sample'; } else { d.h = ctl.running ? 'None while collecting' : 'Resume collection'; d.p = 'Operators capture attempts against the variation recipe. Rule-based preflight QA dispositions each attempt.'; } break;
        case 'QA_REVIEW': d.h = 'Finish reconciliation'; d.p = 'Confirm every variant quota and assemble the manifest.'; d.btn = 'Finish QA'; break;
        case 'READY_FOR_DELIVERY': d.h = 'Final acceptance belongs to micro1 and the buyer'; d.p = 'Not simulated. The manifest is ready for an agreed delivery route; nothing was uploaded. 72 episodes still await human review.'; break;
        default: d.h = 'Demo closed'; d.p = 'Replay to run it again.';
      }
      return '<div class="decision ' + d.cls + '"><span class="mono">' + d.k + '</span><h3>' + esc(d.h) + '</h3><p>' + esc(d.p) + '</p>' + (d.btn ? '<button class="btn sm primary" type="button" data-act="primary">' + esc(d.btn) + '</button>' : '') + '</div>';
    },
    metrics: function () { return V.metrics(prog, st); },
    bars: function () {
      var c = M.counts(prog, st);
      return '<div class="bars">' + Object.keys(M.TASKS).map(function (t) { var b = c.byTask[t]; return '<div class="bar-row"><span>' + esc(M.TASKS[t].name) + '</span><span class="track" aria-hidden="true"><i style="width:' + (b.accepted / b.target * 100).toFixed(1) + '%"></i></span><span class="v">' + b.accepted + ' / ' + b.target + '</span></div>'; }).join('') + '</div><p class="small muted" style="margin:10px 0 0">Accepted in demo QA, per task family. Held and rejected attempts never count toward quota.</p>';
    },
    recent: function () { return '<ol class="trace ws-trace">' + V.traceRows(M.trace(prog, st, 6)) + '</ol>'; },
    orders: function () {
      var rows = [['M1-DEMO-001', 'Hospitality service manipulation', M.PHASE_LABEL[st.phase], '1,200 accepted episodes']];
      if (st.evalState === 'proposed') rows.push(['M1-DEMO-002', 'Linen placement follow-up (capability gap)', 'Draft, awaiting approval', 'To be agreed']);
      return '<div class="tscroll"><table class="t stack"><thead><tr><th>Order</th><th>Title</th><th>State</th><th>Unit and target</th></tr></thead><tbody>' + rows.map(function (r) { return '<tr><td class="mono" data-l="Order">' + r[0] + '</td><td data-l="Title">' + esc(r[1]) + '</td><td data-l="State">' + esc(r[2]) + '</td><td data-l="Target">' + esc(r[3]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    },
    issues: function () {
      var iss = M.issues(st);
      return (iss.length ? '<ul class="issues">' + iss.map(function (i) { return '<li class="' + i.level + '"><b>' + (i.level === 'block' ? 'Blocked' : 'Flagged') + ' · ' + esc(i.code) + '</b>' + esc(i.text) + '</li>'; }).join('') + '</ul>' : '<p class="muted small">No open flags.</p>') +
        '<div class="field" style="margin-top:14px">Approvals</div><ul class="approvals">' + APPROVALS.map(function (a) { return '<li><span>' + a[1] + '</span><span class="st' + (st.assumed ? ' ok' : '') + '">' + (st.assumed ? 'Assumed (demo)' : 'Unconfirmed') + '</span></li>'; }).join('') + '</ul>';
    },
    history: function () {
      var h = [['v1', 'Requirement recorded locally', st.marks.some(function (m) { return m[0] === 'NEEDS_CONFIRMATION'; })], ['v1', 'Approvals assumed for demo only', st.assumed], ['v1', 'Environments and recipe configured', M.phaseIndex(st.phase) >= 3], ['v1', 'Collection', M.phaseIndex(st.phase) >= 4], ['v1', 'Manifest MAN-M1-DEMO-001-v1 created', M.phaseIndex(st.phase) >= 6]];
      if (st.evalState === 'proposed') h.push(['M1-DEMO-002', 'Follow-up brief drafted from EVAL-DEMO-01 (not approved)', true]);
      return '<ul class="checks-list">' + h.map(function (x) { return '<li><span class="' + (x[2] ? 'ok' : 'muted') + '">' + (x[2] ? '✓' : '○') + '</span><span><span class="mono" style="font-size:.6rem">' + x[0] + '</span> ' + esc(x[1]) + '</span></li>'; }).join('') + '</ul>';
    },
    dock: function () { return V.roomInfo(prog, st, ui.room); },
    matrix: function () { return V.coverageMatrix(prog, st); },
    roster: function () {
      var stats = {};
      M.OPERATORS.forEach(function (o) { stats[o.id] = { a: 0, h: 0, r: 0, last: null }; });
      for (var i = 0; i < st.cursor; i++) { var it = prog.seq[i], s = stats[it.operator]; s[it.disp === 'accepted' ? 'a' : it.disp === 'rejected' ? 'r' : 'h']++; s.last = it; }
      var cur = M.current(prog, st), curShift = cur ? cur.shift : 'A';
      return '<div class="tscroll"><table class="t stack"><thead><tr><th>Operator</th><th>Role</th><th>Shift</th><th>Zone</th><th>Qualification</th><th>Attempts</th><th>Last assignment</th></tr></thead><tbody>' +
        M.OPERATORS.map(function (o) {
          var s = stats[o.id], t = Object.keys(M.TASKS).filter(function (k) { return M.TASKS[k].zone === o.zone; })[0];
          return '<tr><td class="mono" data-l="Operator">' + o.id + (o.shift === curShift && st.phase === 'CAPTURING' ? ' ●' : '') + '</td><td data-l="Role">' + esc(o.role) + '</td><td data-l="Shift">' + o.shift + '</td><td data-l="Zone">' + esc(M.ZONES[o.zone].name) + '</td><td data-l="Qualification">' + esc(M.TASKS[t].qualification) + ' (fictional)</td><td data-l="Attempts">' + (s.a + s.h + s.r) + (s.r ? ' · ' + s.r + ' rejected' : '') + (s.h ? ' · ' + s.h + ' held' : '') + '</td><td class="mono" data-l="Last">' + (s.last ? s.last.id + ' · ' + s.last.station : '') + '</td></tr>';
        }).join('') + '</tbody></table></div><p class="small muted" style="margin:10px 0 0">● on shift now (simulated). Twelve fictional operators, no real people, images or personal data.</p>';
    },
    eplist: function () {
      var items = [];
      for (var i = st.cursor - 1; i >= 0 && items.length < 80; i--) {
        var it = prog.seq[i];
        if (ui.epFilter === 'flagged' && it.disp !== 'rejected') continue;
        if (ui.epFilter === 'held' && it.disp !== 'held_for_review') continue;
        if (ui.epFilter === 'recaptures' && !it.recaptureOf) continue;
        items.push(it);
      }
      if (!items.length) return '<p class="muted small" style="padding:10px">No matching episodes yet.</p>';
      return '<ul class="ep-list">' + items.map(function (it) { var r = M.REASONS[it.reason]; return '<li><button type="button" data-ep="' + it.id + '" aria-pressed="' + (ui.ep === it.id) + '"><span class="id">' + it.id + '</span><span class="pill ' + r.cls + '">' + (it.disp === 'held_for_review' ? 'held' : it.disp) + '</span><span>' + esc(M.TASKS[it.task].short) + ' · ' + it.variant.variant_id + (it.recaptureOf ? ' · recapture' : '') + '</span><span class="mono" style="font-size:.56rem">' + it.station + '</span></button></li>'; }).join('') + '</ul>';
    },
    evidence: function () {
      var it = ui.ep ? prog.byId[ui.ep] : M.current(prog, st);
      if (it && it.idx >= st.cursor) it = null;
      if (!it) return V.evidence(prog, st, null);
      var checks = [
        ['ok', 'Three views present in one episode (CP-DEMO-POV-3RGB)'],
        ['ok', 'Time alignment check (illustrative; no sensor streams supplied)'],
        [it.disp === 'rejected' ? 'bad' : 'ok', 'Hand/object visibility above demo threshold in all views'],
        [it.disp === 'held_for_review' ? 'hold' : 'ok', 'Step sequence complete (' + M.TASKS[it.task].steps.length + ' steps)'],
        ['ok', 'Scene recipe matches ' + it.variant.variant_id]
      ];
      var gate = it.idx === prog.firstReject && (st.gate === 'flagged' || st.gate === 'inspected');
      return V.evidence(prog, st, it, ui.evView) + '<div class="field" style="margin-top:14px">Preflight capture checks (rule-based, demo)</div><ul class="checks-list">' + checks.map(function (c) { return '<li><span class="' + c[0] + '">' + (c[0] === 'ok' ? '✓' : c[0] === 'bad' ? '✕' : '?') + '</span><span>' + esc(c[1]) + '</span></li>'; }).join('') + '</ul>' +
        (gate ? '<div class="gate" style="margin-top:14px"><span class="mono">Human decision required</span><p>This is a capture defect. Request a camera and scene correction before a new attempt.</p><div class="row">' + (st.gate === 'flagged' ? '<button class="btn sm" type="button" data-act="inspect">Mark evidence inspected</button>' : '') + '<button class="btn sm primary" type="button" data-act="reset-request">Request reset and recapture</button></div></div>' : '');
    },
    qasum: function () {
      var c = M.counts(prog, st);
      var rows = Object.keys(M.TASKS).map(function (t) { var b = c.byTask[t]; return '<tr><td data-l="Task">' + esc(M.TASKS[t].name) + '</td><td data-l="Captured">' + b.captured + '</td><td data-l="Accepted">' + b.accepted + ' / ' + b.target + '</td><td data-l="Held">' + b.held + '</td><td data-l="Rejected">' + b.rejected + '</td></tr>'; }).join('');
      return '<div class="grid2"><div><div class="tscroll"><table class="t stack"><thead><tr><th>Task family</th><th>Captured</th><th>Accepted</th><th>Held</th><th>Rejected</th></tr></thead><tbody>' + rows + '</tbody></table></div>' + '<p class="recon mono" style="border:0;padding:8px 0" data-reconciles="' + c.reconciles + '">' + fmt(c.captured) + ' = ' + fmt(c.accepted) + ' + ' + fmt(c.held) + ' + ' + fmt(c.rejected) + ' · ' + fmt(c.streams) + ' camera streams are not episodes</p></div>' +
        '<div><div class="tscroll"><table class="t stack"><thead><tr><th>Reason code</th><th>Meaning</th><th>Count</th></tr></thead><tbody>' + Object.keys(M.REASONS).map(function (k) { var r = M.REASONS[k], n = k === 'DEMO_CRITERIA_MET' ? c.accepted : k === 'DEMO_HUMAN_REVIEW_REQUIRED' ? c.held : c.rejected; return '<tr><td class="mono" data-l="Code">' + k + '</td><td data-l="Meaning">' + esc(r.text) + '</td><td data-l="Count">' + n + '</td></tr>'; }).join('') + '</tbody></table></div></div></div>';
    },
    queue: function () {
      var held = []; for (var i = 0; i < st.cursor; i++) if (prog.seq[i].disp === 'held_for_review') held.push(prog.seq[i]);
      var per = 10, pages = Math.max(1, Math.ceil(held.length / per)); ui.qPage = Math.min(ui.qPage, pages - 1);
      var slice = held.slice(ui.qPage * per, ui.qPage * per + per);
      if (!held.length) return '<p class="muted small">No episodes are waiting for human review.</p>';
      return '<div class="tscroll"><table class="t stack"><thead><tr><th>Episode</th><th>Task / variant</th><th>Station</th><th>Status</th><th></th></tr></thead><tbody>' + slice.map(function (it) { return '<tr><td class="mono" data-l="Episode">' + it.id + '</td><td data-l="Variant">' + esc(M.TASKS[it.task].short) + ' · ' + it.variant.variant_id + '</td><td class="mono" data-l="Station">' + it.station + '</td><td data-l="Status">Outstanding, not counted</td><td data-l=""><button class="linkish" type="button" data-open-ep="' + it.id + '">Evidence</button></td></tr>'; }).join('') + '</tbody></table></div><div class="pager"><button class="btn sm" type="button" data-page="-1"' + (ui.qPage ? '' : ' disabled') + '>Previous</button><span>Page ' + (ui.qPage + 1) + ' of ' + pages + ' · ' + held.length + ' held</span><button class="btn sm" type="button" data-page="1"' + (ui.qPage < pages - 1 ? '' : ' disabled') + '>Next</button></div><p class="small muted" style="margin:6px 0 0">In this demo, held episodes stay outstanding. The manifest lists them separately; they are not delivered as accepted.</p>';
    },
    lineage: function () {
      var rows = []; for (var i = 0; i < st.cursor; i++) { var it = prog.seq[i]; if (it.disp === 'rejected') rows.push(it); }
      if (!rows.length) return '<p class="muted small">No rejected attempts yet.</p>';
      return '<div class="tscroll" style="max-height:320px"><table class="t stack"><thead><tr><th>Rejected attempt</th><th>Reason</th><th>New attempt</th></tr></thead><tbody>' + rows.map(function (it) { var nx = it.recapturedBy && prog.byId[it.recapturedBy].idx < st.cursor ? it.recapturedBy : null; return '<tr><td class="mono" data-l="Rejected"><button class="linkish" type="button" data-open-ep="' + it.id + '">' + it.id + '</button></td><td class="mono" data-l="Reason">' + it.reason + '</td><td class="mono" data-l="New attempt">' + (nx ? '<button class="linkish" type="button" data-open-ep="' + nx + '">' + nx + '</button> (accepted)' : 'Pending') + '</td></tr>'; }).join('') + '</tbody></table></div><p class="small muted" style="margin:8px 0 0">Every rejected attempt is retained with its reason code. A recapture is a new attempt ID; it never overwrites the original.</p>';
    },
    manifest: function () {
      var m = M.manifest(prog, st), ready = M.phaseIndex(st.phase) >= M.phaseIndex('READY_FOR_DELIVERY');
      var preview = Object.assign({}, m, { accepted: '[' + m.accepted.length + ' records]', held_for_review_outstanding: '[' + m.held_for_review_outstanding.length + ' records]', rejected_retained_not_delivered: '[' + m.rejected_retained_not_delivered.length + ' records]' });
      return '<div class="decision' + (ready ? '' : ' warn') + '" style="margin-bottom:12px"><span class="mono">' + (ready ? 'Ready for agreed delivery (simulated)' : 'Not ready') + '</span><h3>' + esc(m.manifest_id) + '</h3><p>' + (ready ? 'Assembled with evidence references, dispositions and outstanding review items. Nothing was uploaded to micro1 or anywhere else.' : 'The manifest is only marked ready once every one of the 48 variant quotas is met.') + '</p><button class="btn sm" type="button" data-act="save-manifest">Download manifest (.json)</button></div><pre class="json" tabindex="0" aria-label="Manifest preview">' + esc(JSON.stringify(preview, null, 2)) + '</pre>';
    },
    evalbody: function () {
      var E = M.evaluationScenario(), ready = M.phaseIndex(st.phase) >= M.phaseIndex('READY_FOR_DELIVERY');
      var h = '<div class="grid2"><div class="loopcard"><div class="who mono">Capture defect</div><h3>The recording did not meet specification.</h3><p class="muted">Handled inside the order: flag, review, reset, new attempt. ' + fmt(M.counts(prog, st).rejected) + ' so far in this run.</p></div><div class="loopcard gap"><div class="who mono">Capability gap</div><h3>Valid evidence of an agent struggling.</h3><p class="muted">Comes from a separate evaluation by the model owner. Creates a proposed new order, never an automatic one.</p></div></div>';
      h += '<div class="panel" style="margin-top:16px"><div class="panel-h"><h2>Fictional evaluation scenario</h2><span class="mono">EVAL-DEMO-01</span></div><div class="panel-b">';
      if (!ready) h += '<p class="muted">Available once the order is ready for agreed delivery.</p><button class="btn sm" type="button" data-act="ff"' + (M.blocked(st) ? ' disabled' : '') + '>Fast-forward the order</button>';
      else if (st.evalState === 'none') h += '<p class="muted">A model owner (fictional) sends a finding from a separate holdout evaluation.</p><button class="btn sm primary" type="button" data-act="import">Import fictional finding</button>';
      else {
        h += '<p><b>' + esc(E.finding.id) + ' · capability gap</b></p><p class="muted">' + esc(E.finding.summary) + '</p><p class="small" style="color:var(--sand)">' + esc(E.finding.not) + '</p>';
        if (st.evalState === 'imported') h += '<button class="btn sm primary" type="button" data-act="propose">Draft a follow-up brief</button>';
        else h += '<dl class="kv" style="margin-top:10px"><dt>Proposed order</dt><dd class="mono">' + esc(E.brief.order_id) + ' · ' + esc(E.brief.status) + '</dd><dt>Task</dt><dd>' + esc(E.brief.task) + '</dd><dt>Variants</dt><dd>' + esc(E.brief.variants) + '</dd><dt>Evaluation</dt><dd>' + esc(E.brief.evaluation) + '</dd><dt>Approvals</dt><dd>' + E.brief.approvals.map(esc).join(', ') + '</dd></dl><div class="row" style="margin-top:10px"><button class="btn sm" type="button" data-act="save-followup">Save follow-up brief (.json)</button></div>';
      }
      return h + '</div></div>';
    },
    fulltrace: function () {
      var ev = M.trace(prog, st).filter(function (e) {
        if (ui.trKind !== 'all' && e.kind !== ui.trKind) return false;
        if (ui.trQuery) { var q = ui.trQuery.toLowerCase(); return (e.action + ' ' + e.actor + ' ' + (e.ref || '') + ' ' + e.evidence + ' ' + e.rule).toLowerCase().indexOf(q) >= 0; }
        return true;
      });
      var shown = ev.slice(-150);
      return '<p class="small muted">' + ev.length + ' events' + (ev.length > shown.length ? ', newest 150 shown' : '') + '.</p><div class="tscroll"><table class="t stack"><thead><tr><th>Sim time</th><th>Kind</th><th>Actor</th><th>Action</th><th>Ref</th><th>Evidence</th><th>Rule / threshold</th><th>State change</th><th>Approval</th></tr></thead><tbody>' +
        shown.reverse().map(function (e) { return '<tr><td class="mono" data-l="Time">' + esc(e.time) + '</td><td data-l="Kind">' + (e.kind === 'rule' ? 'Rule-based' : 'Simulated') + '</td><td data-l="Actor">' + esc(e.actor) + '</td><td data-l="Action">' + esc(e.action) + '</td><td class="mono" data-l="Ref">' + (e.ref && prog.byId[e.ref] ? '<button class="linkish" type="button" data-open-ep="' + e.ref + '">' + e.ref + '</button>' : esc(e.ref || '')) + '</td><td data-l="Evidence">' + esc(e.evidence) + '</td><td data-l="Rule">' + esc(e.rule) + '</td><td data-l="State">' + esc(e.state) + '</td><td data-l="Approval">' + esc(e.approval) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    }
  };

  var LAYOUTS = {
    overview: function () {
      return '<h1>Program overview</h1><p class="ws-sub">Fictional order M1-DEMO-001 for Demo Robotics Lab (fictional), with micro1 as proposed orchestration partner and Metari as proposed physical executor. Browser simulation only.</p>' +
        '<div data-live id="p-stepper" style="margin-bottom:16px"></div>' +
        '<div class="grid-main"><div>' + panel('Next human decision', '', '', 'p-decision') + panel('Output', 'Counted from fixture records', '', 'p-metrics') + panel('Accepted coverage by task', 'Simulated', '', 'p-bars') + '</div><div>' + panel('Recent decision and evidence log', 'Scripted, not model reasoning', '', 'p-recent') + '</div></div>';
    },
    orders: function () {
      var o = prog.order, cp = o.capture_profile, pi = M.phaseIndex(st.phase);
      return '<h1>Data orders</h1><p class="ws-sub">The technical brief as Metari would receive it. The schema is a proposed Metari fixture, not a micro1 API.</p>' + panel('Orders', '', '', 'p-orders') +
        '<div class="grid2"><div>' + panel('M1-DEMO-001 · technical brief', 'Fictional',
          '<dl class="kv"><dt>Buyer</dt><dd>Demo Robotics Lab (fictional)</dd><dt>Parties</dt><dd>micro1 (proposed data workflow partner) · Metari (proposed physical executor) · status: proposed only</dd><dt>Unit</dt><dd>Unique accepted episode</dd><dt>Target</dt><dd>1,200 = 25 accepted × 48 defined variants</dd><dt>Task families</dt><dd>' + o.task_families.map(function (t) { return esc(t.name); }).join(', ') + '</dd><dt>Variation</dt><dd>3 tasks × 4 layouts × 2 lighting × 2 clutter</dd><dt>Capture profile</dt><dd>' + esc(cp.id) + ': ' + cp.views.join(', ') + '. Hardware to be agreed. No depth, IMU or robot actions. No real capture exists.</dd><dt>Boundaries</dt><dd>No recordings, operators, hardware control, dataset upload or micro1 endpoint. Model improvement not measured.</dd></dl>' +
          '<label class="field">Capture profile<select id="o-profile"' + (pi > 1 ? ' disabled' : '') + '><option value="fixture">First-person RGB + 2 fixed RGB (fixture)</option><option value="depth">Add calibrated depth</option><option value="actions">Add robot joint actions</option></select></label>' +
          '<label class="field">Proposed site<select id="o-location"' + (pi > 1 ? ' disabled' : '') + '><option value="tba">To be agreed</option><option value="listed">A US state on micro1\'s published list</option><option value="ca">California</option><option value="az">Arizona</option></select></label>') + '</div><div>' +
        panel('Flags and approvals', '', '', 'p-issues') + panel('Revision history', '', '', 'p-history') + '</div></div>';
    },
    env: function () {
      return '<h1>Environments</h1><p class="ws-sub">A three-level conceptual facility rendered with the Command Center v10 WebGL engine. Concept geometry, not a surveyed or operating site. Only the rooms this hospitality order needs are allocated.</p>' +
        '<div class="grid-main"><div><div class="scene-wrap"><div class="scene-bar" id="scene-bar">' +
        '<div class="grp" role="group" aria-label="Floor"><button class="btn sm" type="button" data-floor="all" aria-pressed="true">All</button><button class="btn sm" type="button" data-floor="2" aria-pressed="false">03 Living</button><button class="btn sm" type="button" data-floor="1" aria-pressed="false">02 Experience</button><button class="btn sm" type="button" data-floor="0" aria-pressed="false">01 Operations</button></div><span class="sep" aria-hidden="true"></span>' +
        '<button class="btn sm" type="button" id="explode" aria-pressed="true">Exploded</button><select id="layer" aria-label="Overlay"><option value="coverage">Accepted coverage (sim)</option><option value="allocation">Allocation (sim)</option><option value="off">No overlay</option></select><button class="btn sm" type="button" id="cams" aria-pressed="' + ui.cameras + '">Cameras</button><span class="sep" aria-hidden="true"></span>' +
        '<button class="icb" type="button" data-sv="left" aria-label="Rotate left"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5"/></svg></button><button class="icb" type="button" data-sv="right" aria-label="Rotate right"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/></svg></button><button class="icb" type="button" data-sv="in" aria-label="Zoom in"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M8 11h6M11 8v6"/></svg></button><button class="icb" type="button" data-sv="out" aria-label="Zoom out"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M8 11h6"/></svg></button><button class="icb" type="button" data-sv="reset" aria-label="Reset view"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg></button><button class="btn sm" type="button" id="plan2d" aria-pressed="false">2D plan</button></div>' +
        '<div id="scene" class="scene-host"></div><div class="legend">' + (ui.layer === 'allocation' ? '<span><i class="sw"></i>Allocated to this order (simulated)</span>' : ui.layer === 'off' ? '<span>No overlay</span>' : '<span>Accepted coverage, simulated:</span><span class="ramp" aria-hidden="true"></span><span>0% to 100% of the room\'s accepted quota. Not temperature, activity or success rate.</span>') + '</div>' +
        '<div class="room-chips">' + ['guest', 'laundry', 'boh'].map(function (r) { return '<button class="chip" type="button" data-room="' + r + '" aria-pressed="' + (ui.room === r) + '">' + esc({guest:'Guest-room suites',laundry:'Laundry & linen',boh:'Service & supply'}[r]) + '</button>'; }).join('') + '</div></div></div>' +
        '<div>' + panel('Selected room', 'Tasks · capture · resets · assignment', '', 'p-dock') + '</div></div>' +
        panel('Variant coverage', '48 defined scenario combinations', '', 'p-matrix') +
        '<section class="panel"><details class="ref"><summary>Property Intelligence reference image (static concept, not live telemetry)</summary><div class="panel-b"><img class="ref-img" src="/assets/property-heatmap.webp" alt="Existing Metari Property Intelligence concept image: aerial campus plan with illustrative zone markers and an activity-density legend" loading="lazy"><p class="small muted" style="margin:8px 0 0">An existing Metari concept visual. Its colours are illustrative and are not computed from this order. The overlay in the 3D view above is the one tied to this simulation.</p></div></details></section>';
    },
    ops: function () {
      return '<h1>Human operations</h1><p class="ws-sub">Who does the work. Operators, supervisors and reviewers here are fictional role holders. In a real pilot Metari would recruit, train and supervise qualified local staff; micro1 would approve competency criteria.</p>' +
        panel('Operator roster', 'Fictional · shift A 07:00 to 15:00, shift B 15:00 to 23:00 (sim)', '', 'p-roster') +
        panel('Supervision and review', 'Fictional', '<div class="tscroll"><table class="t stack"><thead><tr><th>ID</th><th>Role</th><th>Shift</th><th>Responsibility</th></tr></thead><tbody>' + M.SUPPORT.map(function (s) { return '<tr><td class="mono" data-l="ID">' + s.id + '</td><td data-l="Role">' + esc(s.role) + '</td><td data-l="Shift">' + s.shift + '</td><td data-l="Responsibility">' + esc(s.role === 'Floor supervisor' ? 'Station assignment, sign-offs, consent and safety gate (assumed in demo)' : s.role === 'Capture technician' ? 'Sensor profile validation, camera aim, time alignment checks' : 'Operational QA decisions; final acceptance stays with micro1 and the buyer') + '</td></tr>'; }).join('') + '</tbody></table></div><p class="small muted" style="margin:10px 0 0">Remote evaluation experts and local qualified operators are different staffing requirements. This view makes no claim that micro1\'s expert network can staff a physical site.</p>');
    },
    capture: function () {
      return '<h1>Capture &amp; evidence</h1><p class="ws-sub">Three views belong to one episode. Stills are concept renderings standing in for recordings; nothing here is a live camera or a synchronized capture.</p>' +
        '<div class="grid-main"><div>' + panel('Evidence', 'Concept stills · UI overlays', '', 'p-evidence') + '</div><div><section class="panel"><div class="panel-h"><h2>Episodes</h2><div class="filters" role="group" aria-label="Filter episodes">' + [['recent', 'Recent'], ['flagged', 'Rejected'], ['held', 'Held'], ['recaptures', 'Recaptures']].map(function (f) { return '<button class="chip" type="button" data-epf="' + f[0] + '" aria-pressed="' + (ui.epFilter === f[0]) + '">' + f[1] + '</button>'; }).join('') + '</div></div><div id="p-eplist" data-live></div></section></div></div>';
    },
    qa: function () {
      return '<h1>QA &amp; delivery</h1><p class="ws-sub">Metari runs capture preflight and operational QA. Final technical dataset acceptance belongs to micro1 and the buyer under agreed criteria, and is not simulated here.</p>' +
        panel('Dispositions', 'Exclusive per episode', '', 'p-qasum') +
        '<div class="grid2"><div>' + panel('Human review queue', 'Held for review', '', 'p-queue') + '</div><div>' + panel('Rejected attempts and lineage', 'Retained, not delivered', '', 'p-lineage') + '</div></div>' +
        panel('Delivery manifest', 'Local file only', '', 'p-manifest') +
        panel('Delivery adapter', 'Not implemented', '<div class="adapter"><p style="margin:0 0 6px">A future adapter would take <code>DeliveryManifest</code> plus evidence references and hand them to an agreed delivery route. No endpoint exists, none is invented, and no mock success is shown. The status shown is <code>Ready for agreed delivery</code>, never <code>Uploaded to micro1</code>.</p><p style="margin:0">Inputs: manifest JSON, evidence refs, access policy. Outputs: delivery receipt from the agreed route. Both to be specified with micro1.</p></div>');
    },
    eval: function () {
      return '<h1>Evaluation feedback</h1><p class="ws-sub">A bad recording and a struggling robot are different problems. Capture QA says nothing about model capability, and a good recording is not proof of model improvement.</p><div id="p-evalbody" data-live></div>';
    },
    trace: function () {
      return '<h1>Operational trace</h1><p class="ws-sub">Decision and evidence log. Every row is either a scripted simulated event or a rule-based demo action. It is not private model reasoning and does not prove safety. No row implies physical robot control.</p>' +
        '<div class="filters" style="margin-bottom:12px">' + [['all', 'All'], ['rule', 'Rule-based'], ['simulated', 'Simulated']].map(function (f) { return '<button class="chip" type="button" data-trk="' + f[0] + '" aria-pressed="' + (ui.trKind === f[0]) + '">' + f[1] + '</button>'; }).join('') + '<label class="sr" for="trq">Search the trace</label><input id="trq" type="search" placeholder="Search actor, episode, rule" value="' + esc(ui.trQuery) + '" style="background:var(--ground);border:1px solid var(--line);color:var(--text);padding:6px 10px;border-radius:2px;min-width:220px"></div><div id="p-fulltrace" data-live></div>';
    }
  };
  var PART_IDS = { 'p-stepper': 'stepper', 'p-decision': 'decision', 'p-metrics': 'metrics', 'p-bars': 'bars', 'p-recent': 'recent', 'p-orders': 'orders', 'p-issues': 'issues', 'p-history': 'history', 'p-dock': 'dock', 'p-matrix': 'matrix', 'p-roster': 'roster', 'p-eplist': 'eplist', 'p-evidence': 'evidence', 'p-qasum': 'qasum', 'p-queue': 'queue', 'p-lineage': 'lineage', 'p-manifest': 'manifest', 'p-evalbody': 'evalbody', 'p-fulltrace': 'fulltrace' };
  var SLOW = { 'p-evidence': 1, 'p-manifest': 1, 'p-fulltrace': 1, 'p-roster': 1 };

  function showView(v, focus) {
    ui.view = v;
    if (scene) { scene.destroy(); scene = null; }
    $$('#tabs [data-v]').forEach(function (t) { var on = t.dataset.v === v; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    $('#view').setAttribute('aria-labelledby', 'tab-' + v);
    $('#view').innerHTML = LAYOUTS[v]();
    if (v === 'orders') { $('#o-profile').value = st.profile; $('#o-location').value = st.location; }
    if (v === 'env') { $('#layer').value = ui.layer; mountScene(); }
    update(true);
    if (focus) $('#ws-main').focus({ preventScroll: false });
  }

  var slowAt = 0;
  function update(force) {
    var now = Date.now(), slow = force || !ctl.running || now - slowAt > 700;
    if (slow) slowAt = now;
    $$('#view [data-live]').forEach(function (n) {
      var fn = parts[PART_IDS[n.id]]; if (!fn) return;
      if (!force && n.contains(document.activeElement) && document.activeElement !== document.body) return;
      if (!slow && SLOW[n.id]) return;
      var keep = n.querySelector('.ep-list') ? n.querySelector('.ep-list').scrollTop : null;
      n.innerHTML = fn();
      if (keep !== null && n.querySelector('.ep-list')) n.querySelector('.ep-list').scrollTop = keep;
    });
    if (scene) scene.refresh();
  }

  function render(msg) { if (!prog) return; header(msg); update(false); persist(); }

  /* ------------------------------------------------------------ scene */
  function loadScript(src) { return new Promise(function (res, rej) { if (document.querySelector('script[src="' + src + '"]')) return res(); var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = function () { rej(new Error(src)); }; document.head.appendChild(s); }); }
  function mountScene() {
    loadScript('/micro1/js/plans.js').then(function () { return loadScript('/micro1/js/architecture.js'); }).then(function () { return loadScript('/micro1/js/scene.js'); }).then(function () {
      if (ui.view !== 'env' || !$('#scene')) return;
      scene = window.MetariScene.mount($('#scene'), {
        getState: function () { return { allocated: M.allocatedRooms(st), coverage: M.counts(prog, st).byRoom, layer: ui.layer, cameras: ui.cameras, paths: false }; },
        onPick: function (id) { ui.room = id; syncRoomChips(); update(true); persist(); }
      });
      if (scene.fallback) $('#plan2d').setAttribute('aria-pressed', 'true');
      if (ui.room) scene.select(ui.room, true);
    }).catch(function (e) { console.error(e); var h = $('#scene'); if (h) h.innerHTML = '<p class="scene-note mono" style="padding:14px">The spatial view could not load. Room details and coverage remain available.</p>'; });
  }
  function syncRoomChips() { $$('[data-room]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.room === ui.room)); }); }

  /* ------------------------------------------------------------ actions */
  function primary() {
    switch (st.phase) {
      case 'DRAFT': render(M.act(prog, st, 'submit').msg); break;
      case 'NEEDS_CONFIRMATION': var r = M.act(prog, st, 'assume'); render(r.msg); if (r.ok) ctl.play(true); break;
      case 'DEMO_APPROVED': case 'CONFIGURED': ctl.play(true); break;
      case 'CAPTURING': if (st.gate === 'flagged' || st.gate === 'inspected') { ui.ep = prog.seq[prog.firstReject].id; ui.evView = 'fixed_side_rgb'; if (st.gate === 'flagged') M.act(prog, st, 'inspect'); showView('capture', true); render('Evidence opened for ' + ui.ep + '. Request a reset and recapture to continue.'); } else ctl.play(true); break;
      case 'QA_REVIEW': ctl.play(true); break;
      case 'READY_FOR_DELIVERY': render(M.act(prog, st, 'close').msg); break;
      default: replay();
    }
  }
  function replay() {
    ctl.reset(); M.act(prog, st, 'submit');
    if (!M.blocked(st) && M.act(prog, st, 'assume').ok) { ctl.play(true); render('Replaying with the assumed demo approvals re-applied for the fictional order.'); }
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
    var g = st.guided; st.guided = false; while (st.phase === 'CAPTURING') M.advance(prog, st, 500); st.guided = g;
    M.finishQA(prog, st); update(true); render('Fast-forwarded to ready for agreed delivery.');
  }
  function openEp(id) { ui.ep = id; var it = prog.byId[id]; ui.evView = it && it.disp === 'rejected' ? 'fixed_side_rgb' : 'fixed_overview_rgb'; if (ui.view !== 'capture') showView('capture', true); else update(true); }

  function bind() {
    $('#tabs').innerHTML = VIEWS.map(function (v, i) { return '<button role="tab" type="button" id="tab-' + v[0] + '" data-v="' + v[0] + '" aria-selected="false" aria-controls="view"><span class="n">' + String(i + 1).padStart(2, '0') + '</span>' + v[1] + '</button>'; }).join('');
    $('#tabs').addEventListener('click', function (e) { var t = e.target.closest('[data-v]'); if (t) { showView(t.dataset.v, false); persist(); } });
    $('#tabs').addEventListener('keydown', function (e) { var keys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End']; if (keys.indexOf(e.key) < 0) return; e.preventDefault(); var tabs = $$('#tabs [data-v]'), i = tabs.indexOf(document.activeElement); if (i < 0) i = 0; var n = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length; tabs[n].focus(); showView(tabs[n].dataset.v, false); persist(); });
    $('#primary').addEventListener('click', primary);
    $('#pause').addEventListener('click', function () { if (ctl.running) ctl.pause(); else ctl.play(true); });
    $('#reset').addEventListener('click', function () { ctl.reset(); ui.ep = null; ui.qPage = 0; if (scene) scene.reset(); update(true); render(); });
    $('#replay').addEventListener('click', replay);
    $('#speed').addEventListener('click', function () { ctl.speed = ctl.speed > 1 ? 1 : 4; render(ctl.speed > 1 ? 'Fast mode.' : 'Normal speed.'); });
    $('#guided').addEventListener('change', function (e) { st.guided = e.target.checked; render(); });
    document.addEventListener('change', function (e) {
      if (e.target.id === 'o-profile') { st.profile = e.target.value; update(true); render(M.blocked(st) ? 'Blocked: that modality is not available in this capture profile.' : 'Capture profile set.'); }
      if (e.target.id === 'o-location') { st.location = e.target.value; update(true); render(); }
      if (e.target.id === 'layer') { ui.layer = e.target.value; var lg = $('.scene-wrap .legend'); if (lg) lg.innerHTML = ui.layer === 'allocation' ? '<span><i class="sw"></i>Allocated to this order (simulated)</span>' : ui.layer === 'off' ? '<span>No overlay</span>' : '<span>Accepted coverage, simulated:</span><span class="ramp" aria-hidden="true"></span><span>0% to 100% of the room\'s accepted quota. Not temperature, activity or success rate.</span>'; if (scene) scene.refresh(); }
    });
    document.addEventListener('input', function (e) { if (e.target.id === 'trq') { ui.trQuery = e.target.value; var n = $('#p-fulltrace'); if (n) n.innerHTML = parts.fulltrace(); } });
    document.addEventListener('click', function (e) {
      var t = e.target.closest('button,[data-close]'); if (!t) return;
      if (t.hasAttribute('data-close')) { var d = $('#ev-dialog'); if (d.open) d.close(); return; }
      if (t.dataset.act === 'primary') return primary();
      if (t.dataset.room) { ui.room = t.dataset.room; syncRoomChips(); if (scene) scene.select(ui.room, true); update(true); persist(); return; }
      if (t.dataset.ep) { ui.ep = t.dataset.ep; var it = prog.byId[ui.ep]; ui.evView = it.disp === 'rejected' ? 'fixed_side_rgb' : 'fixed_overview_rgb'; $$('.ep-list [data-ep]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === t)); }); $('#p-evidence').innerHTML = parts.evidence(); return; }
      if (t.dataset.openEp) return openEp(t.dataset.openEp);
      if (t.dataset.view && t.closest('.ev-tabs')) { ui.evView = t.dataset.view; var pe = $('#p-evidence'); if (pe) { pe.innerHTML = parts.evidence(); var nb = $('.ev-tabs [data-view="' + ui.evView + '"]'); nb && nb.focus(); } return; }
      if (t.dataset.epf) { ui.epFilter = t.dataset.epf; $$('[data-epf]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === t)); }); $('#p-eplist').innerHTML = parts.eplist(); return; }
      if (t.dataset.trk) { ui.trKind = t.dataset.trk; $$('[data-trk]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === t)); }); $('#p-fulltrace').innerHTML = parts.fulltrace(); return; }
      if (t.dataset.page) { ui.qPage = Math.max(0, ui.qPage + (+t.dataset.page)); $('#p-queue').innerHTML = parts.queue(); var pb = $('#p-queue [data-page="' + t.dataset.page + '"]'), other = $('#p-queue [data-page="' + (-t.dataset.page) + '"]'); if (pb && !pb.disabled) pb.focus(); else if (other) other.focus(); return; }
      if (t.dataset.floor && scene) { $$('[data-floor]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === t)); }); scene.floor(t.dataset.floor === 'all' ? 'all' : +t.dataset.floor); return; }
      if (t.dataset.sv && scene) { var v = t.dataset.sv; if (v === 'left') scene.rotate(-1); if (v === 'right') scene.rotate(1); if (v === 'in') scene.zoom(1); if (v === 'out') scene.zoom(-1); if (v === 'reset') { scene.reset(); ui.room = null; syncRoomChips(); $$('[data-floor]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.floor === 'all')); }); $('#explode').setAttribute('aria-pressed', 'true'); update(true); } return; }
      if (t.id === 'explode' && scene) { var on = t.getAttribute('aria-pressed') !== 'true'; t.setAttribute('aria-pressed', String(on)); $$('[data-floor]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.floor === 'all')); }); scene.explode(on); return; }
      if (t.id === 'cams') { ui.cameras = !ui.cameras; t.setAttribute('aria-pressed', String(ui.cameras)); if (scene) scene.refresh(); return; }
      if (t.id === 'plan2d' && scene) { if (scene.fallback) return render('3D is not available on this device; the 2D plan is shown.'); var m = scene.toggle2d(); t.setAttribute('aria-pressed', String(m === '2d')); return; }
      var a = t.dataset.act;
      if (a === 'inspect') { M.act(prog, st, 'inspect'); update(true); render('Evidence marked inspected.'); return; }
      if (a === 'reset-request') { M.act(prog, st, 'request_reset'); ctl.play(true); update(true); render('Reset requested. The operator re-aims the side camera, resets the scene and captures a new attempt.'); return; }
      if (a === 'ff') return fastForward();
      if (a === 'import') { render(M.act(prog, st, 'import_eval').msg); update(true); return; }
      if (a === 'propose') { render(M.act(prog, st, 'propose_brief').msg); update(true); return; }
      if (a === 'save-manifest') { V.download('MAN-M1-DEMO-001-v1.simulated.json', JSON.stringify(M.manifest(prog, st), null, 2), 'application/json'); return; }
      if (a === 'save-followup') { V.download('metari-M1-DEMO-002-followup-brief.json', JSON.stringify(Object.assign({ concept: 'ILLUSTRATIVE CONCEPT. Fictional finding and draft brief. Nothing was sent.' }, M.evaluationScenario()), null, 2), 'application/json'); return; }
    });
  }

  bind();
  M.load().then(function (p) {
    prog = p; st = restore();
    ctl = new M.Controller(prog, st, render);
    showView(ui.view, false);
    header(st.phase === 'DRAFT' ? 'Ready. Submit the fictional brief to begin.' : 'Continuing the simulated order carried over from the partnership page.');
    persist();
    window.__metariDebug = { prog: prog, st: function () { return st; }, ctl: function () { return ctl; }, scene: function () { return scene; }, show: showView };
  }).catch(function (e) { console.error(e); $('#status').textContent = 'The fictional fixture could not be loaded.'; });
})();
