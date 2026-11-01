/* Sveit site: the workshop on the hero. One lane, three identities, a 43-second cycle.
   Project nord, lane api, owner k.vale and the ticket numbers are invented. */
(function () {
  'use strict';

  var floor = document.getElementById('floor');
  var strip = document.getElementById('strip');
  var ticker = document.getElementById('ticker');
  var statusEl = document.getElementById('lane-status');
  var statusWord = document.getElementById('lane-status-word');
  var waitEl = document.getElementById('lane-wait');
  var pins = document.getElementById('pins');
  var pinEl = document.getElementById('pin');
  var pinNote = document.getElementById('pin-note');
  if (!floor || !strip || !ticker) return;

  var ROLE = { mgr: 'manager', dev: 'dev', dev2: 'dev', qa: 'qa' };
  var figs = {};
  Object.keys(ROLE).forEach(function (k) {
    var el = document.getElementById('fig-' + k);
    figs[k] = { el: el, card: el.querySelector('.ag-card') };
  });

  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var alive = true;
  var timer = null;
  var seq = 0;
  var cam = { x: 86, dur: 0 };

  function pad(v) { return (v < 10 ? '0' : '') + v; }
  function hms(d) { d = d || new Date(); return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()); }
  function pr(t) { return '#' + (409 + t - 144); }
  function hash(n) { return ((n * 2654435761) >>> 0).toString(16).padStart(8, '0').slice(0, 7); }

  /* ---------- rendering ---------- */
  function F(x, anim, carry, face, walk) { return { x: x, anim: anim, carry: carry, face: face, walk: walk }; }

  function setFig(k, f) {
    var o = figs[k];
    var cls = (f.anim === 'walk' ? 'm-walk a-walk' : 'a-' + f.anim) + (f.face === 'l' ? ' face-l' : '');
    o.el.style.transitionDuration = f.walk || '0ms';
    o.el.style.left = f.x + '%';
    o.el.className = 'ag r-' + ROLE[k] + ' ' + cls;
    o.card.textContent = f.carry || '';
    o.card.hidden = !f.carry;
  }

  function setFlags(p) {
    if ('scan' in p) floor.classList.toggle('scan-on', !!p.scan);
    if ('rig' in p) floor.classList.toggle('rig-on', !!p.rig);
    if ('door' in p) floor.classList.toggle('door-open', !!p.door);
    if ('lamp' in p) {
      floor.classList.remove('lamp-ochre', 'lamp-green', 'lamp-oxide', 'lamp-off');
      floor.classList.add('lamp-' + p.lamp);
    }
  }

  function setPin(text, tone, note) {
    if (!text) { pins.hidden = true; return; }
    pins.hidden = false;
    pinEl.textContent = text;
    pinEl.className = 'pin ' + tone;
    pinNote.textContent = note || '';
  }

  function setWaiting(n) {
    statusEl.className = 'status ' + (n ? 'ochre' : 'plain');
    statusWord.textContent = n ? 'review' : 'running';
    if (waitEl) waitEl.textContent = n ? n + ' waiting on k.vale' : 'nothing waits on a person';
  }

  function ev(identity, action, ticket, refs, tone, when) {
    var row = document.createElement('span');
    row.className = 'tk-ev new ' + (tone || '');
    [hms(when), identity, action, ticket, refs].forEach(function (t, i) {
      var s = document.createElement('span');
      if (i === 2) s.className = 'act';
      s.textContent = t;
      row.appendChild(s);
    });
    Array.prototype.forEach.call(ticker.children, function (c) { c.classList.remove('new'); });
    ticker.insertBefore(row, ticker.firstChild);
    while (ticker.children.length > 8) ticker.removeChild(ticker.lastChild);
    seq += 1;
  }

  function placeCamera() {
    var vw = floor.clientWidth;
    var sw = strip.clientWidth;
    var tx = 0;
    if (sw > vw) tx = Math.max(0, Math.min(sw - vw, cam.x / 100 * sw - vw / 2));
    strip.style.transitionDuration = cam.dur + 'ms';
    strip.style.transform = 'translateX(-' + Math.round(tx) + 'px)';
  }
  function camTo(x, dur) { return function () { cam = { x: x, dur: dur }; placeCamera(); }; }

  /* ---------- the cycle ---------- */
  var LECT = 12.2, HAND = 22.4, BENCH1 = 31.4, BENCH2 = 41.4, SCAN = 52, RIG = 60.4, DROP = 72.4, DOOR = 83.4;

  function initial(n) {
    setFig('mgr', F(LECT, 'read', 'NRD-' + (n + 4), '', '0ms'));
    setFig('dev', F(BENCH1, 'hammer', 'NRD-' + (n + 2), '', '0ms'));
    setFig('dev2', F(BENCH2, 'hammer', 'NRD-' + (n + 3), '', '0ms'));
    setFig('qa', F(RIG, 'lens', 'NRD-' + (n + 1), '', '0ms'));
    setFlags({ scan: false, rig: true, lamp: 'ochre', door: false });
    setPin(pr(n) + ' · NRD-' + n, 'ochre', 'waiting on k.vale');
    setWaiting(1);
  }

  function seed() {
    var now = Date.now();
    [
      [233, 'k.vale', 'merge', 'NRD-143', '#408', 't-green'],
      [188, 'nord-api-manager', 'dispatch', 'NRD-146', 'delegated by k.vale', ''],
      [142, 'nord-api-dev', 'policy_block', 'NRD-141', 'push check · deploy/api.yaml', 't-oxide'],
      [97, 'nord-api-dev', 'commit', 'NRD-144', '7f3c2a1', ''],
      [61, 'nord-api-qa', 'review', 'NRD-144', 'passed · 14 checks', 't-green'],
      [38, 'nord-api-manager', 'approval', 'NRD-144', '#409 · one of two', 't-green']
    ].forEach(function (r) { ev(r[1], r[2], r[3], r[4], r[5], new Date(now - r[0] * 1000)); });
    Array.prototype.forEach.call(ticker.children, function (c) { c.classList.remove('new'); });
  }

  function cycle(n) {
    var T = function (k) { return 'NRD-' + (n + k); };
    return [
      [0.2, camTo(86, 1500)],
      [3.0, function () { setFlags({ lamp: 'green', door: true }); setPin(pr(n) + ' · ' + T(0), 'green', 'merged by k.vale'); setWaiting(0); ev('k.vale', 'merge', T(0), pr(n), 't-green'); }],
      [5.5, function () { setFlags({ door: false, lamp: 'off' }); setPin(''); }],
      [6.0, function () { setFlags({ rig: false }); setFig('qa', F(DOOR, 'walk', T(1), '', '3000ms')); }],
      [6.5, function () { setFig('dev', F(SCAN, 'walk', T(2), '', '3000ms')); ev('nord-api-dev', 'commit', T(2), hash(n), ''); }],
      [9.0, function () { setFig('qa', F(DOOR, 'wait', '', '', '0ms')); setFlags({ lamp: 'ochre' }); setPin(pr(n + 1) + ' · ' + T(1), 'ochre', 'waiting on k.vale'); setWaiting(1); ev('nord-api-qa', 'review', T(1), 'passed · ' + pr(n + 1), 't-green'); }],
      [9.5, function () { setFlags({ scan: true }); setFig('dev', F(SCAN, 'wait', T(2), '', '0ms')); }],
      [10.5, function () { setFig('qa', F(RIG, 'walk', '', 'l', '3000ms')); }],
      [10.5, camTo(63.6, 3000)],
      [12.5, function () { setFlags({ scan: false }); setFig('dev', F(DROP, 'walk', T(2), '', '2500ms')); ev('sveit', 'scan', T(2), 'passed · no secrets · no protected paths', 't-green'); }],
      [13.5, function () { setFig('qa', F(RIG, 'wait', '', '', '0ms')); }],
      [15.0, function () { setFlags({ rig: true }); setFig('dev', F(DROP, 'wait', T(2), 'l', '0ms')); ev('sveit', 'checks', T(2), 'running · 14 checks', ''); }],
      [16.5, function () { setFig('mgr', F(HAND, 'walk', T(4), '', '3000ms')); }],
      [16.5, camTo(32, 3000)],
      [17.0, function () { setFig('qa', F(RIG, 'lens', T(2), '', '0ms')); setFig('dev', F(BENCH1, 'walk', '', 'l', '3500ms')); }],
      [19.5, function () { setFig('mgr', F(HAND, 'wait', T(4), '', '0ms')); }],
      [20.5, function () { setFig('dev', F(BENCH1, 'hammer', T(4), '', '0ms')); setFig('mgr', F(LECT, 'walk', '', 'l', '3000ms')); ev('nord-api-manager', 'dispatch', T(4), 'delegated by k.vale', ''); }],
      [21.0, function () { ev('sveit', 'checks', T(2), 'passed · 14 checks · 3m 48s', 't-green'); }],
      [22.0, function () { setFig('dev2', F(SCAN, 'walk', T(3), '', '3000ms')); ev('nord-api-dev', 'commit', T(3), hash(n + 1), ''); }],
      [22.0, camTo(52, 3000)],
      [23.5, function () { setFig('mgr', F(LECT, 'read', T(5), '', '0ms')); }],
      [24.0, function () { setFlags({ lamp: 'green', door: true }); setPin(pr(n + 1) + ' · ' + T(1), 'green', 'merged by k.vale'); setWaiting(0); ev('k.vale', 'merge', T(1), pr(n + 1), 't-green'); }],
      [24.0, camTo(86, 1200)],
      [25.0, function () { setFlags({ scan: true }); setFig('dev2', F(SCAN, 'wait', T(3), '', '0ms')); }],
      [26.5, function () { setFlags({ door: false, lamp: 'off' }); setPin(''); }],
      [27.0, function () { setFlags({ rig: false }); setFig('qa', F(DOOR, 'walk', T(2), '', '3000ms')); }],
      [28.0, function () { setFlags({ scan: false }); setFig('dev2', F(DROP, 'walk', T(3), '', '2500ms')); ev('sveit', 'scan', T(3), 'passed · no secrets · no protected paths', 't-green'); }],
      [30.0, function () { setFig('qa', F(DOOR, 'wait', '', '', '0ms')); setFlags({ lamp: 'ochre' }); setPin(pr(n + 2) + ' · ' + T(2), 'ochre', 'waiting on k.vale'); setWaiting(1); ev('nord-api-qa', 'review', T(2), 'passed · ' + pr(n + 2), 't-green'); }],
      [30.5, function () { setFlags({ rig: true }); setFig('dev2', F(DROP, 'wait', T(3), 'l', '0ms')); ev('sveit', 'checks', T(3), 'running · 14 checks', ''); }],
      [31.5, function () { setFig('qa', F(RIG, 'walk', '', 'l', '3000ms')); }],
      [31.5, camTo(66, 3000)],
      [33.0, function () { setFig('mgr', F(HAND, 'walk', T(5), '', '3000ms')); }],
      [34.5, function () { setFig('qa', F(RIG, 'lens', T(3), '', '0ms')); setFig('dev2', F(BENCH2, 'walk', '', 'l', '3500ms')); }],
      [35.0, camTo(32, 2000)],
      [36.0, function () { setFig('mgr', F(HAND, 'wait', T(5), '', '0ms')); }],
      [38.0, function () { setFig('dev2', F(BENCH2, 'hammer', T(5), '', '0ms')); setFig('mgr', F(LECT, 'walk', '', 'l', '3000ms')); ev('nord-api-manager', 'dispatch', T(5), 'delegated by k.vale', ''); ev('sveit', 'checks', T(3), 'passed · 14 checks · 4m 02s', 't-green'); }],
      [41.0, function () { setFig('mgr', F(LECT, 'read', T(6), '', '0ms')); }],
      [43.0, function () { run(cycle(n + 2)); }]
    ];
  }

  function run(schedule) {
    var steps = schedule.slice().sort(function (a, b) { return a[0] - b[0]; });
    var i = 0, last = 0;
    var next = function () {
      if (!alive || i >= steps.length) return;
      var step = steps[i++];
      var at = step[0] * 1000;
      var delay = Math.max(0, at - last);
      last = at;
      timer = setTimeout(function () { if (!alive) return; step[1](); next(); }, delay);
    };
    next();
  }

  /* ---------- start ---------- */
  initial(144);
  seed();
  placeCamera();
  window.addEventListener('resize', function () { var d = cam.dur; cam.dur = 0; placeCamera(); cam.dur = d; });
  if (!reduced) run(cycle(144));
  window.addEventListener('pagehide', function () { alive = false; clearTimeout(timer); });
})();
