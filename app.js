/* Plant Data Logger demo, CICTNA RDC.
   Everything here is simulated in the browser: no PLC, no database, no network calls. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ text */
  var L = {
    en: {
      appName: 'Plant Data Logger', plantTime: 'Plant time',
      ribbon: 'Interactive demo with simulated values. No real plant or PLC is connected.',
      heroTitle: 'From the PLC to the report, without losing a value',
      heroText: 'Process values are read from the plant controllers every two seconds, stored in PostgreSQL, and turned into live trends, alarms and daily reports for operators and management.',
      plantMsf: 'MSF desalination unit', plantDosing: 'Acid dosing skid',
      trendEyebrow: 'Last 30 minutes', alarmEyebrow: 'Alarms and events', alarmTitle: 'Alarm list',
      pathEyebrow: 'How the data moves', pathTitle: 'Collection, buffering and storage',
      dropNet: 'Simulate network drop', restoreNet: 'Restore network',
      logTitle: 'Collector log', reportEyebrow: 'Generated every night at 00:05', print: 'Print / PDF',
      liveEyebrow: 'From demo to a live system', liveTitle: 'What a real project adds',
      live1: 'Connection to your PLCs and your real tag list, over Modbus TCP, OPC UA or Siemens S7',
      live2: 'Database and collector installed on the plant PC, your server or a cloud machine, with backups',
      live3: 'Reports in the format your client asks for, in Arabic and English, sent by email',
      live4: "Export to the client's ERP or maintenance system, and user accounts with access rights",
      live5: 'Commissioning on site or remote, documentation and support',
      liveNote: 'Works on its own or next to an existing SCADA such as Wonderware (AVEVA).',
      builtBy: 'Built by',
      // status
      sCollector: 'Collector', sRunning: 'running', sPlc: 'PLC links', sDb: 'Database', sWriting: 'writing',
      sBuffering: 'unreachable, buffering', sFlushing: 'catching up', sAlarms: 'Active alarms', sUptime: 'Uptime',
      // tags
      tDist: 'Distillate production', tFeed: 'Seawater feed', tTbt: 'Top brine temperature (TBT)',
      tSteam: 'Steam to brine heater', tGor: 'Gain output ratio (GOR)', tCond: 'Distillate conductivity',
      tVac: 'Last stage vacuum', tAnti: 'Antiscalant dosing',
      tFlow: 'Treated water flow', tRate: 'Acid dosing rate', tPhIn: 'pH before dosing', tPhOut: 'pH after dosing',
      tTank: 'Acid tank level', tStroke: 'Pump A stroke', tSpec: 'Specific acid use', tDuty: 'Duty pump',
      dutyVal: 'A', dutyMeta: 'B on standby', calc: 'calculated', setpoint: 'setpoint',
      lo: 'low', hi: 'high', loLo: 'low low', hiHi: 'high high',
      // trend
      trendMsf: 'Production and top brine temperature', trendDosing: 'pH control and acid dosing',
      trendNoteMsf: 'Stored every 2 seconds. During a network drop the collector keeps the values and fills the gap afterwards.',
      trendNoteDosing: 'The dashed line is the pH setpoint. Dosing follows the water flow so the pH stays on target.',
      // path
      nPlcMsf: 'Plant controllers', nPlcMsfP: 'Rockwell PLC over OPC UA, Schneider PLC over Modbus TCP',
      nPlcDos: 'Plant controller', nPlcDosP: 'Schneider PLC over Modbus TCP',
      nCol: 'Collector service', nColP: 'Reads every 2 s, checks quality, keeps a local buffer if the database is unreachable',
      nDb: 'PostgreSQL', nDbP: 'Time-stamped values, partitioned by month, kept for years',
      nOut: 'Reports and exports', nOutP: 'Operator screens, daily reports, CSV and ERP export',
      cRows: 'Values stored today', cBuf: 'In local buffer', cLost: 'Values lost', cLat: 'Last write',
      // alarms
      aActive: 'active', aAck: 'acknowledged', aCleared: 'cleared', ackBtn: 'Acknowledge', noAlarms: 'No alarms on this unit.',
      evStart: 'Collector started, all PLC links connected', evRefill: 'Acid tank refilled',
      evNetDown: 'Database connection lost, buffering locally', evNetUp: 'Database back, buffer written, nothing lost',
      // report
      repMsf: 'Daily production report', repDosing: 'Daily dosing report',
      rDate: 'Date', rDist: 'Distillate (m³)', rSteam: 'Steam (t)', rGor: 'GOR', rTbt: 'Avg TBT (°C)',
      rAnti: 'Antiscalant (L)', rAvail: 'Availability (%)', rAlarms: 'Alarms',
      rWater: 'Treated water (m³)', rAcid: 'Acid used (L)', rSpec: 'Acid use (g/m³)', rPh: 'Avg pH after',
      rPumpA: 'Pump A (h)', rPumpB: 'Pump B (h)', rTotal: 'Total / average',
      // toasts
      csvDone: 'Report exported as CSV.', netDown: 'Network to the database dropped. The collector keeps buffering.',
      netUp: 'Network restored. Buffered values are being written.'
    },
    ar: {
      appName: 'مسجّل بيانات المحطة', plantTime: 'توقيت المحطة',
      ribbon: 'نسخة تجريبية تفاعلية بقيم محاكاة. لا توجد محطة أو PLC متصلة فعليًا.',
      heroTitle: 'من الـ PLC إلى التقرير، دون فقدان أي قيمة',
      heroText: 'تُقرأ قيم التشغيل من وحدات التحكم كل ثانيتين، وتُخزَّن في PostgreSQL، ثم تتحول إلى منحنيات مباشرة وإنذارات وتقارير يومية للمشغّلين والإدارة.',
      plantMsf: 'وحدة تحلية MSF', plantDosing: 'وحدة حقن الحمض',
      trendEyebrow: 'آخر 30 دقيقة', alarmEyebrow: 'الإنذارات والأحداث', alarmTitle: 'قائمة الإنذارات',
      pathEyebrow: 'مسار البيانات', pathTitle: 'الجمع والتخزين المؤقت والحفظ',
      dropNet: 'محاكاة انقطاع الشبكة', restoreNet: 'إعادة الشبكة',
      logTitle: 'سجل خدمة الجمع', reportEyebrow: 'يُنشأ كل ليلة الساعة 00:05', print: 'طباعة / PDF',
      liveEyebrow: 'من النسخة التجريبية إلى نظام فعلي', liveTitle: 'ما يضيفه مشروع حقيقي',
      live1: 'الربط مع وحدات PLC لديكم وقائمة الإشارات الفعلية عبر Modbus TCP أو OPC UA أو Siemens S7',
      live2: 'تثبيت قاعدة البيانات وخدمة الجمع على حاسوب المحطة أو خادمكم أو على السحابة، مع النسخ الاحتياطي',
      live3: 'تقارير بالصيغة التي يطلبها عميلكم، بالعربية والإنجليزية، تُرسل بالبريد الإلكتروني',
      live4: 'تصدير إلى نظام ERP أو نظام الصيانة لدى العميل، وحسابات مستخدمين بصلاحيات',
      live5: 'تشغيل تجريبي في الموقع أو عن بُعد، مع التوثيق والدعم',
      liveNote: 'يعمل منفردًا أو بجانب نظام SCADA قائم مثل Wonderware (AVEVA).',
      builtBy: 'من تطوير',
      sCollector: 'خدمة الجمع', sRunning: 'تعمل', sPlc: 'اتصالات PLC', sDb: 'قاعدة البيانات', sWriting: 'تكتب',
      sBuffering: 'غير متاحة، تخزين مؤقت', sFlushing: 'تستدرك البيانات', sAlarms: 'إنذارات نشطة', sUptime: 'مدة التشغيل',
      tDist: 'إنتاج الماء المقطّر', tFeed: 'تغذية مياه البحر', tTbt: 'أعلى درجة حرارة للمحلول الملحي (TBT)',
      tSteam: 'البخار إلى سخان المحلول الملحي', tGor: 'نسبة الكسب (GOR)', tCond: 'موصلية الماء المقطّر',
      tVac: 'تفريغ المرحلة الأخيرة', tAnti: 'حقن مانع الترسّب',
      tFlow: 'تدفق الماء المعالَج', tRate: 'معدل حقن الحمض', tPhIn: 'الأس الهيدروجيني قبل الحقن', tPhOut: 'الأس الهيدروجيني بعد الحقن',
      tTank: 'مستوى خزان الحمض', tStroke: 'شوط المضخة A', tSpec: 'الاستهلاك النوعي للحمض', tDuty: 'المضخة العاملة',
      dutyVal: 'A', dutyMeta: 'المضخة B احتياط', calc: 'محسوبة', setpoint: 'القيمة المطلوبة',
      lo: 'منخفض', hi: 'مرتفع', loLo: 'منخفض جدًا', hiHi: 'مرتفع جدًا',
      trendMsf: 'الإنتاج ودرجة حرارة المحلول الملحي', trendDosing: 'التحكم في الأس الهيدروجيني وحقن الحمض',
      trendNoteMsf: 'تُخزَّن القيم كل ثانيتين. عند انقطاع الشبكة تحتفظ خدمة الجمع بالقيم وتملأ الفجوة لاحقًا.',
      trendNoteDosing: 'الخط المتقطع هو القيمة المطلوبة للأس الهيدروجيني. يتبع الحقن تدفق الماء ليبقى الأس الهيدروجيني على الهدف.',
      nPlcMsf: 'وحدات التحكم', nPlcMsfP: 'PLC من Rockwell عبر OPC UA و PLC من Schneider عبر Modbus TCP',
      nPlcDos: 'وحدة التحكم', nPlcDosP: 'PLC من Schneider عبر Modbus TCP',
      nCol: 'خدمة الجمع', nColP: 'تقرأ كل ثانيتين، تتحقق من جودة القيم، وتحتفظ بها محليًا إذا تعذّر الوصول إلى قاعدة البيانات',
      nDb: 'PostgreSQL', nDbP: 'قيم بختم زمني، مقسّمة شهريًا، محفوظة لسنوات',
      nOut: 'التقارير والتصدير', nOutP: 'شاشات المشغّلين، تقارير يومية، تصدير CSV و ERP',
      cRows: 'قيم محفوظة اليوم', cBuf: 'في التخزين المؤقت', cLost: 'قيم مفقودة', cLat: 'آخر كتابة',
      aActive: 'نشط', aAck: 'تم الإقرار', aCleared: 'زال', ackBtn: 'إقرار', noAlarms: 'لا توجد إنذارات لهذه الوحدة.',
      evStart: 'بدأت خدمة الجمع، وجميع اتصالات PLC قائمة', evRefill: 'تمت إعادة تعبئة خزان الحمض',
      evNetDown: 'انقطع الاتصال بقاعدة البيانات، التخزين المؤقت محليًا', evNetUp: 'عادت قاعدة البيانات، كُتب التخزين المؤقت دون فقدان',
      repMsf: 'تقرير الإنتاج اليومي', repDosing: 'تقرير الحقن اليومي',
      rDate: 'التاريخ', rDist: 'الماء المقطّر (م³)', rSteam: 'البخار (طن)', rGor: 'GOR', rTbt: 'متوسط TBT (°م)',
      rAnti: 'مانع الترسّب (لتر)', rAvail: 'الجاهزية (%)', rAlarms: 'الإنذارات',
      rWater: 'الماء المعالَج (م³)', rAcid: 'الحمض المستهلك (لتر)', rSpec: 'استهلاك الحمض (غ/م³)', rPh: 'متوسط الأس بعد الحقن',
      rPumpA: 'المضخة A (ساعة)', rPumpB: 'المضخة B (ساعة)', rTotal: 'المجموع / المتوسط',
      csvDone: 'تم تصدير التقرير بصيغة CSV.', netDown: 'انقطعت الشبكة إلى قاعدة البيانات. خدمة الجمع تواصل التخزين المؤقت.',
      netUp: 'عادت الشبكة. تُكتب القيم المخزنة مؤقتًا الآن.'
    }
  };
  var lang = 'en';
  try { if (localStorage.getItem('pdl-lang') === 'ar') lang = 'ar'; } catch (e) { /* storage unavailable */ }
  function t(k) { return (L[lang] && L[lang][k]) || L.en[k] || k; }

  /* ----------------------------------------------------------- helpers */
  var TICK = 2000, WINDOW = 900; // 900 points x 2 s = 30 minutes
  var tz = 'Asia/Riyadh';
  var fmtTime = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  var fmtHM = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
  var fmtDate = new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', day: '2-digit', month: 'short' });
  var fmtDateAr = new Intl.DateTimeFormat('ar-SA-u-nu-latn-ca-gregory', { timeZone: tz, weekday: 'short', day: '2-digit', month: 'short' });
  function nf(v, d) { return Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function gauss() { return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function seeded(seed) { // mulberry32
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var r = Math.imul(a ^ (a >>> 15), 1 | a);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  var toastTimer;
  function toast(msg) {
    var el = $('toast'); el.textContent = msg; el.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove('on'); }, 3000);
  }

  /* ------------------------------------------------------------ plants */
  // Each tag: key, label key, unit, decimals, limits, source shown under the tile.
  var PLANTS = {
    msf: {
      plcs: [
        { id: 'PLC-1', vendor: 'Rockwell', proto: 'UA', addr: 'opc.tcp://10.20.1.11:4840' },
        { id: 'PLC-2', vendor: 'Schneider', proto: 'MB', addr: '10.20.1.12:502' }
      ],
      tags: [
        { k: 'dist', l: 'tDist', u: 'm³/h', d: 1, lo: 37, src: 'UA FT-301' },
        { k: 'feed', l: 'tFeed', u: 'm³/h', d: 0, src: 'UA FT-101' },
        { k: 'tbt', l: 'tTbt', u: '°C', d: 1, hi: 110, hiHi: 112, src: 'UA TT-201' },
        { k: 'steam', l: 'tSteam', u: 't/h', d: 2, src: 'UA FT-401' },
        { k: 'gor', l: 'tGor', u: '', d: 2, lo: 7.4, src: 'calc' },
        { k: 'cond', l: 'tCond', u: 'µS/cm', d: 1, hi: 20, hiHi: 25, src: 'MB 40031' },
        { k: 'vac', l: 'tVac', u: 'mbar', d: 0, hi: 90, src: 'MB 40035' },
        { k: 'anti', l: 'tAnti', u: 'L/h', d: 2, lo: 2.6, src: 'MB 40041' }
      ],
      trend: [{ k: 'dist', axis: 'y', color: '#3d6d78' }, { k: 'tbt', axis: 'y1', color: '#d9895c' }]
    },
    dosing: {
      plcs: [{ id: 'PLC-3', vendor: 'Schneider', proto: 'MB', addr: '10.30.2.21:502' }],
      tags: [
        { k: 'flow', l: 'tFlow', u: 'm³/h', d: 1, src: 'MB 40001' },
        { k: 'rate', l: 'tRate', u: 'L/h', d: 2, src: 'MB 40005' },
        { k: 'phIn', l: 'tPhIn', u: 'pH', d: 2, src: 'MB 40011' },
        { k: 'phOut', l: 'tPhOut', u: 'pH', d: 2, lo: 6.5, hi: 7.1, src: 'MB 40013' },
        { k: 'tank', l: 'tTank', u: '%', d: 1, lo: 20, loLo: 10, src: 'MB 40021' },
        { k: 'stroke', l: 'tStroke', u: '%', d: 0, hi: 90, src: 'MB 40025' },
        { k: 'spec', l: 'tSpec', u: 'g/m³', d: 0, src: 'calc' },
        { k: 'duty', l: 'tDuty', text: true, src: 'MB 10003' }
      ],
      trend: [{ k: 'phOut', axis: 'y', color: '#3d6d78' }, { k: 'rate', axis: 'y1', color: '#b8923f' }],
      setpoint: 6.8
    }
  };

  // Simulation state per plant.
  var S = {
    msf: { w: { dist: 0, tbt: 0, cond: 0 }, spikeAt: 0, spikeLen: 13 },
    dosing: { w: { flow: 0, ph: 0 }, tank: 21.4, refilling: false }
  };

  function stepMsf(sec, live) {
    var s = S.msf, w = s.w;
    w.dist = clamp(w.dist + gauss() * 0.06, -0.8, 0.8);
    w.tbt = clamp(w.tbt + gauss() * 0.02, -0.3, 0.3);
    w.cond = clamp(w.cond + gauss() * 0.05, -0.6, 0.6);
    var dist = 41.8 + 1.1 * Math.sin(sec / 610) + w.dist + gauss() * 0.12;
    var gorBase = 7.95 + 0.12 * Math.sin(sec / 1300);
    var steam = dist / gorBase + gauss() * 0.02;
    var cond = 11.4 + 0.7 * Math.sin(sec / 420) + w.cond + gauss() * 0.15;
    if (live && s.spikeAt > 0) {
      s.spikeAt--;
      if (s.spikeAt === 0) s.spikeLen = 14;
    } else if (live && s.spikeLen > 0 && s.spikeAt === 0) {
      var k = 14 - s.spikeLen; // 0..13: rise then fall
      cond += k < 6 ? k * 2.9 : Math.max(0, (13 - k) * 2.2);
      s.spikeLen--;
      if (s.spikeLen === 0) s.spikeAt = 150 + Math.floor(Math.random() * 60); // next excursion in 5 to 7 minutes
    }
    return {
      dist: dist,
      feed: 332 + 6 * Math.sin(sec / 900 + 1) + gauss() * 1.2,
      tbt: 106.2 + 0.7 * Math.sin(sec / 700 + 2) + w.tbt + gauss() * 0.06,
      steam: steam,
      gor: dist / steam,
      cond: cond,
      vac: 72 + 2 * Math.sin(sec / 500) + gauss() * 0.5,
      anti: 3.2 + 0.05 * Math.sin(sec / 300) + gauss() * 0.02
    };
  }

  function stepDosing(sec, live) {
    var s = S.dosing, w = s.w;
    w.flow = clamp(w.flow + gauss() * 0.5, -4, 4);
    w.ph = clamp(w.ph + gauss() * 0.01, -0.06, 0.06);
    var flow = 118 + 9 * Math.sin(sec / 800) + w.flow + gauss() * 0.6;
    var phIn = 7.95 + 0.05 * Math.sin(sec / 950) + gauss() * 0.01;
    var rate = flow * 0.104 * (1 + (phIn - 7.95) * 0.6) + gauss() * 0.05;
    var phOut = 6.8 + w.ph + gauss() * 0.02;
    if (live) {
      if (s.refilling) { s.tank = Math.min(84, s.tank + 3.4); if (s.tank >= 84) s.refilling = false; }
      else { s.tank -= 0.05; if (s.tank <= 15) { s.refilling = true; addEvent('dosing', t('evRefill'), 'evRefill'); } }
    }
    return {
      flow: flow, rate: rate, phIn: phIn, phOut: phOut,
      tank: s.tank, stroke: rate / 25 * 100,
      spec: rate * 1840 / flow, // 98 % sulphuric acid, 1.84 kg/L
      duty: 'A'
    };
  }
  var STEP = { msf: stepMsf, dosing: stepDosing };

  /* ------------------------------------------------------------ state */
  var plant = 'msf';
  var t0 = Date.now();
  var current = { msf: {}, dosing: {} };
  var series = { msf: {}, dosing: {} };   // tag -> [{t, v}]
  var pending = [];                        // points held while the database is unreachable
  var net = 'up', downTicks = 0, flushTicks = 0;
  var buffered = 0, lastLatency = 3;
  var tagsPerTick = PLANTS.msf.tags.length + PLANTS.dosing.tags.length;
  var midnight = (function () {
    var parts = fmtTime.format(new Date()).split(':').map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  })();
  var rowsToday = Math.floor(midnight / 2) * tagsPerTick;
  var alarms = [];  // {id, plant, key, tagKey, level, text, time, state}
  var alarmSeq = 1;

  // Backfill 30 minutes of history so the trend is full on load.
  (function backfill() {
    var now = Date.now();
    ['msf', 'dosing'].forEach(function (p) {
      PLANTS[p].trend.forEach(function (tr) { series[p][tr.k] = []; });
      for (var i = WINDOW; i > 0; i--) {
        var ts = now - i * TICK, sec = ts / 1000;
        var v = STEP[p](sec, false);
        PLANTS[p].trend.forEach(function (tr) { series[p][tr.k].push({ t: ts, v: v[tr.k] }); });
      }
    });
    S.msf.spikeAt = 25; // a conductivity excursion about 50 s after opening
  })();

  // Earlier events so the list is not empty.
  function pastAlarm(p, tagKey, level, minutesAgo, clearedAfter) {
    var tg = PLANTS[p].tags.filter(function (x) { return x.k === tagKey; })[0];
    alarms.push({ id: alarmSeq++, plant: p, tagKey: tagKey, level: level, time: Date.now() - minutesAgo * 60000,
      state: 'cleared', clearedAt: Date.now() - (minutesAgo - clearedAfter) * 60000, label: tg.l });
  }
  pastAlarm('msf', 'vac', 'hi', 142, 9);
  pastAlarm('msf', 'anti', 'lo', 61, 4);
  pastAlarm('dosing', 'phOut', 'lo', 97, 3);
  addEvent('msf', null, 'evStart', Date.now() - 6 * 3600000);
  addEvent('dosing', null, 'evStart', Date.now() - 6 * 3600000);

  function addEvent(p, text, key, when) {
    alarms.push({ id: alarmSeq++, plant: p, event: true, evKey: key, time: when || Date.now(), state: 'event' });
  }

  /* ------------------------------------------------------------ alarms */
  function levelOf(tag, v) {
    if (tag.text) return null;
    if (tag.hiHi != null && v >= tag.hiHi) return 'hiHi';
    if (tag.loLo != null && v <= tag.loLo) return 'loLo';
    if (tag.hi != null && v >= tag.hi) return 'hi';
    if (tag.lo != null && v <= tag.lo) return 'lo';
    return null;
  }
  function checkAlarms(p) {
    PLANTS[p].tags.forEach(function (tag) {
      var lvl = levelOf(tag, current[p][tag.k]);
      var open = alarms.filter(function (a) { return a.plant === p && a.tagKey === tag.k && (a.state === 'active' || a.state === 'ack'); })[0];
      if (lvl && !open) {
        alarms.push({ id: alarmSeq++, plant: p, tagKey: tag.k, level: lvl, label: tag.l, time: Date.now(), state: 'active' });
      } else if (lvl && open && open.level !== lvl && (lvl === 'hiHi' || lvl === 'loLo')) {
        open.level = lvl; open.state = 'active';
      } else if (!lvl && open) {
        open.state = 'cleared'; open.clearedAt = Date.now();
      }
    });
  }

  /* ------------------------------------------------------------ rendering */
  function applyStatic() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $('langBtn').textContent = lang === 'ar' ? 'English' : 'عربي';
    $('netBtn').textContent = net === 'down' ? t('restoreNet') : t('dropNet');
    $('trendTitle').textContent = plant === 'msf' ? t('trendMsf') : t('trendDosing');
    $('trendNote').textContent = plant === 'msf' ? t('trendNoteMsf') : t('trendNoteDosing');
    $('reportTitle').textContent = plant === 'msf' ? t('repMsf') : t('repDosing');
    document.title = t('appName') + ' | CICTNA RDC (demo)';
  }

  function renderStatus() {
    var activeAll = alarms.filter(function (a) { return a.state === 'active' || a.state === 'ack'; }).length;
    var plcs = PLANTS.msf.plcs.length + PLANTS.dosing.plcs.length;
    var up = Math.floor((Date.now() - t0) / 1000) + 6 * 3600 + 14 * 60;
    var h = Math.floor(up / 3600), m = Math.floor(up % 3600 / 60);
    var dbState = net === 'down' ? ['alarm', t('sBuffering')] : net === 'flush' ? ['warn', t('sFlushing')] : ['', t('sWriting')];
    $('status').innerHTML =
      chip('', t('sCollector'), t('sRunning')) +
      chip('', t('sPlc'), plcs + ' / ' + plcs) +
      chip(dbState[0], t('sDb'), dbState[1]) +
      chip(activeAll ? 'alarm' : '', t('sAlarms'), activeAll) +
      chip('', t('sUptime'), h + 'h ' + (m < 10 ? '0' : '') + m + 'm');
  }
  function chip(cls, k, v) { return '<span class="chip"><span class="dot ' + cls + '"></span>' + esc(k) + ': <b>' + esc(v) + '</b></span>'; }

  function renderKpis() {
    var html = PLANTS[plant].tags.map(function (tag) {
      var v = current[plant][tag.k];
      if (tag.text) {
        return '<div class="kpi"><div class="lbl">' + esc(t(tag.l)) + '</div><div class="val">' + esc(t('dutyVal')) +
          '</div><div class="meta"><span>' + esc(t('dutyMeta')) + '</span><span class="src">' + tag.src + '</span></div></div>';
      }
      var lvl = levelOf(tag, v);
      var cls = lvl === 'hiHi' || lvl === 'loLo' ? 'alarm' : lvl ? 'warn' : '';
      var lim = [];
      if (tag.lo != null) lim.push('L ' + tag.lo);
      if (tag.hi != null) lim.push('H ' + tag.hi);
      if (tag.k === 'phOut') lim = [t('setpoint') + ' 6.80'];
      var src = tag.src === 'calc' ? t('calc') : tag.src;
      return '<div class="kpi ' + cls + '"><div class="lbl">' + esc(t(tag.l)) + '</div><div class="val">' + nf(v, tag.d) +
        (tag.u ? '<small>' + tag.u + '</small>' : '') + '</div><div class="meta"><span>' + (lvl ? esc(t(lvl)) : esc(lim.join(' · '))) +
        '</span><span class="src">' + esc(src) + '</span></div></div>';
    }).join('');
    $('kpis').innerHTML = html;
  }

  function renderPath() {
    var msf = plant === 'msf';
    var plcAddr = PLANTS[plant].plcs.map(function (c) { return '<span class="addr">' + c.id + '  ' + c.addr + '</span>'; }).join('');
    var dbDown = net === 'down' ? ' down' : '';
    var linkDb = net === 'down' ? 'link down' : net === 'flush' ? 'link fast' : 'link';
    $('path').innerHTML =
      node('', msf ? t('nPlcMsf') : t('nPlcDos'), msf ? t('nPlcMsfP') : t('nPlcDosP'), plcAddr) +
      '<div class="link"></div>' +
      node('', t('nCol'), t('nColP'), '<span class="addr">collector.service  2 s</span>') +
      '<div class="' + linkDb + '"></div>' +
      node(dbDown, t('nDb'), t('nDbP'), '<span class="addr">pg 10.20.0.5:5432</span>') +
      '<div class="' + (net === 'down' ? 'link down' : 'link') + '"></div>' +
      node('', t('nOut'), t('nOutP'), '');
  }
  function node(cls, h, p, extra) { return '<div class="node' + cls + '"><h3>' + esc(h) + '</h3><p>' + esc(p) + '</p>' + extra + '</div>'; }

  function renderCounters() {
    $('counters').innerHTML =
      ctr('', t('cRows'), nf(rowsToday, 0)) +
      ctr(buffered ? 'alarm' : '', t('cBuf'), nf(buffered, 0)) +
      ctr('ok', t('cLost'), '0') +
      ctr('', t('cLat'), net === 'down' ? '--' : lastLatency + ' ms');
  }
  function ctr(cls, k, v) { return '<div class="ctr ' + cls + '"><span>' + esc(k) + '</span><b>' + v + '</b></div>'; }

  function renderAlarms() {
    var list = alarms.filter(function (a) { return a.plant === plant; }).sort(function (a, b) { return b.time - a.time; }).slice(0, 12);
    var active = alarms.filter(function (a) { return a.plant === plant && (a.state === 'active' || a.state === 'ack'); }).length;
    var pill = $('alarmCount'); pill.textContent = active; pill.className = 'pill' + (active ? ' alarm' : '');
    if (!list.length) { $('alarms').innerHTML = '<div class="empty">' + esc(t('noAlarms')) + '</div>'; return; }
    $('alarms').innerHTML = list.map(function (a) {
      var when = fmtTime.format(new Date(a.time));
      if (a.event) {
        return '<div class="al cleared"><span class="sev" style="background:var(--sea)"></span><span class="msg">' + esc(t(a.evKey)) +
          '</span><span class="t">' + when + '</span><span class="act"></span></div>';
      }
      var tag = PLANTS[a.plant].tags.filter(function (x) { return x.k === a.tagKey; })[0];
      var msg = t(a.label) + ': ' + t(a.level);
      var stateTxt = a.state === 'active' ? t('aActive') : a.state === 'ack' ? t('aAck') : t('aCleared') + ' ' + fmtHM.format(new Date(a.clearedAt));
      var btn = a.state === 'active' ? '<button type="button" data-ack="' + a.id + '">' + esc(t('ackBtn')) + '</button>' : '';
      return '<div class="al ' + a.state + '"><span class="sev"></span><span class="msg">' + esc(msg) + '</span><span class="t">' + when +
        '  ·  ' + esc(stateTxt) + '  ·  ' + esc(tag.src === 'calc' ? t('calc') : tag.src) + '</span><span class="act">' + btn + '</span></div>';
    }).join('');
  }

  /* ------------------------------------------------------------ log */
  var logLines = [];
  function logLine(html) {
    logLines.push(html); if (logLines.length > 80) logLines.shift();
    var el = $('log'), atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
    el.innerHTML = logLines.join('\n');
    if (atBottom) el.scrollTop = el.scrollHeight;
  }
  function ts() { return '<span class="dim">' + fmtTime.format(new Date()) + '.' + String(Date.now() % 1000).padStart(3, '0') + '</span>'; }
  function tagSpan(kind) { return '<span class="tag ' + kind.toLowerCase() + '">' + kind + '</span>'; }

  function logTick() {
    var p = plant, c = current[p];
    PLANTS[p].plcs.forEach(function (plc) {
      var ms = 6 + Math.floor(Math.random() * 14);
      if (plc.proto === 'MB') {
        var regs = p === 'msf' ? '40031..40042' : '40001..40026';
        logLine(ts() + '  ' + tagSpan('MB') + '  ' + plc.id + '  read HR ' + regs + '  ' + (p === 'msf' ? 12 : 26) + ' regs  <span class="okc">OK</span>  ' + ms + ' ms');
      } else {
        logLine(ts() + '  ' + tagSpan('UA') + '  ' + plc.id + '  ns=2;s=MSF.TT201.PV = ' + nf(c.tbt, 2) + ' °C  <span class="okc">Good</span>  (+3 nodes)  ' + ms + ' ms');
      }
    });
    if (net === 'up') {
      logLine(ts() + '  ' + tagSpan('DB') + '  insert ' + tagsPerTick + ' values  plant_values_' + new Date().getFullYear() + '_' + String(new Date().getMonth() + 1).padStart(2, '0') + '  <span class="okc">OK</span>  ' + lastLatency + ' ms');
    } else if (net === 'down') {
      logLine(ts() + '  ' + tagSpan('DB') + '  <span class="err">write failed: connection timed out (10.20.0.5:5432)</span>  spooled ' + tagsPerTick + ', buffer ' + buffered);
    }
  }

  /* ------------------------------------------------------------ chart */
  var chart;
  function buildChart() {
    if (chart) chart.destroy();
    var cfg = PLANTS[plant];
    var ds = cfg.trend.map(function (tr) {
      var tag = cfg.tags.filter(function (x) { return x.k === tr.k; })[0];
      return {
        label: t(tag.l) + ' (' + tag.u + ')', yAxisID: tr.axis, borderColor: tr.color, backgroundColor: tr.color,
        data: series[plant][tr.k].map(function (pt) { return { x: pt.t, y: pt.v }; }),
        borderWidth: 1.8, pointRadius: 0, tension: 0.25
      };
    });
    if (cfg.setpoint) {
      ds.push({ label: t('setpoint') + ' pH', yAxisID: 'y', borderColor: '#2f5a46', borderDash: [5, 4], borderWidth: 1.2, pointRadius: 0,
        data: [{ x: series[plant][cfg.trend[0].k][0].t, y: cfg.setpoint }, { x: Date.now() + 3600000, y: cfg.setpoint }] });
    }
    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
    Chart.defaults.color = '#5b6b6a';
    chart = new Chart($('trend'), {
      type: 'line',
      data: { datasets: ds },
      options: {
        animation: false, responsive: true, maintainAspectRatio: false, parsing: false, normalized: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', rtl: lang === 'ar', labels: { boxWidth: 12, font: { size: 11 } } },
          tooltip: {
            rtl: lang === 'ar',
            callbacks: {
              title: function (items) { return items.length ? fmtTime.format(new Date(items[0].parsed.x)) : ''; },
              label: function (it) { return ' ' + it.dataset.label + ': ' + nf(it.parsed.y, 2); }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            min: Date.now() - WINDOW * TICK, max: Date.now(),
            ticks: { maxTicksLimit: 7, callback: function (v) { return fmtHM.format(new Date(v)); }, font: { size: 11 } },
            grid: { display: false }
          },
          y: { position: 'left', grid: { color: '#e3e9e8' }, ticks: { font: { size: 11 } },
            suggestedMin: plant === 'msf' ? 38 : 6.5, suggestedMax: plant === 'msf' ? 45 : 7.1 },
          y1: { position: 'right', grid: { display: false }, ticks: { font: { size: 11 } },
            suggestedMin: plant === 'msf' ? 104 : 10, suggestedMax: plant === 'msf' ? 108 : 15 }
        }
      }
    });
  }
  function pushPoints(p, ts, values) {
    PLANTS[p].trend.forEach(function (tr) {
      var arr = series[p][tr.k]; arr.push({ t: ts, v: values[tr.k] });
      while (arr.length && arr[0].t < Date.now() - WINDOW * TICK) arr.shift();
    });
  }
  function refreshChart() {
    if (!chart) return;
    var cfg = PLANTS[plant];
    cfg.trend.forEach(function (tr, i) {
      chart.data.datasets[i].data = series[plant][tr.k].map(function (pt) { return { x: pt.t, y: pt.v }; });
    });
    chart.options.scales.x.min = Date.now() - WINDOW * TICK;
    chart.options.scales.x.max = Date.now();
    chart.update('none');
  }

  /* ------------------------------------------------------------ report */
  function reportData() {
    var rows = [], today = new Date();
    for (var i = 7; i >= 1; i--) {
      var d = new Date(today.getTime() - i * 86400000);
      var r = seeded(Number(d.toISOString().slice(0, 10).replace(/-/g, '')) + (plant === 'msf' ? 7 : 13));
      var avail = 96 + r() * 4, alarmsN = Math.floor(r() * 4);
      if (plant === 'msf') {
        var dist = 41.6 * 24 * avail / 100 + (r() - 0.5) * 18, gor = 7.85 + r() * 0.2, steam = dist / gor;
        rows.push([d, dist, steam, gor, 105.9 + r() * 0.7, 3.2 * 24 * avail / 100 + (r() - .5) * 2, avail, alarmsN]);
      } else {
        var water = 118 * 24 * avail / 100 + (r() - 0.5) * 60, acid = water * 0.104 + (r() - .5) * 4;
        var pa = 24 * avail / 100;
        rows.push([d, water, acid, acid * 1840 / water, 6.79 + r() * 0.03, pa, 24 - pa > 0.2 ? 24 - pa : 0, alarmsN]);
      }
    }
    return rows;
  }
  function reportCols() {
    return plant === 'msf'
      ? [['rDate'], ['rDist', 0, 'sum'], ['rSteam', 1, 'sum'], ['rGor', 2, 'avg'], ['rTbt', 1, 'avg'], ['rAnti', 1, 'sum'], ['rAvail', 1, 'avg'], ['rAlarms', 0, 'sum']]
      : [['rDate'], ['rWater', 0, 'sum'], ['rAcid', 1, 'sum'], ['rSpec', 0, 'avg'], ['rPh', 2, 'avg'], ['rPumpA', 1, 'sum'], ['rPumpB', 1, 'sum'], ['rAlarms', 0, 'sum']];
  }
  function renderReport() {
    var cols = reportCols(), rows = reportData(), df = lang === 'ar' ? fmtDateAr : fmtDate;
    var head = '<thead><tr>' + cols.map(function (c, i) { return '<th' + (i ? ' class="n"' : '') + '>' + esc(t(c[0])) + '</th>'; }).join('') + '</tr></thead>';
    var body = '<tbody>' + rows.map(function (r) {
      return '<tr>' + r.map(function (v, i) { return i === 0 ? '<td>' + esc(df.format(v)) + '</td>' : '<td class="n">' + nf(v, cols[i][1]) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody>';
    var foot = '<tfoot><tr>' + cols.map(function (c, i) {
      if (!i) return '<td>' + esc(t('rTotal')) + '</td>';
      var vals = rows.map(function (r) { return r[i]; }), sum = vals.reduce(function (a, b) { return a + b; }, 0);
      return '<td class="n">' + nf(c[2] === 'sum' ? sum : sum / vals.length, c[1]) + '</td>';
    }).join('') + '</tr></tfoot>';
    $('report').innerHTML = head + body + foot;
  }
  function exportCsv() {
    var cols = reportCols(), rows = reportData();
    var lines = [cols.map(function (c) { return L.en[c[0]]; }).join(',')];
    rows.forEach(function (r) {
      lines.push(r.map(function (v, i) { return i === 0 ? v.toISOString().slice(0, 10) : Number(v).toFixed(cols[i][1]); }).join(','));
    });
    var blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (plant === 'msf' ? 'msf-daily-report' : 'acid-dosing-daily-report') + '.csv';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    toast(t('csvDone'));
  }

  /* ------------------------------------------------------------ network drop */
  function dropNetwork() {
    net = 'down'; downTicks = 0;
    addEvent(plant, null, 'evNetDown');
    logLine(ts() + '  ' + tagSpan('DB') + '  <span class="err">connection lost to 10.20.0.5:5432, switching to local buffer (spool.db)</span>');
    toast(t('netDown'));
    renderAll();
  }
  function restoreNetwork() {
    net = 'flush'; flushTicks = 0;
    logLine(ts() + '  ' + tagSpan('DB') + '  reconnected, writing ' + nf(buffered, 0) + ' buffered values in batches of 500');
    toast(t('netUp'));
    renderAll();
  }

  /* ------------------------------------------------------------ main loop */
  function tick() {
    var now = Date.now(), sec = now / 1000;
    ['msf', 'dosing'].forEach(function (p) {
      current[p] = STEP[p](sec, true);
      checkAlarms(p);
      if (net === 'up' || net === 'flush') pushPoints(p, now, current[p]);
      else pending.push({ p: p, t: now, v: current[p] });
    });
    if (net === 'down') {
      buffered += tagsPerTick; downTicks++;
      if (downTicks >= 23) restoreNetwork(); // the network comes back on its own after about 45 s
    } else if (net === 'flush') {
      flushTicks++;
      var batch = Math.ceil(buffered / Math.max(1, 3 - flushTicks + 1));
      buffered = Math.max(0, buffered - batch); rowsToday += batch;
      if (flushTicks === 1) { // the held points appear in the trend: the gap fills
        pending.forEach(function (x) { pushPoints(x.p, x.t, x.v); });
        series.msf.dist.sort(sortT); series.msf.tbt.sort(sortT); series.dosing.phOut.sort(sortT); series.dosing.rate.sort(sortT);
        pending = [];
      }
      logLine(ts() + '  ' + tagSpan('DB') + '  batch written  ' + batch + ' values  <span class="okc">OK</span>  buffer ' + buffered);
      if (buffered === 0) {
        net = 'up';
        logLine(ts() + '  ' + tagSpan('DB') + '  <span class="okc">buffer empty, back to live writes. Values lost: 0</span>');
        addEvent(plant, null, 'evNetUp');
      }
      rowsToday += tagsPerTick;
    } else {
      rowsToday += tagsPerTick; lastLatency = 2 + Math.floor(Math.random() * 4);
    }
    logTick();
    renderAll();
    refreshChart();
  }
  function sortT(a, b) { return a.t - b.t; }

  function renderAll() {
    applyStatic(); renderStatus(); renderKpis(); renderPath(); renderCounters(); renderAlarms();
  }
  function clock() { $('clock').textContent = fmtTime.format(new Date()); }

  /* ------------------------------------------------------------ events */
  document.querySelectorAll('.seg').forEach(function (b) {
    b.addEventListener('click', function () {
      plant = b.getAttribute('data-plant');
      document.querySelectorAll('.seg').forEach(function (x) { x.classList.toggle('on', x === b); });
      logLines = []; $('log').innerHTML = '';
      renderAll(); renderReport(); buildChart();
    });
  });
  $('langBtn').addEventListener('click', function () {
    lang = lang === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem('pdl-lang', lang); } catch (e) { /* storage unavailable */ }
    renderAll(); renderReport(); buildChart();
  });
  $('netBtn').addEventListener('click', function () {
    if (net === 'down') restoreNetwork();
    else if (net === 'up') dropNetwork();
  });
  $('alarms').addEventListener('click', function (e) {
    var id = e.target.getAttribute && e.target.getAttribute('data-ack');
    if (!id) return;
    alarms.forEach(function (a) { if (String(a.id) === id && a.state === 'active') a.state = 'ack'; });
    renderAlarms(); renderStatus();
  });
  $('csvBtn').addEventListener('click', exportCsv);
  $('printBtn').addEventListener('click', function () {
    var card = $('report').closest('.card'); card.classList.add('print-me');
    window.print();
    setTimeout(function () { card.classList.remove('print-me'); }, 500);
  });

  /* ------------------------------------------------------------ start */
  ['msf', 'dosing'].forEach(function (p) { current[p] = STEP[p](Date.now() / 1000, false); });
  current.dosing.tank = S.dosing.tank;
  renderAll(); renderReport(); buildChart(); clock();
  logLine(ts() + '  collector 1.4.2 started earlier today, 3 PLC links, 16 values every 2 s');
  setInterval(tick, TICK);
  setInterval(clock, 1000);
})();
