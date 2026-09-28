/* Metari x micro1 concept: spatial view wrapper.
 * Mounts the extracted v10 WebGL 2 renderer (architecture.js) and provides an accessible
 * 2D plan for browsers without WebGL 2, reduced-capability devices and keyboard users.
 * The 2D plan is a fallback, not the premium 3D implementation.
 * Overlays are computed from the simulated order state. They are not sensor data.
 */
(function (root) {
  'use strict';
  var A = function () { return root.MetariArchitecture; };
  var LABELS = ['guest', 'laundry', 'boh', 'senior', 'kitchen', 'showroom', 'lobby'];
  var reduce = function () { try { return root.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
  var DEFAULT_VIEW = { yaw: -0.23, pitch: 0.6, zoom: 1, floor: 'all', spread: 0.85, cutaway: true, heat: true, labels: true, rotate: false };
  var FLOOR_NAMES = { 2: 'Level 03 · Living', 1: 'Level 02 · Experience', 0: 'Level 01 · Operations', '-1': 'Grounds' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function mount(host, opts) {
    opts = opts || {};
    var view = Object.assign({}, DEFAULT_VIEW, opts.view || {});
    var mode = '3d', renderer = null, selected = null;
    host.classList.add('scene-host');
    host.innerHTML = '<div class="scene-3d"><canvas tabindex="0" aria-label="Concept facility in 3D. Drag to orbit, shift-drag to pan, scroll or pinch to zoom, arrow keys to rotate, click a room to select it. A 2D plan is available from the toolbar."></canvas><div class="v8-scene-labels"></div><div class="scene-loading"><span></span>Preparing concept facility</div></div><div class="scene-2d" hidden></div><div class="scene-mark mono">Concept geometry <span>Simulated data</span></div>';
    var box3d = host.querySelector('.scene-3d'), box2d = host.querySelector('.scene-2d');
    var forced = /[?&]scene=2d/.test(location.search);

    function data() {
      var s = opts.getState ? opts.getState() : {};
      var layer = s.layer || 'coverage';
      return {
        state: null, selected: null, paused: reduce() || !!s.paused, mode: 'coverage',
        cameras: !!s.cameras, paths: !!s.paths,
        intensity: function (id) {
          var alloc = (s.allocated || []).indexOf(id) >= 0;
          if (!alloc) return -1; // no overlay on rooms this order does not use
          if (layer === 'allocation') return 0.72;
          return Math.max(0, Math.min(1, (s.coverage || {})[id] || 0));
        }
      };
    }
    function heatOn() { var s = opts.getState ? opts.getState() : {}; return (s.layer || 'coverage') !== 'off'; }

    function start3d() {
      if (forced) return use2d(true);
      try {
        renderer = A().makeRenderer(box3d, {
          type: 'campus', view: view, labelIds: opts.labelIds || LABELS, panMode: function () { return false; },
          data: data, onPick: function (id) { selected = id; draw2d(); opts.onPick && opts.onPick(id); },
          onUnavailable: function () { use2d(true); }
        });
        if (renderer && renderer.unavailable) return;
        renderer.update({ heat: heatOn() });
        host.classList.add('is-3d');
      } catch (e) { console.error(e); use2d(true); }
    }

    function use2d(unavailable) {
      mode = '2d'; box3d.hidden = true; box2d.hidden = false; host.classList.remove('is-3d'); host.classList.add('is-2d');
      if (unavailable) { host.classList.add('no-webgl'); host.dataset.fallback = forced ? 'forced' : 'no-webgl2'; }
      draw2d();
    }
    function use3d() {
      if (host.classList.contains('no-webgl')) return false;
      mode = '3d'; box2d.hidden = true; box3d.hidden = false; host.classList.remove('is-2d'); host.classList.add('is-3d');
      if (!renderer) start3d(); else renderer.refresh();
      return true;
    }

    function draw2d() {
      if (mode !== '2d') return;
      var s = opts.getState ? opts.getState() : {};
      var rooms = A() ? A().ROOMS : [];
      var floors = [2, 1, 0].filter(function (f) { return view.floor === 'all' || String(view.floor) === String(f); });
      var html = '';
      if (host.classList.contains('no-webgl')) html += '<p class="scene-note mono">' + (forced ? '2D plan requested' : '3D needs WebGL 2 on this device. Showing the accessible 2D plan.') + '</p>';
      floors.forEach(function (f) {
        var rs = rooms.filter(function (r) { return r.floor === f; });
        html += '<figure class="plan"><figcaption class="mono">' + FLOOR_NAMES[f] + '</figcaption><svg viewBox="-23 -11.5 46 23" role="group" aria-label="' + FLOOR_NAMES[f] + ' plan">';
        html += '<rect x="-22.5" y="-11" width="45" height="22" class="plan-slab"/>';
        rs.forEach(function (r) {
          var alloc = (s.allocated || []).indexOf(r.id) >= 0, cov = (s.coverage || {})[r.id] || 0;
          var cls = 'plan-room' + (alloc ? ' alloc' : '') + (selected === r.id ? ' sel' : '');
          var fill = alloc && s.layer !== 'off' ? (s.layer === 'allocation' ? 'rgba(61,232,176,.34)' : 'rgba(61,232,176,' + (0.12 + cov * 0.5).toFixed(2) + ')') : '';
          html += '<g class="' + cls + '" data-room="' + r.id + '" tabindex="0" role="button" aria-pressed="' + (selected === r.id) + '" aria-label="' + esc(r.label) + (alloc ? ', allocated to this order, ' + Math.round(cov * 100) + ' percent of accepted quota' : ', not allocated') + '">' +
            '<rect x="' + r.x + '" y="' + r.z + '" width="' + r.w + '" height="' + r.d + '"' + (fill ? ' style="fill:' + fill + '"' : '') + '/>' +
            '<text x="' + (r.x + 0.5) + '" y="' + (r.z + 1.5) + '">' + esc(r.w < 6 ? r.label.split(' ')[0] : r.label) + '</text>' +
            (alloc ? '<text class="pct" x="' + (r.x + 0.5) + '" y="' + (r.z + 3.1) + '">' + Math.round(cov * 100) + '%</text>' : '') + '</g>';
        });
        html += '</svg></figure>';
      });
      box2d.innerHTML = html;
    }
    box2d.addEventListener('click', function (e) { var g = e.target.closest('[data-room]'); if (g) pick(g.dataset.room); });
    box2d.addEventListener('keydown', function (e) { var g = e.target.closest('[data-room]'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(g.dataset.room); } });
    function pick(id) { selected = id; if (renderer && renderer.update) renderer.update({ selected: id }); draw2d(); opts.onPick && opts.onPick(id); var n = box2d.querySelector('[data-room="' + id + '"]'); n && n.focus && n.focus(); }

    var api = {
      get mode() { return mode; },
      get fallback() { return host.classList.contains('no-webgl'); },
      refresh: function () { if (renderer && renderer.update) renderer.update({ heat: heatOn() }); draw2d(); },
      select: function (id, focus) {
        selected = id;
        if (renderer && renderer.update) { renderer.update({ selected: id }); if (focus && renderer.focusRoom) renderer.focusRoom(id); }
        if (mode === '2d') { var r = A().ROOMS.find(function (x) { return x.id === id; }); if (focus && r && view.floor !== 'all' && String(view.floor) !== String(r.floor)) view.floor = 'all'; draw2d(); }
      },
      floor: function (f) { view.floor = f; if (renderer && renderer.update) renderer.update({ floor: f, cutaway: true, zoom: f === 'all' ? 1 : 1.7 }); draw2d(); },
      explode: function (on) { if (renderer && renderer.update) renderer.update({ spread: on ? 1 : 0, cutaway: true, floor: 'all' }); view.floor = 'all'; draw2d(); },
      rotate: function (d) { if (renderer && renderer.getView) { var v = renderer.getView(); renderer.update({ yaw: v.yaw + d * 0.22, rotate: false }); } },
      zoom: function (d) { if (renderer && renderer.getView) { var v = renderer.getView(); renderer.update({ zoom: Math.max(0.55, Math.min(4.5, v.zoom * (d > 0 ? 1.2 : 1 / 1.2))) }); } },
      reset: function () { selected = null; view.floor = 'all'; if (renderer && renderer.update) renderer.update(Object.assign({}, DEFAULT_VIEW, { panX: 0, panY: 0, selected: null, heat: heatOn() })); draw2d(); },
      toggle2d: function () { if (mode === '3d') { use2d(false); return '2d'; } use3d(); return '3d'; },
      destroy: function () { if (renderer && renderer.destroy) renderer.destroy(); renderer = null; },
      debug: function () { return box3d.__metariScene || null; }
    };
    start3d();
    return api;
  }

  root.MetariScene = { mount: mount, FLOOR_NAMES: FLOOR_NAMES };
})(window);
