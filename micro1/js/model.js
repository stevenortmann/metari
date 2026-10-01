/* Metari x micro1 concept: shared order model.
 * One deterministic source of state for the partnership page, the embedded order preview,
 * the Command Center workspace, the planner and every export.
 *
 * Namespaces kept explicit:
 *   PUBLISHED  sourced public statements about micro1 (see /micro1/data/source-claims.json)
 *   PROPOSED   the commercial and technical concept under discussion
 *   SIMULATION fictional orders, roles, quantities, scenes, sensor status and outcomes
 *
 * Everything this file computes is SIMULATION. It never contacts micro1, a robot, a sensor,
 * a storage bucket or any other external service. Counts are read from the fixture records,
 * never from random counters.
 */
(function (root) {
  'use strict';

  var PHASES = ['DRAFT', 'NEEDS_CONFIRMATION', 'DEMO_APPROVED', 'CONFIGURED', 'CAPTURING', 'QA_REVIEW', 'READY_FOR_DELIVERY', 'DEMO_CLOSED'];
  var PHASE_LABEL = {
    DRAFT: 'Draft brief',
    NEEDS_CONFIRMATION: 'Needs confirmation',
    DEMO_APPROVED: 'Demo approvals assumed',
    CONFIGURED: 'Environments configured',
    CAPTURING: 'Capturing',
    QA_REVIEW: 'QA review',
    READY_FOR_DELIVERY: 'Ready for agreed delivery',
    DEMO_CLOSED: 'Demo closed'
  };

  // Task family to concept-facility room. Rooms are ids in MetariArchitecture.ROOMS.
  var ZONES = {
    'ZONE-HOUSEKEEPING': { room: 'guest', level: 3, name: 'Guest-room suites', stations: ['GR-S1', 'GR-S2'] },
    'ZONE-LAUNDRY': { room: 'laundry', level: 1, name: 'Laundry & linen', stations: ['LA-S1', 'LA-S2'] },
    'ZONE-SERVICE': { room: 'boh', level: 1, name: 'Service & supply', stations: ['SV-S1', 'SV-S2'] }
  };

  var TASKS = {
    'TASK-LINEN': {
      short: 'Linen', name: 'Linen placement', zone: 'ZONE-HOUSEKEEPING', captureMin: 6, resetMin: 3,
      steps: ['Strip used top sheet to cart', 'Place and square fitted sheet', 'Lay duvet and fold turn-down', 'Place towels to room standard'],
      evidence: 'Both hands and the sheet corner visible in first-person and side views through corner seating.',
      reset: ['Layout A to D: bed wall and nightstand position', 'Lighting: standard or dim', 'Clutter: clear or moderate (bags, clothing, tray)'],
      qualification: 'Housekeeping room attendant, bed-making standard sign-off'
    },
    'TASK-LAUNDRY': {
      short: 'Laundry', name: 'Laundry folding', zone: 'ZONE-LAUNDRY', captureMin: 4, resetMin: 2,
      steps: ['Pull item from clean bin', 'Identify item type', 'Fold to property standard', 'Stack on shelf by type'],
      evidence: 'Item edges and both hands visible in the overhead and side views; fold count legible.',
      reset: ['Layout A to D: table, bin and shelf arrangement', 'Lighting: standard or dim', 'Clutter: clear or moderate (mixed items on table)'],
      qualification: 'Laundry attendant, folding standard sign-off'
    },
    'TASK-CART': {
      short: 'Cart', name: 'Service-cart replenishment', zone: 'ZONE-SERVICE', captureMin: 5, resetMin: 3,
      steps: ['Read par sheet', 'Pick items from shelving', 'Load cart shelves to plan', 'Verify par and park cart'],
      evidence: 'Shelf labels, item in hand and cart shelf visible in first-person view; cart fully in fixed overview.',
      reset: ['Layout A to D: shelving and cart parking position', 'Lighting: standard or dim', 'Clutter: clear or moderate (partial stock, misplaced items)'],
      qualification: 'Housekeeping houseperson, par-stock standard sign-off'
    }
  };

  // Fictional operator roster. No real people, images or personal data.
  var OPERATORS = [
    { id: 'OP-D01', role: 'Room attendant', zone: 'ZONE-HOUSEKEEPING', shift: 'A' },
    { id: 'OP-D02', role: 'Room attendant', zone: 'ZONE-HOUSEKEEPING', shift: 'A' },
    { id: 'OP-D03', role: 'Laundry attendant', zone: 'ZONE-LAUNDRY', shift: 'A' },
    { id: 'OP-D04', role: 'Laundry attendant', zone: 'ZONE-LAUNDRY', shift: 'A' },
    { id: 'OP-D05', role: 'Houseperson', zone: 'ZONE-SERVICE', shift: 'A' },
    { id: 'OP-D06', role: 'Houseperson', zone: 'ZONE-SERVICE', shift: 'A' },
    { id: 'OP-D07', role: 'Room attendant', zone: 'ZONE-HOUSEKEEPING', shift: 'B' },
    { id: 'OP-D08', role: 'Room attendant', zone: 'ZONE-HOUSEKEEPING', shift: 'B' },
    { id: 'OP-D09', role: 'Laundry attendant', zone: 'ZONE-LAUNDRY', shift: 'B' },
    { id: 'OP-D10', role: 'Laundry attendant', zone: 'ZONE-LAUNDRY', shift: 'B' },
    { id: 'OP-D11', role: 'Houseperson', zone: 'ZONE-SERVICE', shift: 'B' },
    { id: 'OP-D12', role: 'Houseperson', zone: 'ZONE-SERVICE', shift: 'B' }
  ];
  var SUPPORT = [
    { id: 'SUP-A', role: 'Floor supervisor', shift: 'A' },
    { id: 'SUP-B', role: 'Floor supervisor', shift: 'B' },
    { id: 'CAP-T1', role: 'Capture technician', shift: 'A' },
    { id: 'CAP-T2', role: 'Capture technician', shift: 'B' },
    { id: 'QA-R1', role: 'Operational QA reviewer', shift: 'A/B' }
  ];

  var VIEWS = [
    { id: 'first_person_rgb', name: 'First-person RGB', mount: 'Head-worn', note: 'Hands and near-field objects' },
    { id: 'fixed_overview_rgb', name: 'Fixed overview RGB', mount: 'Ceiling, room corner', note: 'Whole-body and scene state' },
    { id: 'fixed_side_rgb', name: 'Fixed side RGB', mount: 'Wall, working height', note: 'Hand/object contact from the side' }
  ];

  var REASONS = {
    DEMO_CRITERIA_MET: { label: 'Criteria met (demo)', cls: 'ok', text: 'All three views present; hand and object visibility above the demo threshold; step sequence complete.' },
    DEMO_HUMAN_REVIEW_REQUIRED: { label: 'Human review required', cls: 'hold', text: 'Preflight could not decide. A reviewer must inspect step completion before the episode can be counted.' },
    DEMO_VIEWPOINT_NONCOMPLIANT: { label: 'Viewpoint non-compliant', cls: 'bad', text: 'Capture defect: the fixed side view lost hand/object contact during the critical step. The recording does not meet the capture specification.' }
  };

  var STATIONS = 6;          // two stations per zone, simulated
  var DAY_START = 7 * 60;    // shift A 07:00 to 15:00, shift B 15:00 to 23:00, simulated
  var DAY_MINUTES = 16 * 60;

  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function pad(n, w) { n = String(n); while (n.length < (w || 2)) n = '0' + n; return n; }
  function fmt(n) { return Number(n || 0).toLocaleString('en-US'); }

  /* ---------------------------------------------------------------- program */
  function buildProgram(order, fixture) {
    var episodes = fixture.episodes;
    var variants = order.variants.map(function (v, i) { return Object.assign({ index: i }, v); });
    var vById = {}; variants.forEach(function (v) { vById[v.variant_id] = v; });
    var groups = {};
    variants.forEach(function (v) { groups[v.variant_id] = { acc: [], rej: [], held: [] }; });
    episodes.forEach(function (e) {
      var g = groups[e.variant_id];
      if (!g) throw new Error('Unknown variant ' + e.variant_id);
      (e.qa_disposition === 'accepted' ? g.acc : e.qa_disposition === 'rejected' ? g.rej : g.held).push(e);
    });
    // Per-variant attempt order (deterministic). A rejected attempt is followed immediately by
    // its recapture, which is one of the fixture's accepted records. Lineage is simulation metadata
    // derived here; the fixture file itself is unchanged.
    var lists = variants.map(function (v, i) {
      var g = groups[v.variant_id];
      var acc = g.acc.slice(); var list = acc.slice(0, acc.length - g.rej.length);
      var recaps = acc.slice(acc.length - g.rej.length);
      var heldAt = [9 + (i * 3) % 7, 17 + (i * 5) % 6];
      g.held.forEach(function (h, k) { list.splice(Math.min(list.length, heldAt[k] + k), 0, { ep: h }); });
      list = list.map(function (x) { return x.ep ? x : { ep: x }; });
      var rejAt = 2 + (i * 5) % 18;
      g.rej.forEach(function (r, k) { list.splice(Math.min(list.length, rejAt + k), 0, { ep: r, recapture: recaps[k] }); });
      return list;
    });
    var seq = [];
    var rounds = Math.max.apply(null, lists.map(function (l) { return l.length; }));
    for (var r = 0; r < rounds; r++) {
      for (var i = 0; i < lists.length; i++) {
        var it = lists[i][r]; if (!it) continue;
        seq.push({ ep: it.ep });
        if (it.recapture) seq.push({ ep: it.recapture, recaptureOf: it.ep.episode_id });
      }
    }
    var attemptCount = {}; var minutes = 0; var byId = {};
    seq.forEach(function (it, idx) {
      var ep = it.ep, t = TASKS[ep.task_id], v = vById[ep.variant_id];
      attemptCount[ep.variant_id] = (attemptCount[ep.variant_id] || 0) + 1;
      it.idx = idx; it.id = ep.episode_id; it.variant = v; it.task = ep.task_id; it.zone = ep.zone_id;
      it.room = ZONES[ep.zone_id].room; it.disp = ep.qa_disposition; it.reason = ep.reason_code;
      it.attempt = attemptCount[ep.variant_id];
      it.station = ZONES[ep.zone_id].stations[(hash(ep.episode_id) % 2)];
      minutes += (t.captureMin + t.resetMin) / STATIONS;
      it.simMinute = minutes;
      var dayIdx = Math.floor(minutes / DAY_MINUTES), inDay = minutes % DAY_MINUTES;
      it.shift = inDay < 480 ? 'A' : 'B';
      var ops = OPERATORS.filter(function (o) { return o.zone === ep.zone_id && o.shift === it.shift; });
      it.operator = ops[hash(ep.episode_id + 'op') % ops.length].id;
      it.day = dayIdx + 1;
      byId[it.id] = it;
    });
    seq.forEach(function (it) { if (it.recaptureOf) byId[it.recaptureOf].recapturedBy = it.id; });
    var firstReject = -1;
    for (var k = 0; k < seq.length; k++) if (seq[k].disp === 'rejected') { firstReject = k; break; }
    return { order: order, fixture: fixture, variants: variants, variantById: vById, seq: seq, byId: byId, firstReject: firstReject, total: seq.length };
  }

  function simClock(prog, cursor) {
    var m = cursor > 0 ? prog.seq[Math.min(cursor, prog.total) - 1].simMinute : 0;
    var day = Math.floor(m / DAY_MINUTES) + 1, inDay = m % DAY_MINUTES, t = DAY_START + Math.round(inDay);
    return 'Day ' + day + ' ' + pad(Math.floor(t / 60) % 24) + ':' + pad(t % 60);
  }

  /* ---------------------------------------------------------------- state */
  function initialState(orderId) {
    return {
      v: 1, order: orderId || 'M1-DEMO-001', phase: 'DRAFT', cursor: 0,
      profile: 'fixture', location: 'tba', assumed: false,
      gate: 'none', // none | flagged | inspected | reset_requested | resolved
      guided: true, evalState: 'none', // none | imported | proposed
      marks: [] // [phase, cursor] transitions, for the trace
    };
  }

  function phaseIndex(p) { return PHASES.indexOf(p); }

  function issues(st) {
    var out = [];
    if (st.profile === 'depth') out.push({ level: 'block', code: 'MODALITY_NOT_CONFIGURED', text: 'Calibrated depth is not part of this capture profile. It needs a separately configured and validated sensor; it cannot be derived from the RGB views.' });
    if (st.profile === 'actions') out.push({ level: 'block', code: 'ROBOT_ACTIONS_UNAVAILABLE', text: 'Human RGB video does not contain robot joint actions. Robot-native trajectories need an authorized hardware session and a different commercial unit.' });
    if (st.location === 'ca' || st.location === 'az') out.push({ level: 'flag', code: 'GEOGRAPHY_UNCONFIRMED', text: 'micro1\'s public Video Capture Partner listing names 26 US states and does not include ' + (st.location === 'ca' ? 'California' : 'Arizona') + '. A bespoke program would need its own confirmed eligibility.' });
    if (st.location === 'tba') out.push({ level: 'flag', code: 'SITE_TO_BE_AGREED', text: 'No site selected. Location eligibility must be confirmed with micro1 before any live pilot.' });
    return out;
  }
  function blocked(st) { return issues(st).some(function (i) { return i.level === 'block'; }); }

  function mark(st) { st.marks.push([st.phase, st.cursor]); }

  // Every transition is explicit. Returns {ok, msg}.
  function act(prog, st, action) {
    var p = st.phase;
    switch (action) {
      case 'submit':
        if (p !== 'DRAFT') return no('The brief was already submitted.');
        st.phase = 'NEEDS_CONFIRMATION'; mark(st); return yes('Brief recorded in this browser only. Nothing was sent to micro1 or anyone else.');
      case 'assume':
        if (p !== 'NEEDS_CONFIRMATION') return no('Approvals can only be assumed while the order needs confirmation.');
        if (blocked(st)) return no('Blocked: resolve the capture-profile issue first. A demo approval cannot make an unavailable modality available.');
        st.assumed = true; st.phase = 'DEMO_APPROVED'; mark(st); return yes('Demo approvals assumed for this fictional order only. Real protocol, site, consent, safety, rights and commercial approvals remain unconfirmed.');
      case 'configure':
        if (p !== 'DEMO_APPROVED') return no('Configure after approvals are assumed.');
        st.phase = 'CONFIGURED'; mark(st); return yes('Three task families mapped to compatible rooms. Only hospitality rooms are allocated.');
      case 'start':
        if (p === 'NEEDS_CONFIRMATION' || p === 'DRAFT') return no('Blocked: approvals are unconfirmed.');
        if (p !== 'CONFIGURED') return no('Collection can start once environments are configured.');
        st.phase = 'CAPTURING'; mark(st); return yes('Simulated collection started.');
      case 'inspect':
        if (st.gate !== 'flagged') return no('Nothing is waiting for inspection.');
        st.gate = 'inspected'; return yes('Evidence opened for the flagged attempt.');
      case 'request_reset':
        if (st.gate !== 'inspected' && st.gate !== 'flagged') return no('Inspect the evidence first.');
        st.gate = 'reset_requested'; return yes('Reviewer requested a side-camera and scene reset before a new attempt.');
      case 'close':
        if (p !== 'READY_FOR_DELIVERY') return no('The demo closes after the manifest is ready.');
        st.phase = 'DEMO_CLOSED'; mark(st); return yes('Demo closed. No delivery was made.');
      case 'import_eval':
        if (phaseIndex(p) < phaseIndex('READY_FOR_DELIVERY')) return no('The evaluation scenario is available after the manifest is ready.');
        st.evalState = 'imported'; return yes('Fictional evaluation finding imported.');
      case 'propose_brief':
        if (st.evalState !== 'imported') return no('Import the fictional finding first.');
        st.evalState = 'proposed'; return yes('Follow-up brief drafted. It awaits approval and has not been sent.');
    }
    return no('Unknown action');
    function yes(m) { return { ok: true, msg: m }; }
    function no(m) { return { ok: false, msg: m }; }
  }

  // Advance the capture cursor by up to n attempts. Stops at the guided review gate.
  function advance(prog, st, n) {
    if (st.phase !== 'CAPTURING') return 0;
    var moved = 0;
    while (moved < n && st.cursor < prog.total) {
      if (st.gate === 'flagged' || st.gate === 'inspected') break;
      if (st.gate === 'reset_requested') { st.gate = 'resolved'; }
      st.cursor++; moved++;
      if (st.cursor - 1 === prog.firstReject && st.gate === 'none') {
        if (st.guided) { st.gate = 'flagged'; break; } else st.gate = 'resolved';
      }
    }
    if (st.cursor >= prog.total && st.phase === 'CAPTURING') { st.phase = 'QA_REVIEW'; mark(st); }
    return moved;
  }
  function finishQA(prog, st) {
    if (st.phase !== 'QA_REVIEW') return false;
    var c = counts(prog, st);
    if (c.variantsMet !== prog.variants.length) return false; // never ready with a missing variant
    st.phase = 'READY_FOR_DELIVERY'; mark(st); return true;
  }

  /* ---------------------------------------------------------------- derived views */
  function counts(prog, st) {
    var c = { captured: 0, accepted: 0, held: 0, rejected: 0, recaptures: 0, streams: 0, target: prog.order.requested_output.target, byTask: {}, byVariant: {}, byRoom: {}, variantsMet: 0 };
    Object.keys(TASKS).forEach(function (t) { c.byTask[t] = { accepted: 0, held: 0, rejected: 0, captured: 0, target: 0 }; });
    prog.variants.forEach(function (v) { c.byVariant[v.variant_id] = { accepted: 0, held: 0, rejected: 0, quota: v.accepted_quota }; c.byTask[v.task_id].target += v.accepted_quota; });
    for (var i = 0; i < st.cursor; i++) {
      var it = prog.seq[i], key = it.disp === 'accepted' ? 'accepted' : it.disp === 'rejected' ? 'rejected' : 'held';
      c.captured++; c[key]++; c.byTask[it.task][key]++; c.byTask[it.task].captured++; c.byVariant[it.variant.variant_id][key]++;
      if (it.recaptureOf) c.recaptures++;
    }
    // Three camera streams belong to ONE episode. Streams never add to the episode count.
    c.streams = c.captured * VIEWS.length;
    prog.variants.forEach(function (v) { if (c.byVariant[v.variant_id].accepted >= v.accepted_quota) c.variantsMet++; });
    Object.keys(TASKS).forEach(function (t) { var z = ZONES[TASKS[t].zone].room; c.byRoom[z] = c.byTask[t].target ? c.byTask[t].accepted / c.byTask[t].target : 0; });
    c.reconciles = c.captured === c.accepted + c.held + c.rejected;
    c.progress = prog.total ? c.captured / prog.total : 0;
    return c;
  }

  function current(prog, st) { return st.cursor > 0 ? prog.seq[st.cursor - 1] : null; }

  function allocatedRooms(st) {
    return phaseIndex(st.phase) >= phaseIndex('CONFIGURED') ? ['guest', 'laundry', 'boh'] : [];
  }

  /* Operational trace. Scripted and rule-based events derived from state. Not model reasoning. */
  function trace(prog, st, limit) {
    var ev = [];
    var o = prog.order.order_id;
    function push(cursor, e) { e.cursor = cursor; e.time = simClock(prog, cursor); e.order = o; ev.push(e); }
    st.marks.forEach(function (m) {
      var p = m[0], c = m[1];
      if (p === 'NEEDS_CONFIRMATION') {
        push(c, { actor: 'Visitor (demo)', kind: 'simulated', action: 'Requirement v1 recorded locally', evidence: 'Brief ' + o + ', 3 task families, 48 variants', rule: 'No external submission', state: 'DRAFT to NEEDS_CONFIRMATION', approval: 'Protocol, site, consent, safety, rights, commercial scope' });
        issues(st).forEach(function (i) { push(c, { actor: 'Rules engine', kind: 'rule', action: i.level === 'block' ? 'Blocked prerequisite' : 'Assumption flagged', evidence: i.code, rule: i.text, state: 'NEEDS_CONFIRMATION', approval: i.level === 'block' ? 'Change capture profile' : 'Confirm with micro1' }); });
      }
      if (p === 'DEMO_APPROVED') push(c, { actor: 'Visitor (demo)', kind: 'simulated', action: 'Assumed approvals applied for demo only', evidence: '7 approvals marked assumed, not confirmed', rule: 'Guided-demo override', state: 'NEEDS_CONFIRMATION to DEMO_APPROVED', approval: 'Real approvals still required' });
      if (p === 'CONFIGURED') {
        push(c, { actor: 'Rules engine', kind: 'rule', action: 'Compatible rooms found', evidence: 'Guest-room suites, Laundry & linen, Service & supply', rule: 'Task zone match; non-hospitality rooms excluded', state: 'DEMO_APPROVED to CONFIGURED', approval: 'None in demo' });
        push(c, { actor: 'Rules engine', kind: 'rule', action: 'Variation recipe scheduled', evidence: '3 tasks x 4 layouts x 2 lighting x 2 clutter = 48 variants', rule: '25 accepted per variant', state: 'CONFIGURED', approval: 'None in demo' });
        push(c, { actor: 'Rules engine', kind: 'rule', action: 'Operator qualification checked', evidence: '12 fictional operators, 2 shifts, task sign-offs on file (fictional)', rule: 'Qualified role per task family', state: 'CONFIGURED', approval: 'Supervisor sign-off (fictional)' });
        push(c, { actor: 'CAP-T1 (fictional)', kind: 'simulated', action: 'Sensor profile validated', evidence: 'CP-DEMO-POV-3RGB: 3 RGB views, no depth, no IMU, no robot actions', rule: 'Profile matches order; hardware spec to be agreed', state: 'CONFIGURED', approval: 'None in demo' });
        push(c, { actor: 'SUP-A (fictional)', kind: 'simulated', action: 'Consent and safety gate passed in demo', evidence: 'Assumed approvals only', rule: 'Guided-demo override', state: 'CONFIGURED', approval: 'Real consent and site risk assessment required' });
      }
      if (p === 'CAPTURING') push(c, { actor: 'SUP-A (fictional)', kind: 'simulated', action: 'Collection started', evidence: '6 stations across 3 rooms', rule: 'Shift A roster', state: 'CONFIGURED to CAPTURING', approval: 'None in demo' });
      if (p === 'QA_REVIEW') push(c, { actor: 'QA-R1 (fictional)', kind: 'simulated', action: 'Capture complete, reconciliation started', evidence: 'Episode count vs dispositions', rule: 'captured = accepted + held + rejected', state: 'CAPTURING to QA_REVIEW', approval: 'None in demo' });
      if (p === 'READY_FOR_DELIVERY') push(c, { actor: 'Rules engine', kind: 'rule', action: 'Manifest created', evidence: 'MAN-' + o + '-v1: 1,200 accepted, 72 outstanding review, 48 rejected retained', rule: 'All 48 variant quotas met', state: 'QA_REVIEW to READY_FOR_DELIVERY', approval: 'micro1 and buyer final acceptance (not simulated)' });
      if (p === 'DEMO_CLOSED') push(c, { actor: 'Visitor (demo)', kind: 'simulated', action: 'Demo closed', evidence: 'No delivery made', rule: '', state: 'READY_FOR_DELIVERY to DEMO_CLOSED', approval: '' });
    });
    var milestones = { 'TASK-LINEN': 0, 'TASK-LAUNDRY': 0, 'TASK-CART': 0 }, tAcc = { 'TASK-LINEN': 0, 'TASK-LAUNDRY': 0, 'TASK-CART': 0 };
    for (var i = 0; i < st.cursor; i++) {
      var it = prog.seq[i];
      if (it.shift !== (i ? prog.seq[i - 1].shift : 'A') || (i && it.day !== prog.seq[i - 1].day)) {
        push(i, { actor: 'SUP-' + it.shift + ' (fictional)', kind: 'simulated', action: 'Shift ' + it.shift + ' assigned', evidence: OPERATORS.filter(function (o) { return o.shift === it.shift; }).map(function (o) { return o.id; }).join(', '), rule: 'Qualified role per station', state: 'CAPTURING', approval: 'None in demo' });
      }
      if (it.disp === 'rejected') {
        var guided = i === prog.firstReject && st.guided;
        push(i + 1, { actor: 'Preflight QA', kind: 'rule', action: 'Sample flagged: capture defect', ref: it.id, evidence: 'Side view, attempt ' + it.attempt + ', ' + it.variant.variant_id, rule: 'DEMO_VIEWPOINT_NONCOMPLIANT: hand/object contact not visible in fixed side view', state: 'Episode REJECTED', approval: 'Reviewer decision' });
        if (i + 1 < st.cursor || (i === prog.firstReject && (st.gate === 'reset_requested' || st.gate === 'resolved'))) {
          push(i + 1, { actor: guided ? 'Visitor as reviewer (demo)' : 'QA-R1 (fictional)', kind: guided ? 'simulated' : 'rule', action: 'Reviewer decision: reset and recapture', ref: it.id, evidence: 'Evidence inspected', rule: guided ? 'Human decision in guided demo' : 'Rule-based in fast demo', state: 'Recapture requested', approval: 'Reviewer' });
          push(i + 1, { actor: it.operator + ' (fictional)', kind: 'simulated', action: 'Scene reset, side camera re-aimed, setup checked', ref: it.id, evidence: it.station + ', recipe ' + it.variant.variant_id, rule: 'Reset checklist', state: 'Ready for new attempt', approval: 'None in demo' });
        }
      }
      if (it.recaptureOf) push(i + 1, { actor: it.operator + ' (fictional)', kind: 'simulated', action: 'New attempt captured', ref: it.id, evidence: 'Lineage: recapture of ' + it.recaptureOf + ' (original retained)', rule: 'Recapture keeps rejected attempt', state: 'Episode ACCEPTED', approval: 'None in demo' });
      if (it.disp === 'held_for_review') push(i + 1, { actor: 'Preflight QA', kind: 'rule', action: 'Held for human review', ref: it.id, evidence: it.variant.variant_id + ', attempt ' + it.attempt, rule: 'DEMO_HUMAN_REVIEW_REQUIRED', state: 'Episode HELD', approval: 'Human reviewer' });
      if (it.disp === 'accepted') {
        tAcc[it.task]++;
        var q = Math.floor(tAcc[it.task] / 100);
        if (q > milestones[it.task] && tAcc[it.task] % 100 === 0) {
          milestones[it.task] = q;
          push(i + 1, { actor: 'Rules engine', kind: 'rule', action: TASKS[it.task].name + ' coverage ' + (q * 25) + '%', evidence: tAcc[it.task] + ' of 400 accepted', rule: 'Counted from fixture records', state: 'CAPTURING', approval: 'None in demo' });
        }
      }
    }
    if (st.evalState !== 'none') push(st.cursor, { actor: 'Model owner (fictional)', kind: 'simulated', action: 'Evaluation finding imported', ref: 'EVAL-DEMO-01', evidence: 'Capability gap, not a capture defect', rule: 'Separate holdout evaluation', state: 'Finding logged', approval: 'None' });
    if (st.evalState === 'proposed') push(st.cursor, { actor: 'Rules engine', kind: 'rule', action: 'Follow-up brief drafted', ref: 'M1-DEMO-002', evidence: 'Targets dim + moderate clutter linen variants', rule: 'Capability gap becomes a proposed order', state: 'DRAFT, awaiting approval', approval: 'micro1 and model owner' });
    ev.sort(function (a, b) { return a.cursor - b.cursor; });
    return limit ? ev.slice(-limit) : ev;
  }

  function manifest(prog, st) {
    var ready = phaseIndex(st.phase) >= phaseIndex('READY_FOR_DELIVERY');
    var c = counts(prog, st);
    var acc = [], held = [], rej = [];
    for (var i = 0; i < st.cursor; i++) {
      var it = prog.seq[i];
      var row = { episode_id: it.id, variant_id: it.variant.variant_id, task_id: it.task, attempt: it.attempt, station: it.station, operator_ref: it.operator, reason_code: it.reason, evidence_refs: VIEWS.map(function (v) { return 'EVD-' + it.id + '-' + v.id; }) };
      if (it.recaptureOf) row.recapture_of = it.recaptureOf;
      if (it.recapturedBy) row.recaptured_by = it.recapturedBy;
      (it.disp === 'accepted' ? acc : it.disp === 'rejected' ? rej : held).push(row);
    }
    return {
      schema: 'metari.proposed_demo_manifest.v1',
      notice: 'SIMULATION. Fictional manifest assembled in the browser. No recordings, no upload, no micro1 integration, no final acceptance.',
      manifest_id: 'MAN-' + prog.order.order_id + '-v1',
      status: ready ? 'ready_for_agreed_delivery_in_simulation' : 'incomplete',
      order_id: prog.order.order_id,
      proposed_parties: prog.order.proposed_parties,
      capture_profile: prog.order.capture_profile,
      counts: { captured: c.captured, accepted: c.accepted, held_for_review: c.held, rejected: c.rejected, camera_streams_not_episodes: c.streams, variants_meeting_quota: c.variantsMet + ' of ' + prog.variants.length },
      final_acceptance: 'Owned by micro1 and the buyer under agreed criteria. Not simulated.',
      actual_submission: false,
      accepted: acc, held_for_review_outstanding: held, rejected_retained_not_delivered: rej
    };
  }

  function evaluationScenario() {
    return {
      finding: {
        id: 'EVAL-DEMO-01', fictional: true, source: 'Fictional model owner, separate holdout set',
        class: 'capability_gap',
        summary: 'Across a fictional holdout of linen-placement trials, the evaluated policy repeatedly failed to seat the fitted-sheet corner under dim lighting with moderate clutter. The recordings were valid; the failure is the agent\'s.',
        not: 'This is not a capture defect and says nothing about recording quality. It is also not evidence that the collected data improved or degraded any model.'
      },
      brief: {
        order_id: 'M1-DEMO-002', status: 'DRAFT, awaiting approval', fictional: true,
        task: 'Linen placement', variants: 'Layouts A to D x dim lighting x moderate clutter, plus a new reset variable: nightstand blocking the corner reach',
        evaluation: 'Hold out a separate configuration set for re-evaluation. Do not reuse collection scenes as the test.',
        approvals: ['micro1 technical lead', 'Model owner', 'Commercial scope']
      }
    };
  }

  /* ---------------------------------------------------------------- persistence (URL) */
  function encode(st) {
    return ['o' + st.order, 'p' + phaseIndex(st.phase), 'c' + st.cursor, 'g' + ['none', 'flagged', 'inspected', 'reset_requested', 'resolved'].indexOf(st.gate), 'e' + ['none', 'imported', 'proposed'].indexOf(st.evalState), 'm' + (st.guided ? 1 : 0), 'f' + st.profile, 'l' + st.location, 'k' + st.marks.map(function (m) { return phaseIndex(m[0]) + '-' + m[1]; }).join('_')].join('.');
  }
  function decode(s, prog) {
    var st = initialState();
    if (!s) return st;
    try {
      s.split('.').forEach(function (part) {
        var k = part[0], v = part.slice(1);
        if (k === 'o') st.order = v;
        if (k === 'p' && PHASES[+v]) st.phase = PHASES[+v];
        if (k === 'c') st.cursor = Math.max(0, Math.min(prog ? prog.total : 1e9, parseInt(v, 10) || 0));
        if (k === 'g') st.gate = ['none', 'flagged', 'inspected', 'reset_requested', 'resolved'][+v] || 'none';
        if (k === 'e') st.evalState = ['none', 'imported', 'proposed'][+v] || 'none';
        if (k === 'm') st.guided = v === '1';
        if (k === 'f' && ['fixture', 'depth', 'actions'].indexOf(v) >= 0) st.profile = v;
        if (k === 'l' && ['tba', 'ca', 'az', 'listed'].indexOf(v) >= 0) st.location = v;
        if (k === 'k' && v) st.marks = v.split('_').map(function (x) { var a = x.split('-'); return [PHASES[+a[0]], +a[1]]; }).filter(function (m) { return m[0]; });
      });
      st.assumed = phaseIndex(st.phase) >= phaseIndex('DEMO_APPROVED');
      // Guard against an inconsistent link: a cursor only exists while or after capturing.
      if (phaseIndex(st.phase) < phaseIndex('CAPTURING')) st.cursor = 0;
      if (prog && phaseIndex(st.phase) >= phaseIndex('QA_REVIEW')) st.cursor = prog.total;
      if (prog && st.phase === 'CAPTURING' && st.cursor > prog.firstReject && st.gate === 'none') st.gate = 'resolved';
    } catch (e) { return initialState(); }
    return st;
  }

  /* ---------------------------------------------------------------- loading */
  var cache = null;
  function load(base) {
    base = base || '/micro1/data/';
    if (cache) return cache;
    cache = Promise.all([fetch(base + 'demo-order.json').then(ok), fetch(base + 'demo-episodes.json').then(ok)])
      .then(function (r) { return buildProgram(r[0], r[1]); });
    return cache;
    function ok(res) { if (!res.ok) throw new Error('Fixture failed to load: ' + res.status); return res.json(); }
  }

  /* ---------------------------------------------------------------- controller (timers) */
  // One timer per page. Stops when paused, blocked, finished, hidden or reset.
  function Controller(prog, st, onChange) {
    this.prog = prog; this.st = st; this.onChange = onChange; this.timer = 0; this.running = false; this.speed = 1; this.auto = false;
    var self = this;
    this._vis = function () { if (document.hidden) self._clear(); else if (self.running) self._schedule(); };
    document.addEventListener('visibilitychange', this._vis);
  }
  Controller.prototype._clear = function () { if (this.timer) { clearTimeout(this.timer); this.timer = 0; } };
  Controller.prototype._schedule = function () {
    var self = this; this._clear();
    if (!this.running || document.hidden) return;
    this.timer = setTimeout(function () { self.timer = 0; self.step(); }, this.st.phase === 'CAPTURING' ? 110 : 900);
  };
  Controller.prototype.step = function () {
    var st = this.st, prog = this.prog, msg = null;
    if (st.phase === 'DEMO_APPROVED' && this.auto) msg = act(prog, st, 'configure').msg;
    else if (st.phase === 'CONFIGURED' && this.auto) msg = act(prog, st, 'start').msg;
    else if (st.phase === 'CAPTURING') {
      advance(prog, st, this.speed === 1 ? 4 : 18);
      if (st.gate === 'flagged') { this.running = false; msg = 'Paused for review: ' + prog.seq[prog.firstReject].id + ' was flagged by preflight QA.'; }
    } else if (st.phase === 'QA_REVIEW') { finishQA(prog, st); msg = 'Manifest ready for agreed delivery (simulated). Nothing was uploaded.'; }
    if (st.phase === 'READY_FOR_DELIVERY' || st.phase === 'DEMO_CLOSED' || st.phase === 'NEEDS_CONFIRMATION' || st.phase === 'DRAFT') this.running = false;
    this.onChange(msg);
    if (this.running) this._schedule();
  };
  Controller.prototype.play = function (auto) { this.auto = auto !== false; this.running = true; this._schedule(); this.onChange(null); };
  Controller.prototype.pause = function () { this.running = false; this._clear(); this.onChange('Paused. Resume at any time.'); };
  Controller.prototype.reset = function () { this.running = false; this._clear(); var fresh = initialState(this.st.order); fresh.guided = this.st.guided; fresh.profile = 'fixture'; fresh.location = this.st.location; Object.keys(this.st).forEach(function (k) { delete this.st[k]; }, this); Object.assign(this.st, fresh); this.onChange('Reset. All timers cleared and the order returned to draft.'); };
  Controller.prototype.destroy = function () { this._clear(); document.removeEventListener('visibilitychange', this._vis); };

  var api = {
    PHASES: PHASES, PHASE_LABEL: PHASE_LABEL, ZONES: ZONES, TASKS: TASKS, OPERATORS: OPERATORS, SUPPORT: SUPPORT, VIEWS: VIEWS, REASONS: REASONS,
    buildProgram: buildProgram, initialState: initialState, act: act, advance: advance, finishQA: finishQA,
    counts: counts, current: current, trace: trace, manifest: manifest, issues: issues, blocked: blocked,
    allocatedRooms: allocatedRooms, evaluationScenario: evaluationScenario, simClock: simClock,
    encode: encode, decode: decode, load: load, Controller: Controller, phaseIndex: phaseIndex, fmt: fmt
  };
  root.MetariOrder = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
