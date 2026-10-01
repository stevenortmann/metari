/* Metari x micro1 concept: pilot brief builder. Local only. No submission, no pricing. */
(function (root) {
  'use strict';
  var TBA = 'To be agreed';
  var ENV = [['guest', 'Guest rooms'], ['laundry', 'Laundry and linen'], ['service', 'Service and supply'], ['kitchen', 'Commercial kitchen (later order, own safety protocol)'], ['senior', 'Accessible living mock (non-clinical, no residents)'], ['tba', TBA]];
  var TASKS = [['linen', 'Linen placement'], ['laundry', 'Laundry sorting and folding'], ['cart', 'Service-cart or shelf replenishment']];
  var CAPTURE = [
    ['human_video', 'Human demonstrations: first-person + fixed RGB views'],
    ['human_sensor', 'Human demonstrations with micro1-specified stereo/IMU kit'],
    ['gripper', 'Tracked hand-held gripper demonstrations'],
    ['robot', 'Robot-native trajectories (authorized hardware sessions)'],
    ['eval', 'Evaluation sessions only (bounded, supervised)'],
    ['tba', TBA]
  ];
  var UNIT = [['episodes', 'accepted episodes'], ['minutes', 'unique activity minutes'], ['trials', 'evaluation trials'], ['tba', TBA]];
  var LOC = [['tba', TBA], ['listed', 'A US state on micro1\'s published list'], ['ca', 'California'], ['az', 'Arizona'], ['other', 'Other location']];
  var VAR = [['layout', 'Layout'], ['lighting', 'Lighting'], ['clutter', 'Clutter'], ['objects', 'Object set'], ['operator', 'Operator']];
  var REL = [['pilot', 'Paid pilot'], ['repeat', 'Repeat collection orders'], ['reserved', 'Reserved operating capacity'], ['tba', TBA]];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function opts(list, sel) { return list.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === sel ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join(''); }
  function label(list, v) { var f = list.filter(function (o) { return o[0] === v; })[0]; return f ? f[1] : TBA; }

  function mount(host) {
    var s = { env: 'guest', tasks: ['linen', 'laundry', 'cart'], capture: 'human_video', target: '', unit: 'episodes', location: 'tba', vary: ['layout', 'lighting', 'clutter'], quals: 'Hospitality staff with task sign-off by a Metari supervisor', accept: TBA, rel: 'pilot', cap: { stations: 2, minutes: 480, productive: 0.7, capture: 6, reset: 3, accept: 0.9 } };

    host.innerHTML =
      '<form class="pl-form" id="pl-form" novalidate>' +
      '<label class="field">Environment<select name="env">' + opts(ENV, s.env) + '</select></label>' +
      '<fieldset><legend>Task families</legend><div class="checks">' + TASKS.map(function (t) { return '<label><input type="checkbox" name="tasks" value="' + t[0] + '" checked> ' + esc(t[1]) + '</label>'; }).join('') + '</div></fieldset>' +
      '<label class="field">Capture type<select name="capture">' + opts(CAPTURE, s.capture) + '</select></label>' +
      '<div class="two"><label class="field">Target (leave blank if to be agreed)<input name="target" inputmode="numeric" placeholder="' + TBA + '"></label>' +
      '<label class="field">Unit<select name="unit">' + opts(UNIT, s.unit) + '</select></label></div>' +
      '<label class="field">Location<select name="location">' + opts(LOC, s.location) + '</select></label>' +
      '<fieldset><legend>Repetition and variation</legend><div class="checks">' + VAR.map(function (v) { return '<label><input type="checkbox" name="vary" value="' + v[0] + '"' + (s.vary.indexOf(v[0]) >= 0 ? ' checked' : '') + '> ' + esc(v[1]) + '</label>'; }).join('') + '</div></fieldset>' +
      '<label class="field">Operator qualifications<input name="quals" value="' + esc(s.quals) + '"></label>' +
      '<label class="field">Acceptance criteria<textarea name="accept" placeholder="' + TBA + '"></textarea></label>' +
      '<label class="field">Desired relationship<select name="rel">' + opts(REL, s.rel) + '</select></label>' +
      '<details class="cap"><summary>Optional planning estimate</summary>' +
      '<p class="small muted" style="margin:10px 0 0">accepted episodes per day = parallel stations &times; staffed minutes per day &times; productive fraction &divide; (capture minutes + reset minutes) &times; assumed acceptance fraction</p>' +
      '<div class="grid">' +
      num('stations', 'Parallel stations', s.cap.stations, 1) + num('minutes', 'Staffed min / day', s.cap.minutes, 30) + num('productive', 'Productive fraction', s.cap.productive, 0.05) +
      num('capmin', 'Capture min', s.cap.capture, 0.5) + num('reset', 'Reset min', s.cap.reset, 0.5) + num('acceptf', 'Acceptance fraction', s.cap.accept, 0.05) +
      '</div><div class="res" id="cap-res" aria-live="polite"></div></details>' +
      '</form>' +
      '<aside class="pl-out" id="pl-out" aria-live="polite"></aside>';

    function num(n, l, v, step) { return '<label class="field">' + l + '<input type="number" name="' + n + '" value="' + v + '" step="' + step + '" min="0"></label>'; }

    var form = host.querySelector('#pl-form'), out = host.querySelector('#pl-out');
    form.addEventListener('input', read); form.addEventListener('change', read);
    read();

    function read() {
      var f = form.elements;
      s.env = f.env.value; s.capture = f.capture.value; s.unit = f.unit.value; s.location = f.location.value; s.rel = f.rel.value;
      s.tasks = Array.prototype.filter.call(form.querySelectorAll('[name=tasks]'), function (x) { return x.checked; }).map(function (x) { return x.value; });
      s.vary = Array.prototype.filter.call(form.querySelectorAll('[name=vary]'), function (x) { return x.checked; }).map(function (x) { return x.value; });
      s.target = f.target.value.trim(); s.quals = f.quals.value.trim(); s.accept = f.accept.value.trim() || TBA;
      s.cap = { stations: +f.stations.value, minutes: +f.minutes.value, productive: +f.productive.value, capture: +f.capmin.value, reset: +f.reset.value, accept: +f.acceptf.value };
      render();
    }

    function brief() {
      var flags = [], questions = [], approvals = ['Technical protocol and acceptance criteria (micro1 and buyer)', 'Location eligibility', 'Site access and risk assessment', 'Operator consent and capture agreement', 'Data rights, retention and delivery format', 'Commercial scope and statement of work'];
      var targetN = parseInt(s.target.replace(/[^0-9]/g, ''), 10);
      if (s.target && !(targetN > 0)) flags.push('Target is not a positive number; treated as ' + TBA + '.');
      if (s.location === 'ca' || s.location === 'az') flags.push('micro1\'s public Video Capture Partner listing names 26 US states and does not include ' + (s.location === 'ca' ? 'California' : 'Arizona') + '. Eligibility for a bespoke program must be confirmed directly.');
      if (s.location === 'tba') questions.push('Which locations are eligible for this program?');
      if (s.capture === 'robot') flags.push('Robot-native trajectories need an authorized hardware session, a supervised safety protocol and a different commercial unit from human video.');
      if (s.capture === 'human_video' && s.unit === 'trials') flags.push('Evaluation trials are not produced by human demonstration capture. Choose an evaluation capture type or another unit.');
      if (s.capture === 'eval') flags.push('Evaluation requires a holdout set separate from any collection scenes.');
      if (s.env === 'kitchen') flags.push('Kitchen work is proposed as a later order with its own tools and safety protocol.');
      if (s.env === 'senior') flags.push('Non-clinical mock environment only. No residents or patients.');
      if (!s.tasks.length) flags.push('No task family selected.');
      if (s.unit === 'minutes') flags.push('Count unique physical activity. One minute on three cameras is still one minute.');
      if (s.accept === TBA) questions.push('What is the accepted unit and the acceptance window?');
      if (s.capture === 'tba') questions.push('Is the need video, action data or evaluation?');
      if (s.capture === 'human_sensor' || s.capture === 'gripper' || s.capture === 'robot') questions.push('Who specifies and supplies the hardware, and is a loan possible?');
      questions.push('Which requests are currently hard to fulfil, and is the bottleneck capture, action data, annotation or evaluation?');
      if (s.rel === 'reserved') questions.push('What would a reservation include, and what notice and cancellation terms apply?');
      var staff = ['Floor supervisor', 'Qualified operators: ' + (s.quals || TBA), 'Capture technician', 'Operational QA reviewer'];
      var equip = s.capture === 'human_video' ? ['Head-worn RGB capture', 'Two fixed RGB mounts per station', 'Time sync and upload station'] : s.capture === 'human_sensor' ? ['micro1-specified stereo/IMU kit', 'Fixed RGB mounts', 'Calibration targets'] : s.capture === 'gripper' ? ['Tracked hand-held grippers', 'Tracking volume and calibration'] : s.capture === 'robot' ? ['Buyer-supplied or loaned robot', 'Safety perimeter and stop controls', 'Supervised test cell'] : s.capture === 'eval' ? ['Frozen evaluation scenes', 'Fixed observation cameras'] : [TBA];
      var site = ['Room block taken out of guest service', 'Reset storage for variation objects', 'Secure storage and access control for captured data', 'Site-specific risk assessment before any live work'];
      var milestones = ['Weeks 1 to 2: discovery and design, one environment, accepted unit agreed', 'Weeks 2 to 3: calibration and a jointly agreed sample, proposed 50 to 100 episodes, written feedback before scaling', 'Weeks 3 to 7: paid collection with versioned recipes, daily operational QA and rework', 'Weeks 7 to 8: closeout, reconcile costs and rejects, decide on a repeat order or reservation'];
      return {
        schema: 'metari.pilot_discussion_brief.v1',
        concept: 'ILLUSTRATIVE CONCEPT FOR DISCUSSION. Not a quote, order, capacity commitment or agreement. No partnership implied.',
        created_locally: new Date().toISOString(),
        environment: label(ENV, s.env), task_families: s.tasks.map(function (t) { return label(TASKS, t); }),
        capture_type: label(CAPTURE, s.capture),
        target: targetN > 0 && s.unit !== 'tba' ? targetN + ' ' + label(UNIT, s.unit) : TBA,
        location: label(LOC, s.location), variation: s.vary.map(function (v) { return label(VAR, v); }),
        operator_qualifications: s.quals || TBA, acceptance_criteria: s.accept, relationship: label(REL, s.rel),
        proposed_split: { micro1: 'Technical brief, acceptance criteria, final dataset acceptance and evaluation', metari: 'Environment, operators, resets, instrumentation as agreed, execution, operational QA and evidence' },
        flags: flags, open_questions: questions, unresolved_approvals: approvals,
        staff_categories: staff, equipment_categories: equip, site_constraints: site, milestones: milestones,
        pricing: 'Not generated. Requires a scoped cost model.',
        estimate: estimate()
      };
    }

    function estimate() {
      var c = s.cap, denom = c.capture + c.reset;
      var valid = [c.stations, c.minutes, c.productive, c.capture, c.reset, c.accept].every(function (x) { return isFinite(x) && x >= 0; }) && denom > 0 && c.productive <= 1 && c.accept <= 1;
      if (!valid) return { valid: false, note: 'Check inputs: all values must be non-negative, fractions at most 1, and capture plus reset minutes above zero.' };
      var perDay = c.stations * c.minutes * c.productive / denom * c.accept;
      return { valid: true, accepted_episodes_per_day: Math.round(perDay * 10) / 10, assumptions: c, label: 'Planning estimate only, not a throughput commitment', excludes: ['Sequential room resets and shared equipment', 'Operator availability, breaks and training', 'Safety limits and supervision ratios', 'Specification changes and rework beyond the acceptance fraction', 'Whether the capture profile yields compatible robot telemetry (it does not by default)'] };
    }

    function render() {
      var b = brief(), e = b.estimate, targetN = parseInt(s.target, 10);
      out.innerHTML = '<div class="draft mono">Draft &middot; not a commercial offer</div><h3>' + esc(b.environment) + ' pilot</h3>' +
        '<h5>Proposed scope</h5><ul><li>' + esc(b.task_families.join(', ') || 'No task selected') + '</li><li>' + esc(b.capture_type) + '</li><li>Target: ' + esc(b.target) + '</li><li>Variation: ' + esc(b.variation.join(', ') || 'None selected') + '</li><li>Relationship: ' + esc(b.relationship) + '</li></ul>' +
        (b.flags.length ? '<h5>Flags</h5><ul>' + b.flags.map(function (f) { return '<li class="flag">' + esc(f) + '</li>'; }).join('') + '</ul>' : '') +
        '<h5>Open questions</h5><ul>' + b.open_questions.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul>' +
        '<h5>Staff and equipment categories</h5><ul>' + b.staff_categories.concat(b.equipment_categories).map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul>' +
        '<h5>Sample and review milestones</h5><ul>' + b.milestones.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul>' +
        '<h5>Unresolved approvals</h5><ul>' + b.unresolved_approvals.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul>' +
        '<div class="pl-actions"><button class="btn primary sm" type="button" data-export="md">Save brief (.md)</button><button class="btn sm" type="button" data-export="json">Save brief (.json)</button></div>' +
        '<p class="small muted" style="margin:10px 0 0">Files are created in your browser. Nothing is submitted.</p>';
      var res = host.querySelector('#cap-res');
      if (!e.valid) res.innerHTML = '<span class="flag">' + esc(e.note) + '</span>';
      else res.innerHTML = '<b>' + e.accepted_episodes_per_day + '</b> accepted episodes per staffed day (estimate)' + (targetN > 0 && s.unit === 'episodes' && e.accepted_episodes_per_day > 0 ? '<br>About ' + Math.ceil(targetN / e.accepted_episodes_per_day) + ' staffed days for ' + targetN.toLocaleString('en-US') + ' accepted episodes, before the exclusions below.' : '') + '<br><span class="small">Excludes: ' + e.excludes.map(esc).join('; ') + '.</span>';
    }

    function md(b) {
      var L = ['# Metari x micro1: pilot discussion brief', '', '> ' + b.concept, '', '## Proposed scope', '- Environment: ' + b.environment, '- Task families: ' + (b.task_families.join(', ') || TBA), '- Capture type: ' + b.capture_type, '- Target: ' + b.target, '- Location: ' + b.location, '- Variation: ' + (b.variation.join(', ') || TBA), '- Operator qualifications: ' + b.operator_qualifications, '- Acceptance criteria: ' + b.acceptance_criteria, '- Relationship: ' + b.relationship, '', '## Proposed split', '- micro1: ' + b.proposed_split.micro1, '- Metari: ' + b.proposed_split.metari, ''];
      if (b.flags.length) L.push('## Flags', b.flags.map(function (x) { return '- ' + x; }).join('\n'), '');
      L.push('## Open questions', b.open_questions.map(function (x) { return '- ' + x; }).join('\n'), '', '## Staff categories', b.staff_categories.map(function (x) { return '- ' + x; }).join('\n'), '', '## Equipment categories', b.equipment_categories.map(function (x) { return '- ' + x; }).join('\n'), '', '## Site constraints', b.site_constraints.map(function (x) { return '- ' + x; }).join('\n'), '', '## Sample and review milestones', b.milestones.map(function (x) { return '- ' + x; }).join('\n'), '', '## Unresolved approvals', b.unresolved_approvals.map(function (x) { return '- [ ] ' + x; }).join('\n'), '', '## Pricing', b.pricing, '');
      if (b.estimate.valid) L.push('## Planning estimate (not a commitment)', '- ' + b.estimate.accepted_episodes_per_day + ' accepted episodes per staffed day from: ' + JSON.stringify(b.estimate.assumptions), '- Excludes: ' + b.estimate.excludes.join('; '), '');
      L.push('Created locally ' + b.created_locally + '. Nothing was submitted.');
      return L.join('\n');
    }

    out.addEventListener('click', function (e) {
      var t = e.target.closest('[data-export]'); if (!t) return;
      var b = brief();
      if (t.dataset.export === 'md') root.MetariViews.download('metari-micro1-pilot-brief.md', md(b), 'text/markdown');
      else root.MetariViews.download('metari-micro1-pilot-brief.json', JSON.stringify(b, null, 2), 'application/json');
    });
    return { brief: brief };
  }
  root.MetariPlanner = { mount: mount };
})(window);
