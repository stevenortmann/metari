// Deterministic check of the /micro1 shared order model against the fictional fixtures.
// Run: node tools/test_micro1_model.js   (no dependencies)
const fs = require('fs'), path = require('path'), assert = require('assert');
const M = require('../micro1/js/model.js');
const dir = path.join(__dirname, '..', 'micro1', 'data');
const order = JSON.parse(fs.readFileSync(path.join(dir, 'demo-order.json')));
const fx = JSON.parse(fs.readFileSync(path.join(dir, 'demo-episodes.json')));
const prog = M.buildProgram(order, fx);
assert.strictEqual(prog.total, 1320);
assert.strictEqual(new Set(prog.seq.map(s => s.id)).size, 1320, 'each fixture episode appears once');
prog.seq.forEach(s => { if (s.recaptureOf) { const r = prog.byId[s.recaptureOf]; assert.strictEqual(r.disp, 'rejected'); assert.strictEqual(prog.seq[s.idx - 1].id, r.id, 'recapture follows its rejected attempt'); assert.strictEqual(s.disp, 'accepted'); } });
assert.strictEqual(prog.seq.filter(s => s.recaptureOf).length, 48);
// Blocked prerequisites
let st = M.initialState();
assert(!M.act(prog, st, 'start').ok, 'start blocked in draft');
M.act(prog, st, 'submit'); st.profile = 'actions';
assert(!M.act(prog, st, 'assume').ok, 'robot actions profile blocks approvals');
st.profile = 'fixture'; st.location = 'ca';
assert(M.issues(st).some(i => i.code === 'GEOGRAPHY_UNCONFIRMED'), 'CA flagged');
assert(M.act(prog, st, 'assume').ok); assert(M.act(prog, st, 'configure').ok); assert(M.act(prog, st, 'start').ok);
let steps = 0, gateSeen = false;
while (st.phase === 'CAPTURING') {
  M.advance(prog, st, 7); steps++;
  const c = M.counts(prog, st);
  assert(c.reconciles, 'reconciles at step ' + steps);
  assert.strictEqual(c.streams, c.captured * 3);
  assert(c.accepted <= 1200 && c.held <= 72 && c.rejected <= 48);
  if (st.gate === 'flagged') { gateSeen = true; assert.strictEqual(st.cursor, prog.firstReject + 1); const before = st.cursor; M.advance(prog, st, 5); assert.strictEqual(st.cursor, before, 'gate holds'); M.act(prog, st, 'inspect'); M.act(prog, st, 'request_reset'); }
  assert(steps < 1000);
}
assert(gateSeen, 'guided review gate reached');
assert.strictEqual(st.phase, 'QA_REVIEW');
assert(M.finishQA(prog, st)); assert.strictEqual(st.phase, 'READY_FOR_DELIVERY');
const c = M.counts(prog, st);
assert.deepStrictEqual([c.captured, c.accepted, c.held, c.rejected, c.variantsMet], [1320, 1200, 72, 48, 48]);
Object.values(c.byVariant).forEach(v => assert.strictEqual(v.accepted, 25));
const man = M.manifest(prog, st);
assert.strictEqual(man.accepted.length, 1200); assert.strictEqual(man.held_for_review_outstanding.length, 72); assert.strictEqual(man.actual_submission, false);
// URL round-trip
const s2 = M.decode(M.encode(st), prog);
assert.deepStrictEqual(M.counts(prog, s2).accepted, 1200); assert.strictEqual(s2.phase, 'READY_FOR_DELIVERY');
const tr = M.trace(prog, st); assert(tr.length > 100); assert(tr.every(e => e.kind === 'rule' || e.kind === 'simulated'));
console.log('PASS model: first reject at', prog.firstReject, '| steps', steps, '| trace events', tr.length, '| clock', M.simClock(prog, 1320));
