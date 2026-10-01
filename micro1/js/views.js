/* Metari x micro1 concept: shared view renderers (HTML strings) used by both the
 * partnership page and the Command Center workspace so the two never disagree. */
(function (root) {
  'use strict';
  var M = root.MetariOrder;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var fmt = M.fmt;
  var IMG = { 'TASK-LINEN': 'linen', 'TASK-LAUNDRY': 'laundry', 'TASK-CART': 'cart' };
  var VIEW_KEY = { first_person_rgb: 'pov', fixed_overview_rgb: 'overview', fixed_side_rgb: 'side' };
  var FLAG = { linen: 'left:14%;top:50%;width:30%;height:30%', laundry: 'left:52%;top:58%;width:34%;height:30%', cart: 'left:52%;top:40%;width:34%;height:40%' };
  var LAYOUT = { A: 'Layout A', B: 'Layout B', C: 'Layout C', D: 'Layout D' };

  function taskForRoom(room) { return Object.keys(M.TASKS).filter(function (t) { return M.ZONES[M.TASKS[t].zone].room === room; })[0] || null; }
  function roomMeta(id) { return (root.MetariArchitecture && root.MetariArchitecture.ROOMS.find(function (r) { return r.id === id; })) || { id: id, label: id, floor: 0 }; }
  function levelName(f) { return f < 0 ? 'Grounds' : 'Level 0' + (f + 1); }

  function metrics(prog, st) {
    var c = M.counts(prog, st);
    var cells = [
      ['Captured', fmt(c.captured), 'of ' + fmt(prog.total) + ' planned attempts'],
      ['Accepted in demo QA', fmt(c.accepted), 'target ' + fmt(c.target)],
      ['Held for review', fmt(c.held), 'outstanding, not counted'],
      ['Rejected', fmt(c.rejected), fmt(c.recaptures) + ' recaptured, originals kept'],
      ['Variants at quota', c.variantsMet + '/' + prog.variants.length, '25 accepted each'],
      ['Camera streams', fmt(c.streams), '3 per episode, not episodes']
    ];
    return '<dl class="metrics">' + cells.map(function (x, i) { return '<div class="metric' + (i === 2 ? ' hold' : i === 3 ? ' bad' : '') + '"><dt class="mono">' + x[0] + '</dt><dd>' + x[1] + '<small>' + x[2] + '</small></dd></div>'; }).join('') + '</dl>' +
      '<p class="recon mono" data-reconciles="' + c.reconciles + '">' + fmt(c.captured) + ' captured = ' + fmt(c.accepted) + ' accepted + ' + fmt(c.held) + ' held + ' + fmt(c.rejected) + ' rejected' + (c.reconciles ? '' : ' (MISMATCH)') + '</p>';
  }

  function traceRows(events) {
    if (!events.length) return '<li class="tr-empty">No events yet. The trace records scripted and rule-based demo events, not model reasoning.</li>';
    return events.slice().reverse().map(function (e) {
      return '<li class="tr ' + e.kind + '"><div class="tr-top mono"><span>' + esc(e.time) + '</span><span class="tr-kind">' + (e.kind === 'rule' ? 'Rule-based' : 'Simulated') + '</span></div>' +
        '<b>' + esc(e.action) + '</b>' +
        '<dl><dt>Actor</dt><dd>' + esc(e.actor) + '</dd>' + (e.ref ? '<dt>Ref</dt><dd class="mono">' + esc(e.ref) + '</dd>' : '') +
        '<dt>Evidence</dt><dd>' + esc(e.evidence) + '</dd>' + (e.rule ? '<dt>Rule</dt><dd>' + esc(e.rule) + '</dd>' : '') +
        '<dt>State</dt><dd>' + esc(e.state) + '</dd>' + (e.approval ? '<dt>Approval</dt><dd>' + esc(e.approval) + '</dd>' : '') + '</dl></li>';
    }).join('');
  }

  function roomInfo(prog, st, id) {
    if (!id) return '<div class="room-empty"><span class="mono">Select a room</span><p>Click a labelled room in the scene, a room chip, or use the 2D plan. Its tasks, capture profile, reset variables and current demo assignment appear here.</p></div>';
    var r = roomMeta(id), plan = (root.MetariPlans || {})[id] || {}, t = taskForRoom(id), alloc = M.allocatedRooms(st).indexOf(id) >= 0;
    var h = '<div class="room-card"><div class="room-head"><span class="mono">' + levelName(r.floor) + ' · ' + esc(id.toUpperCase()) + '</span><h4>' + esc(r.label) + '</h4></div>';
    if (!t) {
      var mock = id === 'senior' || id === 'residential' ? ' Non-clinical mock environment. No residents or patients.' : id === 'showroom' ? ' Bounded evaluation space for agreed, supervised tests only.' : '';
      return h + '<p class="room-state">Not allocated to ' + esc(st.order) + '. Planned expansion example, not asserted buyer demand.' + mock + '</p>' + (plan.description ? '<p class="muted">' + esc(plan.description) + '</p>' : '') + '</div>';
    }
    var T = M.TASKS[t], c = M.counts(prog, st), bt = c.byTask[t];
    var cams = (plan.cameras || []).filter(function (x) { return x.enabled; });
    var last = null; for (var i = st.cursor - 1; i >= 0; i--) if (prog.seq[i].room === id) { last = prog.seq[i]; break; }
    h += '<p class="room-state">' + (alloc ? 'Allocated to ' + esc(st.order) + ' · ' + esc(T.name) : 'Compatible with ' + esc(T.name) + '. Allocation happens when the order is configured.') + '</p>';
    h += '<dl class="kv"><dt>Task steps</dt><dd>' + T.steps.map(esc).join(' → ') + '</dd>' +
      '<dt>Capture profile</dt><dd>CP-DEMO-POV-3RGB: first-person RGB + fixed overview RGB + fixed side RGB. No depth, IMU or robot actions.</dd>' +
      '<dt>Concept camera plan</dt><dd>' + cams.length + ' planned mounts, e.g. ' + cams.slice(0, 2).map(function (x) { return esc(x.name); }).join('; ') + '. Design assumptions, not calibrated.</dd>' +
      '<dt>Reset variables</dt><dd>' + T.reset.map(esc).join('<br>') + '</dd>' +
      '<dt>Accepted (demo)</dt><dd>' + fmt(bt.accepted) + ' / ' + fmt(bt.target) + (bt.held ? ' · ' + bt.held + ' held' : '') + (bt.rejected ? ' · ' + bt.rejected + ' rejected' : '') + '</dd>' +
      '<dt>Current assignment</dt><dd>' + (last ? '<span class="mono">' + esc(last.id) + '</span> · ' + esc(last.station) + ' · ' + esc(last.operator) + ' (fictional) · ' + variantText(last.variant) : 'None yet') + '</dd></dl>';
    if (plan.privacy) h += '<p class="muted small">' + esc(plan.privacy) + '</p>';
    return h + '</div>';
  }

  function variantText(v) { return esc(v.variant_id) + ' · ' + LAYOUT[v.layout] + ', ' + v.lighting + ' light, ' + v.clutter + ' clutter'; }

  // Evidence panel. Stills are concept renderings, never a recording or a live feed.
  function evidence(prog, st, item, viewId, opts) {
    opts = opts || {};
    if (!item) return '<div class="ev-empty"><span class="mono">No episode selected</span><p>Evidence appears once the simulation has captured an attempt.</p></div>';
    var key = IMG[item.task], vk = VIEW_KEY[viewId] || 'overview';
    var flagged = item.disp === 'rejected' && vk === 'side';
    var reason = M.REASONS[item.reason];
    var h = '<div class="ev">';
    h += '<div class="ev-tabs" role="tablist" aria-label="Camera view">' + M.VIEWS.map(function (v) {
      return '<button type="button" role="tab" data-view="' + v.id + '" aria-selected="' + (v.id === viewId) + '">' + esc(v.name) + '</button>';
    }).join('') + '</div>';
    h += '<figure class="ev-frame' + (flagged ? ' flagged' : '') + '"><img src="/micro1/img/evidence/' + key + '-' + vk + '.jpg" alt="Concept still for the ' + esc(M.VIEWS.filter(function (v) { return v.id === viewId; })[0].name) + ' of ' + esc(M.TASKS[item.task].name) + '. Illustrative, not a recording." loading="lazy">' +
      '<span class="ev-safe" aria-hidden="true"></span>' +
      (flagged ? '<span class="ev-flag" aria-hidden="true" style="' + FLAG[key] + '"><i>Hand/object contact not visible</i></span>' : '') +
      '<span class="ev-tag mono">Concept still · not a recording</span>' +
      '<span class="ev-id mono">' + esc(item.id) + ' · ' + esc(vk.toUpperCase()) + '</span></figure>';
    h += '<p class="ev-cap small">' + (vk === 'pov' ? 'Illustrative still standing in for a head-worn view. ' : '') + 'Overlays are drawn by the interface, not baked into any training file. Views are not claimed to be synchronized recordings of one event.</p>';
    h += '<dl class="kv ev-meta"><dt>Episode</dt><dd class="mono">' + esc(item.id) + (item.recaptureOf ? ' · recapture of ' + esc(item.recaptureOf) : '') + (item.recapturedBy && prog.byId[item.recapturedBy].idx < st.cursor ? ' · recaptured as ' + esc(item.recapturedBy) : item.disp === 'rejected' ? ' · recapture pending' : '') + '</dd>' +
      '<dt>Task / variant</dt><dd>' + esc(M.TASKS[item.task].name) + ' · ' + variantText(item.variant) + '</dd>' +
      '<dt>Station / operator</dt><dd>' + esc(item.station) + ' · ' + esc(item.operator) + ' (fictional) · shift ' + item.shift + ' · attempt ' + item.attempt + '</dd>' +
      '<dt>Capture profile</dt><dd>CP-DEMO-POV-3RGB · 3 views in one episode</dd>' +
      '<dt>Consent / safety</dt><dd>CONSENT-DEMO (assumed) · SAFETY-DEMO (assumed). Real references required before a live pilot.</dd>' +
      '<dt>Required evidence</dt><dd>' + esc(M.TASKS[item.task].evidence) + '</dd>' +
      '<dt>QA state</dt><dd><span class="pill ' + reason.cls + '">' + esc(item.disp.replace(/_/g, ' ')) + '</span> <span class="mono small">' + esc(item.reason) + '</span></dd>' +
      '<dt>Why</dt><dd>' + esc(reason.text) + '</dd></dl>';
    return h + '</div>';
  }

  function coverageMatrix(prog, st) {
    var c = M.counts(prog, st);
    var h = '<div class="matrix" role="table" aria-label="Accepted coverage by variant">';
    Object.keys(M.TASKS).forEach(function (t) {
      h += '<div class="mx-row" role="row"><div class="mx-h" role="rowheader">' + esc(M.TASKS[t].name) + '<small>' + c.byTask[t].accepted + ' / ' + c.byTask[t].target + '</small></div><div class="mx-cells">';
      prog.variants.filter(function (v) { return v.task_id === t; }).forEach(function (v) {
        var b = c.byVariant[v.variant_id], f = b.accepted / v.accepted_quota;
        h += '<span role="cell" class="mx' + (f >= 1 ? ' full' : '') + (b.held ? ' has-hold' : '') + '" style="--f:' + f.toFixed(3) + '" title="' + esc(v.variant_id + ': ' + LAYOUT[v.layout] + ', ' + v.lighting + ', ' + v.clutter + '. ' + b.accepted + '/25 accepted, ' + b.held + ' held, ' + b.rejected + ' rejected') + '"><i>' + v.layout + (v.lighting === 'dim' ? '·d' : '') + (v.clutter === 'moderate' ? '·c' : '') + '</i></span>';
      });
      h += '</div></div>';
    });
    return h + '<p class="mx-key small muted">Each cell is one of 48 defined variants (layout A to D, ·d dim light, ·c moderate clutter). Fill = accepted episodes / 25. A dot marks a held episode awaiting review.</p></div>';
  }

  function download(name, text, type) {
    var blob = new Blob([text], { type: type || 'text/plain' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  root.MetariViews = { esc: esc, metrics: metrics, traceRows: traceRows, roomInfo: roomInfo, evidence: evidence, coverageMatrix: coverageMatrix, taskForRoom: taskForRoom, roomMeta: roomMeta, variantText: variantText, download: download, levelName: levelName };
})(window);
