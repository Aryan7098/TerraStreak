/**
 * TERRASTREAK v3 — APPLICATION ENGINE
 * Core State Management · Reactive Calculation Engine · Dynamic Ledger
 * Pinned viewport navigation · GreenGrid appliance scheduler · Virtual Ecosystem
 */

/**
 * Escape HTML special characters to prevent XSS injection
 * @param {string} str - Raw string to sanitize
 * @returns {string} HTML-safe string
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

/* ── Activity Catalog ── */
const ACTIVITIES = {
  consuming: [
    { id: 'suv',       icon: '🚗', name: 'SUV Commute',        unit: 'miles',    factor: 0.44, cat: 'Travel' },
    { id: 'sedan',     icon: '🚙', name: 'Sedan Commute',      unit: 'miles',    factor: 0.32, cat: 'Travel' },
    { id: 'hot_wash',  icon: '🔥', name: 'Hot Laundry Wash',   unit: 'loads',    factor: 0.95, cat: 'Home' },
    { id: 'dryer',     icon: '♨️',  name: 'Tumble Dryer',       unit: 'loads',    factor: 1.50, cat: 'Home' },
    { id: 'beef',      icon: '🥩', name: 'Beef Meal',          unit: 'meals',    factor: 7.20, cat: 'Diet' },
    { id: 'waste',     icon: '🗑️', name: 'Food Waste',         unit: 'portions', factor: 0.90, cat: 'Diet' },
    { id: 'plastic',   icon: '🧴', name: 'Single-Use Plastic', unit: 'items',    factor: 0.15, cat: 'Waste' },
    { id: 'vampire',   icon: '🔌', name: 'Standby Power',      unit: 'hours',    factor: 0.05, cat: 'Energy' }
  ],
  replenishing: [
    { id: 'cold_w',    icon: '❄️', name: 'Cold Wash Swap',     unit: 'loads',    factor: 0.80, cat: 'Home' },
    { id: 'line_d',    icon: '🧺', name: 'Line Dry Laundry',   unit: 'loads',    factor: 1.50, cat: 'Home' },
    { id: 'bike',      icon: '🚴', name: 'Walk / Bike Trip',    unit: 'miles',    factor: 0.32, cat: 'Travel' },
    { id: 'veg',       icon: '🥗', name: 'Plant-Based Meal',   unit: 'meals',    factor: 5.40, cat: 'Diet' },
    { id: 'unplug',    icon: '🔋', name: 'Unplug Sweep',       unit: 'rooms',    factor: 0.20, cat: 'Energy' },
    { id: 'email_d',   icon: '📧', name: 'Delete Server Email',unit: 'emails',   factor: 0.003,cat: 'Digital' },
    { id: 'byo',       icon: '♻️', name: 'Reusable Cup / Cup', unit: 'uses',     factor: 0.12, cat: 'Waste' },
    { id: 'transit',   icon: '🚌', name: 'Public Transit Trip',unit: 'miles',    factor: 0.17, cat: 'Travel' }
  ]
};

/* ── Digital Footprint Parameters (13 categories) ── */
const DIGITAL_CATS = [
  { id: 'stream',     icon: '📺', label: 'Video Streaming',   unit: 'hrs',     factor4k: 0.20, factor1080: 0.05 },
  { id: 'social',     icon: '📱', label: 'Social Media Scroll',unit: 'hrs',     factor: 0.06 },
  { id: 'gaming',     icon: '🎮', label: 'Online Gaming',      unit: 'hrs',     factor: 0.12 },
  { id: 'videocall',  icon: '📹', label: 'Video Conference',   unit: 'hrs',     factor: 0.10 },
  { id: 'music',      icon: '🎵', label: 'Music Streaming',    unit: 'hrs',     factor: 0.01 },
  { id: 'cloud',      icon: '☁️',  label: 'Cloud Upload / Sync',unit: 'GB',      factor: 0.02 },
  { id: 'browse',     icon: '🌐', label: 'Web Browsing',      unit: 'hrs',     factor: 0.03 },
  { id: 'ai',         icon: '🤖', label: 'AI Engine Queries',  unit: 'queries', factor: 0.02 },
  { id: 'email_j',    icon: '📧', label: 'Junk Emails Deleted',unit: 'emails',  factor: -0.003 },
  { id: 'smart_home', icon: '🏠', label: 'Smart Home Devices', unit: 'hrs',     factor: 0.008 },
  { id: 'crypto',     icon: '🪙', label: 'Crypto Transactions',unit: 'tx',      factor: 0.10 },
  { id: 'downloads',  icon: '📥', label: 'Large File Downloads',unit: 'GB',     factor: 0.04 },
  { id: 'charging',   icon: '🔌', label: 'Device Charging',    unit: 'hrs',     factor: 0.015 }
];

/* ── Quests & Gamification Targets ── */
const QUEST_DATA = {
  daily: [
    { id: 'dq1', name: 'Cold Wash Swap',       desc: 'Wash laundry on cold',                pts: 15, lvl: 'Photo Proof' },
    { id: 'dq2', name: 'Clean Grid Charge',    desc: 'Schedule appliance in green window',  pts: 20, lvl: 'API Verified' },
    { id: 'dq3', name: 'Digital Cleanse',      desc: 'Keep video streaming under 2 hours',   pts: 10, lvl: 'Self-Certified' },
    { id: 'dq4', name: 'Reusable Container',   desc: 'Use your own cup or bottle today',    pts: 15, lvl: 'Photo Proof' },
    { id: 'dq5', name: 'Veggie Meal Swap',     desc: 'Eat at least one plant-based meal',   pts: 12, lvl: 'Self-Certified' },
    { id: 'dq6', name: 'Eco Commute',          desc: 'Log a walk, bike, or public transit trip', pts: 18, lvl: 'API Verified' },
    { id: 'dq7', name: 'Unplug Sweep',         desc: 'Unplug chargers and electronics not in use', pts: 15, lvl: 'Photo Proof' }
  ],
  weekly: [
    { id: 'wg1', name: 'Active Commuter',      desc: 'Walk/bike/transit 15+ miles total',   pts: 80, target: 15, unit: 'miles' },
    { id: 'wg2', name: 'Digital Detoxer',      desc: 'Keep social media under 7 hours/wk',  pts: 60, target: 7,  unit: 'hrs' },
    { id: 'wg3', name: 'Line Dry Champions',   desc: 'Line dry laundry 3+ times',           pts: 50, target: 3,  unit: 'times' },
    { id: 'wg4', name: 'Meatless Week',        desc: 'Log 5+ plant-based meals this week',  pts: 70, target: 5,  unit: 'meals' }
  ],
  monthly: [
    { id: 'mg1', name: 'Carbon Defender',      desc: 'Keep net spent under 3.5 kg (5 days)',pts: 300, target: 5,  unit: 'days' },
    { id: 'mg2', name: 'Inbox Declutterer',    desc: 'Delete 500+ emails this month',       pts: 150, target: 500, unit: 'emails' }
  ]
};

/* ── 24-Hour Grid Power Quality Forecast ── */
const GRID_PROFILE = [
  'clean', 'clean', 'clean', 'moderate', 'moderate', 'dirty',
  'dirty', 'dirty', 'moderate', 'moderate', 'clean', 'clean',
  'clean', 'clean', 'clean', 'moderate', 'dirty', 'dirty',
  'dirty', 'dirty', 'moderate', 'moderate', 'clean', 'clean'
];

/* ── Application Core State ── */
const S = {
  userName: 'Eco-Warrior',
  pledge: false,
  budget: 5.0,
  spent: 0,
  emissionsTotal: 0,
  offsetsTotal: 0,
  streak: 0,
  coins: 0,
  protected: false,
  quests: [], // Array of completed quest IDs (daily/weekly/monthly)
  gridHr: 12,
  
  // Dynamic Activity Counts
  activities: {},
  // Dynamic Digital Inputs
  digital: {
    stream_res: '1080p'
  },
  // GreenGrid Scheduled tasks (key: hour, value: { name, type, kw, hours })
  gridSchedule: {},

  // Mock past success days tracking for monthly quest
  historyDaysUnderBudget: 0,

  init() {
    const data = localStorage.getItem('ts_v3_state');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // Whitelisted property loading — prevents prototype pollution
        const SAFE_KEYS = [
          'userName', 'pledge', 'budget', 'spent', 'emissionsTotal',
          'offsetsTotal', 'streak', 'coins', 'protected', 'quests',
          'gridHr', 'activities', 'digital', 'gridSchedule',
          'historyDaysUnderBudget', 'history', 'shop', 'soundEnabled',
          'weather', 'lastTriviaDate', 'wateringCount', 'questPhotos'
        ];
        for (const key of SAFE_KEYS) {
          if (Object.prototype.hasOwnProperty.call(parsed, key)) {
            this[key] = parsed[key];
          }
        }
      } catch (_) {
        /* Silently discard corrupted state */
      }
    }
    
    // Initialize default structures if missing
    if (!this.activities) this.activities = {};
    if (!this.digital) this.digital = { stream_res: '1080p' };
    if (!this.gridSchedule) this.gridSchedule = {};
    if (!this.quests) this.quests = [];
    if (!this.shop) this.shop = { owned: ['none'], equipped: 'none' };
    if (this.soundEnabled === undefined) this.soundEnabled = true;
    if (!this.weather) this.weather = 'Sunny';
    if (!this.lastTriviaDate) this.lastTriviaDate = '';
    if (this.wateringCount === undefined) this.wateringCount = 0;
    if (!this.questPhotos) this.questPhotos = {};

    // Initialize default rolling history for charts if missing
    if (!this.history || this.history.length === 0) {
      this.history = [
        { day: 'Mon', spent: 4.20, budget: 5.0 },
        { day: 'Tue', spent: 3.80, budget: 5.0 },
        { day: 'Wed', spent: 5.60, budget: 5.0 },
        { day: 'Thu', spent: 3.10, budget: 5.0 },
        { day: 'Fri', spent: 4.80, budget: 5.0 },
        { day: 'Sat', spent: 2.90, budget: 5.0 },
        { day: 'Sun', spent: 0.00, budget: 5.0 }
      ];
    }

    // Set default baseline activities if completely fresh
    if (Object.keys(this.activities).length === 0) {
      this.activities = {
        suv: 0, sedan: 0, hot_wash: 0, dryer: 0, beef: 0, waste: 0, plastic: 0, vampire: 0,
        cold_w: 0, line_d: 0, bike: 0, veg: 0, unplug: 0, email_d: 0, byo: 0, transit: 0
      };
      this.digital = {
        stream: 0, stream_res: '1080p', social: 0, gaming: 0, videocall: 0, music: 0,
        cloud: 0, browse: 0, ai: 0, email_j: 0, smart_home: 0, crypto: 0, downloads: 0, charging: 0
      };
    }

    this.recalc();
  },

  save() {
    const saveObj = {
      userName: this.userName,
      pledge: this.pledge,
      budget: this.budget,
      spent: this.spent,
      emissionsTotal: this.emissionsTotal,
      offsetsTotal: this.offsetsTotal,
      streak: this.streak,
      coins: this.coins,
      protected: this.protected,
      quests: this.quests,
      gridHr: this.gridHr,
      activities: this.activities,
      digital: this.digital,
      gridSchedule: this.gridSchedule,
      historyDaysUnderBudget: this.historyDaysUnderBudget,
      history: this.history,
      shop: this.shop,
      soundEnabled: this.soundEnabled,
      weather: this.weather,
      lastTriviaDate: this.lastTriviaDate,
      wateringCount: this.wateringCount,
      questPhotos: this.questPhotos
    };
    localStorage.setItem('ts_v3_state', JSON.stringify(saveObj));
  },

  recalc() {
    let emissions = 0;
    let offsets = 0;
    this.ledger = []; // Transient ledger generated dynamically

    // 1. Calculate Core Lifestyle Activities
    for (const [id, qty] of Object.entries(this.activities)) {
      const q = parseFloat(qty) || 0;
      if (q > 0) {
        const conItem = ACTIVITIES.consuming.find(a => a.id === id);
        const repItem = ACTIVITIES.replenishing.find(a => a.id === id);

        if (conItem) {
          const cost = parseFloat((conItem.factor * q).toFixed(3));
          emissions += cost;
          this.ledger.push({
            id,
            type: 'consuming',
            cat: conItem.cat,
            name: `${conItem.name} (${q} ${conItem.unit})`,
            cost
          });
        } else if (repItem) {
          const cost = parseFloat((repItem.factor * q).toFixed(3));
          offsets += cost;
          this.ledger.push({
            id,
            type: 'replenishing',
            cat: repItem.cat,
            name: `${repItem.name} (${q} ${repItem.unit})`,
            cost
          });
        }
      }
    }

    // 2. Calculate Digital Footprint
    let digiEmissions = 0;
    let digiOffsets = 0;
    for (const [id, val] of Object.entries(this.digital)) {
      if (id === 'stream_res') continue;
      const q = parseFloat(val) || 0;
      if (q > 0) {
        const cat = DIGITAL_CATS.find(c => c.id === id);
        if (cat) {
          let cost = 0;
          if (id === 'stream') {
            cost = C.digitalStreaming(q, this.digital.stream_res || '1080p');
          } else {
            const factor = C.digiFactors[id] || 0;
            cost = parseFloat((q * factor).toFixed(3));
          }

          if (cost >= 0) {
            digiEmissions += cost;
          } else {
            digiOffsets += Math.abs(cost);
          }
        }
      }
    }

    if (digiEmissions > 0) {
      this.ledger.push({
        id: 'digital_spent',
        type: 'consuming',
        cat: 'Digital',
        name: `Digital Emissions (Network/Cloud)`,
        cost: parseFloat(digiEmissions.toFixed(3))
      });
      emissions += digiEmissions;
    }
    if (digiOffsets > 0) {
      this.ledger.push({
        id: 'digital_offset',
        type: 'replenishing',
        cat: 'Digital',
        name: `Digital Cleanup (Emails Deleted)`,
        cost: parseFloat(digiOffsets.toFixed(3))
      });
      offsets += digiOffsets;
    }

    // 3. Calculate GreenGrid Scheduler tasks
    for (const [hr, task] of Object.entries(this.gridSchedule)) {
      if (task) {
        const intensity = GRID_PROFILE[hr] || 'moderate';
        const cost = C.gridEnergy(task.kw, task.hours, intensity);
        const ap = hr >= 12 ? 'PM' : 'AM';
        const hr12 = hr == 0 ? 12 : hr > 12 ? hr - 12 : hr;

        emissions += cost;
        this.ledger.push({
          id: `grid_${hr}`,
          type: 'consuming',
          cat: 'Grid',
          name: `${task.name} scheduled at ${hr12} ${ap} (${intensity})`,
          cost
        });
      }
    }

    // 4. Honesty Slip Report
    if (this.protected) {
      const slipCost = 3.20;
      emissions += slipCost;
      this.ledger.push({
        id: 'slip_report',
        type: 'consuming',
        cat: 'Behavior',
        name: 'Honest Slip Report (Streak Preserved)',
        cost: slipCost
      });
    }

    // 5. Watering Offsets
    if (this.wateringCount && this.wateringCount > 0) {
      const waterOffset = parseFloat((this.wateringCount * 0.5).toFixed(3));
      offsets += waterOffset;
      this.ledger.push({
        id: 'watering_offset',
        type: 'replenishing',
        cat: 'Companion',
        name: `Watered Sunflower (${this.wateringCount} times)`,
        cost: waterOffset
      });
    }

    // Dynamic aggregates
    this.emissionsTotal = parseFloat(emissions.toFixed(3));
    this.offsetsTotal = parseFloat(offsets.toFixed(3));
    
    // Net result can go negative if offsets are massive, but we cap display at 0 for spent total
    const net = this.emissionsTotal - this.offsetsTotal;
    this.spent = parseFloat(net.toFixed(3));

    // Sync today's entry in history chart data
    if (this.history && this.history.length > 0) {
      const todayEntry = this.history[this.history.length - 1];
      todayEntry.spent = parseFloat(this.spent.toFixed(2));
      todayEntry.budget = parseFloat(this.budget.toFixed(2));
    }

    // Live update completed quests & streak validations
    this.evalQuestsLive();
  },

  reset() {
    this.activities = {
      suv: 0, sedan: 0, hot_wash: 0, dryer: 0, beef: 0, waste: 0, plastic: 0, vampire: 0,
      cold_w: 0, line_d: 0, bike: 0, veg: 0, unplug: 0, email_d: 0, byo: 0, transit: 0
    };
    this.digital = {
      stream: 0, stream_res: '1080p', social: 0, gaming: 0, videocall: 0, music: 0,
      cloud: 0, browse: 0, ai: 0, email_j: 0, smart_home: 0, crypto: 0, downloads: 0, charging: 0
    };
    this.gridSchedule = {};
    this.protected = false;
    this.wateringCount = 0;
    this.recalc();
    this.save();
  },

  evalQuestsLive() {
    // Daily quests are verified and claimed manually in v6.
  },

  isQuestEligible(id) {
    if (id === 'dq1') {
      return (this.activities.cold_w || 0) >= 1;
    }
    if (id === 'dq2') {
      // Clean Grid Charge (appliance scheduled during green window)
      let scheduledInGreen = false;
      for (const [hr, task] of Object.entries(this.gridSchedule)) {
        if (task && GRID_PROFILE[hr] === 'clean') {
          scheduledInGreen = true;
          break;
        }
      }
      return scheduledInGreen;
    }
    if (id === 'dq3') {
      return (this.digital.stream || 0) > 0 && (this.digital.stream || 0) <= 2;
    }
    if (id === 'dq4') {
      return (this.activities.byo || 0) >= 1;
    }
    if (id === 'dq5') {
      return (this.activities.veg || 0) >= 1;
    }
    if (id === 'dq6') {
      return (this.activities.bike || 0) + (this.activities.transit || 0) >= 1;
    }
    if (id === 'dq7') {
      return (this.activities.unplug || 0) >= 1;
    }
    return false;
  },

  claimQuest(id) {
    if (this.quests.includes(id)) return;

    let pts = 0;
    let q = QUEST_DATA.daily.find(item => item.id === id);
    if (!q) q = QUEST_DATA.weekly.find(item => item.id === id);
    if (!q) q = QUEST_DATA.monthly.find(item => item.id === id);

    if (q) pts = q.pts;

    if (pts > 0) {
      this.quests.push(id);
      this.coins += pts;
      if (id.startsWith('dq')) {
        this.streak += 1;
      }
      this.save();
      
      SoundSynth.play('victory');
      if (typeof PlantCompanion !== 'undefined' && PlantCompanion.say) {
        PlantCompanion.say('questDone');
      }
    }
  },
};

/* ── Carbon Calculation Engines ── */
const C = {
  // Digital category constants
  digiFactors: {
    stream_1080p: 0.05,
    stream_4k: 0.20,
    social: 0.06,
    gaming: 0.12,
    videocall: 0.10,
    music: 0.01,
    cloud: 0.02,
    browse: 0.03,
    ai: 0.02,
    email_j: -0.003,
    smart_home: 0.008,
    crypto: 0.10,
    downloads: 0.04,
    charging: 0.015
  },

  // Grid emissions constants
  gridCoeff: {
    clean: 0.15,      // kg CO2 per kWh
    moderate: 0.45,   // kg CO2 per kWh
    dirty: 0.75       // kg CO2 per kWh
  },

  // Formula expected by tests.js (Test 3)
  digitalStreaming(val, res) {
    const factor = res === '4k' ? this.digiFactors.stream_4k : this.digiFactors.stream_1080p;
    return parseFloat((val * factor).toFixed(3));
  },

  // Formula expected by tests.js (Test 4)
  gridEnergy(powerKw, durationHrs, intensity) {
    const coeff = this.gridCoeff[intensity] || 0.45;
    return parseFloat((powerKw * durationHrs * coeff).toFixed(3));
  }
};

/* ── UI Rendering & Event Controller ── */
const U = {
  el: {},
  $: id => document.getElementById(id),

  cache() {
    const s = this.$;
    this.el = {
      pledgeModal: s('pledge-modal'),
      pledgeName: s('pledge-name'),
      btnPledgeSubmit: s('btn-pledge-submit'),
      userDisplay: s('user-display'),

      ringWrap: s('ring-wrap'),
      ringFill: s('ring-fill'),
      ringVal: s('ring-val'),
      
      streak: s('s-streak'),
      coins: s('s-coins'),
      avatarWrap: s('avatar-wrap'),
      btnSlip: s('btn-slip'),

      valEmissions: s('val-emissions'),
      valOffsets: s('val-offsets'),
      valNet: s('val-net'),
      netDesc: s('net-desc'),
      
      ledger: s('ledger'),
      btnClearLedger: s('btn-clear-ledger'),

      conList: s('con-list'),
      repList: s('rep-list'),

      digiTotal: s('digi-total'),
      digiGrid: s('digi-grid'),
      digiAdv: s('digi-adv'),

      gridTL: s('grid-tl'),
      gridInfo: s('grid-info'),
      gridAdv: s('grid-adv'),
      gridAdvIcon: s('grid-adv-icon'),
      schedHour: s('sched-hour'),
      schedAppliance: s('sched-appliance'),
      schedHours: s('sched-hours'),
      btnScheduleAdd: s('btn-schedule-add'),
      gridTasks: s('grid-tasks'),

      dailyQuests: s('daily-quests'),
      weeklyGoals: s('weekly-goals'),
      monthlyGoals: s('monthly-goals'),

      btnCloudSync: s('btn-cloud-sync'),
      syncDot: s('sync-dot'),
      syncText: s('sync-text'),
      btnHealthSync: s('btn-health-sync'),
      healthSyncDetails: s('health-sync-details'),
      healthOauthModal: s('health-oauth-modal'),
      btnOauthAllow: s('btn-oauth-allow'),
      btnOauthDeny: s('btn-oauth-deny'),
      analyticsAvgSpent: s('analytics-avg-spent'),
      analyticsBestDay: s('analytics-best-day'),
      analyticsCompliance: s('analytics-compliance'),

      tabs: document.querySelectorAll('.sidebar-tabs .tab-btn'),
      panels: document.querySelectorAll('.content-pane .panel')
    };
  },

  render() {
    // 1. Honesty Pledge Overlay
    if (!S.pledge) {
      this.el.pledgeModal?.classList.remove('hidden');
    } else {
      this.el.pledgeModal?.classList.add('hidden');
      if (this.el.userDisplay) this.el.userDisplay.textContent = S.userName;
    }

    // 2. Budget Ring & Avatar Sync
    const rem = parseFloat((S.budget - S.spent).toFixed(2));
    if (this.el.ringVal) this.el.ringVal.textContent = rem.toFixed(1);
    
    const fill = this.el.ringFill;
    if (fill) {
      const pct = Math.max(0, Math.min(1, rem / S.budget));
      const circ = 2 * Math.PI * 70; // r=70
      fill.setAttribute('stroke-dasharray', circ);
      fill.setAttribute('stroke-dashoffset', circ * (1 - pct));
    }

    const wrap = this.el.ringWrap;
    if (wrap) {
      if (rem < 0) wrap.classList.add('warn');
      else wrap.classList.remove('warn');
    }

    // Grow seedling stages based on streak count
    const av = this.el.avatarWrap;
    if (av) {
      // Remove only transient stage & state classes
      av.classList.remove('stage-1', 'stage-2', 'stage-3', 'wilt', 'glow');
      
      if (S.streak >= 6) av.classList.add('stage-3');
      else if (S.streak >= 3) av.classList.add('stage-2');
      else av.classList.add('stage-1');

      // Animating state or wilting state
      if (rem < 0) {
        av.classList.add('wilt');
      } else {
        av.classList.add('glow');
      }
    }

    // 3. Stats display
    if (this.el.streak) this.el.streak.textContent = `${S.streak} days ${S.protected ? '⚠️' : ''}`;
    if (this.el.coins) this.el.coins.textContent = S.coins;
    if (this.el.btnSlip) {
      this.el.btnSlip.classList.toggle('active', S.protected);
      this.el.btnSlip.textContent = S.protected ? 'Streak Protected ✓' : '⚠️ I Slipped Today';
    }

    // 4. Ledger Summaries & List
    if (this.el.valEmissions) this.el.valEmissions.textContent = `+${S.emissionsTotal.toFixed(2)} kg`;
    if (this.el.valOffsets) this.el.valOffsets.textContent = `−${S.offsetsTotal.toFixed(2)} kg`;
    if (this.el.valNet) {
      this.el.valNet.textContent = `${S.spent.toFixed(2)} kg`;
      this.el.valNet.className = `card-large ${S.spent > S.budget ? 'tr' : 'tg'}`;
    }
    if (this.el.netDesc) {
      if (rem >= 0) {
        this.el.netDesc.textContent = `Remaining allowance: ${rem.toFixed(2)} kg CO₂`;
        this.el.netDesc.className = 'sub tg';
      } else {
        this.el.netDesc.textContent = `Allowance exceeded by ${Math.abs(rem).toFixed(2)} kg CO₂`;
        this.el.netDesc.className = 'sub tr';
      }
    }

    this.renderLedgerList();

    // 5. Eco Counter Cards
    this.renderActivityCounters();

    // 6. Digital Footprint Sliders
    this.renderDigitalGrid();

    // 7. GreenGrid advisor & schedule
    this.renderGreenGridTimeline();
    this.renderScheduledTasksList();

    // 8. Quests progress
    this.renderQuestsBlock();

    // 9. Update talking plant mood
    if (typeof PlantCompanion !== 'undefined' && PlantCompanion.updateMood) {
      PlantCompanion.updateMood();
    }
  },

  renderLedgerList() {
    const container = this.el.ledger;
    if (!container) return;

    if (S.ledger.length === 0) {
      container.innerHTML = '<div class="ledger-empty">No transactions logged today. Go to \'Eco Activities\' or \'Digital Tracker\' to add items!</div>';
      return;
    }

    container.innerHTML = '';
    S.ledger.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = `ledger-row ${item.type}`;
      row.innerHTML = `
        <div class="led-info">
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(item.cat)} · ${item.type === 'consuming' ? 'Emissions spent' : 'Offset credited'}</p>
        </div>
        <div class="led-actions">
          <span class="led-cost ${item.type}">${item.type === 'consuming' ? '+' : '−'}${item.cost.toFixed(2)} kg</span>
          <button class="btn-remove-led" aria-label="Remove item" data-id="${item.id}" data-type="${item.type}">✕</button>
        </div>
      `;

      // Wire removal action
      row.querySelector('.btn-remove-led').addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const type = e.target.dataset.type;

        if (id === 'slip_report') {
          S.protected = false;
        } else if (id === 'watering_offset') {
          S.wateringCount = 0;
        } else if (id === 'digital_spent' || id === 'digital_offset') {
          // Reset all digital counts to 0
          for (const key of Object.keys(S.digital)) {
            if (key !== 'stream_res') S.digital[key] = 0;
          }
        } else if (id.startsWith('grid_')) {
          const hr = id.split('_')[1];
          delete S.gridSchedule[hr];
        } else {
          S.activities[id] = 0;
        }
        
        S.recalc();
        S.save();
        this.render();
      });

      container.appendChild(row);
    });
  },

  renderActivityCounters() {
    const renderList = (activities, listEl, type) => {
      if (!listEl) return;
      listEl.innerHTML = '';

      activities.forEach(a => {
        const val = S.activities[a.id] || 0;
        const card = document.createElement('div');
        card.className = `counter-card ${type === 'replenishing' ? 'rep' : 'con'}`;
        card.innerHTML = `
          <div class="cc-info">
            <span class="cc-icon" aria-hidden="true">${a.icon}</span>
            <div>
              <h3>${a.name}</h3>
              <p class="sub">${a.factor.toFixed(3)} kg / ${a.unit}</p>
            </div>
          </div>
          <div class="cc-controls">
            <button class="btn-counter btn-minus" data-id="${a.id}">−</button>
            <span class="cc-val" id="val-act-${a.id}">${val}</span>
            <button class="btn-counter btn-plus" data-id="${a.id}">+</button>
          </div>
        `;

        // Minus click
        card.querySelector('.btn-minus').addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          const current = parseFloat(S.activities[id]) || 0;
          if (current > 0) {
            S.activities[id] = parseFloat((current - 1).toFixed(1));
            S.recalc();
            S.save();
            this.render();
          }
        });

        // Plus click
        card.querySelector('.btn-plus').addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          const current = parseFloat(S.activities[id]) || 0;
          S.activities[id] = parseFloat((current + 1).toFixed(1));
          S.recalc();
          S.save();
          this.render();

          if (id === 'cold_w' && !S.quests.includes('dq1')) {
            U.handleQuestVerification('dq1', 'photo');
          } else if (id === 'byo' && !S.quests.includes('dq4')) {
            U.handleQuestVerification('dq4', 'photo');
          } else if (id === 'unplug' && !S.quests.includes('dq7')) {
            U.handleQuestVerification('dq7', 'photo');
          }
        });

        listEl.appendChild(card);
      });
    };

    renderList(ACTIVITIES.consuming, this.el.conList, 'consuming');
    renderList(ACTIVITIES.replenishing, this.el.repList, 'replenishing');
  },

  renderDigitalGrid() {
    const container = this.el.digiGrid;
    if (!container) return;
    container.innerHTML = '';

    let total = 0;

    DIGITAL_CATS.forEach(cat => {
      const val = S.digital[cat.id] || 0;
      let cost = 0;
      if (cat.id === 'stream') {
        cost = C.digitalStreaming(val, S.digital.stream_res || '1080p');
      } else {
        const factor = C.digiFactors[cat.id] || 0;
        cost = parseFloat((val * factor).toFixed(3));
      }
      total += cost;

      const card = document.createElement('div');
      card.className = `metric-card ${cost < 0 ? 'rep' : ''}`;
      
      let resSelectorHtml = '';
      if (cat.id === 'stream') {
        resSelectorHtml = `
          <select class="fs stream-res-select" style="margin:6px 0; font-size:0.75rem; padding:4px;">
            <option value="1080p" ${S.digital.stream_res === '1080p' ? 'selected' : ''}>1080p</option>
            <option value="4k" ${S.digital.stream_res === '4k' ? 'selected' : ''}>4K UHD</option>
          </select>
        `;
      }

      card.innerHTML = `
        <div class="mc-icon">${cat.icon}</div>
        <div class="mc-val">${val}</div>
        <div class="mc-label">${cat.label} (${cat.unit})</div>
        ${resSelectorHtml}
        <div class="cc-controls" style="margin-top:8px;">
          <button class="btn-counter btn-minus-digi" data-id="${cat.id}">−</button>
          <button class="btn-counter btn-plus-digi" data-id="${cat.id}">+</button>
        </div>
        <div class="sub mt" style="font-weight:700; color: ${cost >= 0 ? 'var(--rose)' : 'var(--green)'}">
          ${cost >= 0 ? '+' : ''}${cost.toFixed(3)} kg CO₂
        </div>
      `;

      // Stream resolution change binding
      if (cat.id === 'stream') {
        card.querySelector('.stream-res-select').addEventListener('change', (e) => {
          S.digital.stream_res = e.target.value;
          S.recalc();
          S.save();
          this.render();
        });
      }

      // Bind increment/decrement
      card.querySelector('.btn-minus-digi').addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const current = parseFloat(S.digital[id]) || 0;
        const step = id === 'email_j' ? 25 : 0.5;
        if (current > 0) {
          S.digital[id] = parseFloat((current - step).toFixed(2));
          S.recalc();
          S.save();
          this.render();
        }
      });

      card.querySelector('.btn-plus-digi').addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const current = parseFloat(S.digital[id]) || 0;
        const step = id === 'email_j' ? 25 : 0.5;
        S.digital[id] = parseFloat((current + step).toFixed(2));
        S.recalc();
        S.save();
        this.render();
      });

      container.appendChild(card);
    });

    if (this.el.digiTotal) {
      this.el.digiTotal.textContent = `${total >= 0 ? '+' : ''}${total.toFixed(2)} kg CO₂`;
      this.el.digiTotal.className = `metric-total ${total >= 0 ? 'tr' : 'tg'}`;
    }

    this.updateDigitalAdvisories(total);
  },

  updateDigitalAdvisories(total) {
    const adv = this.el.digiAdv;
    if (!adv) return;

    const streamHrs = S.digital.stream || 0;
    const streamRes = S.digital.stream_res || '1080p';
    const aiQueries = S.digital.ai || 0;

    let icon = '🌍';
    let title = 'Digital Footprint Awareness';
    let desc = 'Every byte stored, streamed, or processed uses clean grid energy somewhere. Minimize idle tabs and charge smart.';
    adv.className = 'adv';

    if (streamRes === '4k' && streamHrs > 1.5) {
      icon = '💡';
      title = 'Switch to 1080p to Save emissions!';
      const savings = ((0.20 - 0.05) * streamHrs).toFixed(2);
      desc = `Downgrading streaming resolution to 1080p yields identical quality on laptops/mobiles but saves ${savings} kg CO₂ server load.`;
      adv.className = 'adv warn';
    } else if (aiQueries > 15) {
      icon = '🤖';
      title = 'High AI Generation volume';
      desc = 'AI model prompts require 10x more power than simple Google searches. Batch queries or check local databases.';
      adv.className = 'adv warn';
    } else if (total > 0.60) {
      icon = '🔋';
      title = 'Server Carbon Load is Accumulating';
      desc = 'Consider closing unused cloud storage folders, deleting emails, or setting offline audio downloads.';
      adv.className = 'adv warn';
    }

    adv.innerHTML = `
      <span class="adv-i">${icon}</span>
      <div>
        <strong>${title}</strong>
        <p style="margin-top:2px;">${desc}</p>
      </div>
    `;
  },

  renderGreenGridTimeline() {
    const timeline = this.el.gridTL;
    if (!timeline) return;
    timeline.innerHTML = '';

    GRID_PROFILE.forEach((intensity, hour) => {
      const cell = document.createElement('div');
      cell.className = `t-cell ${intensity}`;
      if (hour === S.gridHr) {
        cell.classList.add('sel');
      }

      // Check if task scheduled at this hour
      if (S.gridSchedule[hour]) {
        const bookedTag = document.createElement('span');
        bookedTag.className = 'grid-booked-dot';
        bookedTag.textContent = '⚙️';
        cell.appendChild(bookedTag);
      }

      const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const ap = hour >= 12 ? 'PM' : 'AM';

      // Tooltip
      const tip = document.createElement('span');
      tip.className = 't-tip';
      tip.textContent = `${h12} ${ap} · ${intensity.toUpperCase()}`;
      cell.appendChild(tip);

      cell.tabIndex = 0;
      cell.setAttribute('role', 'option');
      cell.setAttribute('aria-selected', hour === S.gridHr ? 'true' : 'false');
      cell.setAttribute('aria-label', `${h12} ${ap}, Intensity ${intensity}`);

      const selectHour = () => {
        S.gridHr = hour;
        S.save();
        this.render();
      };

      cell.addEventListener('click', selectHour);
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectHour();
        }
      });

      timeline.appendChild(cell);
    });

    // Detailed advice based on selection
    const activeHr = S.gridHr;
    const activeIntensity = GRID_PROFILE[activeHr];
    const h12 = activeHr === 0 ? 12 : activeHr > 12 ? activeHr - 12 : activeHr;
    const ap = activeHr >= 12 ? 'PM' : 'AM';

    const info = this.el.gridInfo;
    const advice = this.el.gridAdv;
    const icon = this.el.gridAdvIcon;

    if (info) info.textContent = `${h12} ${ap} — ${activeIntensity.toUpperCase()} WINDOW`;

    if (advice && icon) {
      if (activeIntensity === 'clean') {
        icon.textContent = '🟢';
        advice.textContent = 'Energy demand is low and solar/wind generation is peaking. Plug in vehicles and run wash cycles now.';
      } else if (activeIntensity === 'dirty') {
        icon.textContent = '🔴';
        advice.textContent = 'Peak grids rely on gas/coal turbine plants. Delay laundry cycles or dishwasher loads to cleaner windows.';
      } else {
        icon.textContent = '🟡';
        advice.textContent = 'Grid intensity is moderate. Average carbon load. Prefer green hours if possible.';
      }
    }
  },

  renderScheduledTasksList() {
    const list = this.el.gridTasks;
    if (!list) return;

    const scheduleKeys = Object.keys(S.gridSchedule);
    if (scheduleKeys.length === 0) {
      list.innerHTML = '<div class="empty-state">No grid tasks scheduled for today.</div>';
      return;
    }

    list.innerHTML = '';
    scheduleKeys.forEach(hr => {
      const task = S.gridSchedule[hr];
      if (!task) return;

      const intensity = GRID_PROFILE[hr] || 'moderate';
      const cost = C.gridEnergy(task.kw, task.hours, intensity);
      const h12 = hr == 0 ? 12 : hr > 12 ? hr - 12 : hr;
      const ap = hr >= 12 ? 'PM' : 'AM';

      const item = document.createElement('div');
      item.className = `grid-task-row ${intensity}`;
      item.innerHTML = `
        <div class="gt-meta">
          <strong>${escapeHtml(task.name)}</strong>
          <span class="sub">${h12} ${ap} (${intensity} grid) · ${task.hours} hr</span>
        </div>
        <div class="gt-actions">
          <span class="gt-cost">+${cost.toFixed(2)} kg</span>
          <button class="btn-grid-remove" data-hour="${hr}">✕</button>
        </div>
      `;

      item.querySelector('.btn-grid-remove').addEventListener('click', (e) => {
        const targetHour = e.target.dataset.hour;
        delete S.gridSchedule[targetHour];
        S.recalc();
        S.save();
        this.render();
      });

      list.appendChild(item);
    });
  },

  renderQuestsBlock() {
    // 1. Daily Quests
    const dailyContainer = this.el.dailyQuests;
    if (dailyContainer) {
      dailyContainer.innerHTML = '';
      QUEST_DATA.daily.forEach(q => {
        const isDone = S.quests.includes(q.id);
        const isEligible = S.isQuestEligible(q.id);
        const card = document.createElement('div');
        card.className = `quest-card ${isDone ? 'done' : ''} ${isEligible && !isDone ? 'eligible' : ''}`;
        
        let actionHtml = '';
        if (isDone) {
          actionHtml = `<span class="q-status-badge" style="color: var(--green); font-weight: 600;">✓ Done</span>`;
          if (S.questPhotos && S.questPhotos[q.id]) {
            actionHtml += `<button class="btn btn-xs view-proof-btn" data-id="${q.id}" style="margin-top: 6px; font-size: 0.68rem; padding: 3px 6px;">🔍 View Proof</button>`;
          }
        } else if (isEligible) {
          if (q.lvl === 'Photo Proof') {
            actionHtml = `<button class="verify-btn" data-id="${q.id}" data-type="photo">📷 Verify Photo</button>`;
          } else if (q.lvl === 'API Verified') {
            actionHtml = `<button class="verify-btn" data-id="${q.id}" data-type="api">⚡ Verify API</button>`;
          } else {
            actionHtml = `<button class="verify-btn" data-id="${q.id}" data-type="self">✓ Claim</button>`;
          }
        } else {
          actionHtml = `<span class="q-status-badge pending" style="color: var(--text-muted);">Pending</span>`;
          let hint = '';
          if (q.id === 'dq1') hint = 'Log cold wash swap in Eco Activities';
          else if (q.id === 'dq2') hint = 'Schedule grid appliance run';
          else if (q.id === 'dq3') hint = 'Keep video stream >0 and <=2 hrs';
          else if (q.id === 'dq4') hint = 'Log reusable container in Eco Activities';
          else if (q.id === 'dq5') hint = 'Log plant-based meal in Eco Activities';
          else if (q.id === 'dq6') hint = 'Log walk/bike/transit in Eco Activities';
          else if (q.id === 'dq7') hint = 'Log unplug sweep in Eco Activities';
          actionHtml += `<span class="q-hint" style="font-size: 0.65rem; color: var(--text-muted); display: block; margin-top: 4px; text-align: right; max-width: 140px; line-height: 1.25;">${hint}</span>`;
        }

        card.innerHTML = `
          <div class="q-content">
            <div class="q-title-row">
              <h3>${q.name}</h3>
              <span class="q-badge">${q.lvl}</span>
            </div>
            <p class="sub">${q.desc}</p>
          </div>
          <div class="q-reward" style="display: flex; flex-direction: column; align-items: flex-end; justify-content: center; gap: 4px; min-width: 100px;">
            <span class="q-points">+${q.pts} 🪙</span>
            ${actionHtml}
          </div>
        `;
        dailyContainer.appendChild(card);
      });

      // Wire verify button clicks
      dailyContainer.querySelectorAll('.verify-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.dataset.id;
          const type = btn.dataset.type;
          this.handleQuestVerification(id, type, btn);
        });
      });

      // Wire view proof clicks
      dailyContainer.querySelectorAll('.view-proof-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.dataset.id;
          this.showPhotoProofLightbox(id);
        });
      });
    }

    // 2. Weekly Goals
    const weeklyContainer = this.el.weeklyGoals;
    if (weeklyContainer) {
      weeklyContainer.innerHTML = '';
      QUEST_DATA.weekly.forEach(g => {
        let progress = 0;
        let isDone = false;

        // Calculate progress dynamically
        if (g.id === 'wg1') {
          progress = (S.activities.bike || 0) + (S.activities.transit || 0);
        } else if (g.id === 'wg2') {
          progress = S.digital.social || 0;
        } else if (g.id === 'wg3') {
          progress = S.activities.line_d || 0;
        } else if (g.id === 'wg4') {
          progress = S.activities.veg || 0;
        }

        // Evaluate done status
        if (g.id === 'wg2') {
          // Under-limit target
          isDone = progress > 0 && progress <= g.target;
        } else {
          isDone = progress >= g.target;
        }

        if (isDone && !S.quests.includes(g.id)) {
          S.quests.push(g.id);
          S.coins += g.pts;
          S.save();
          SoundSynth.play('victory');
          if (typeof PlantCompanion !== 'undefined' && PlantCompanion.sayText) {
            PlantCompanion.sayText(`Congratulations! You completed the weekly goal: "${g.name}" and earned 🪙 ${g.pts} Green Coins! 🏆🌻`);
          }
          if (U.el.coins) U.el.coins.textContent = S.coins;
          const shopCoins = document.getElementById('shop-coins-val');
          if (shopCoins) shopCoins.textContent = S.coins;
        }

        const pct = Math.min(100, (progress / g.target) * 100);
        const card = document.createElement('div');
        card.className = `quest-card ${isDone ? 'done' : ''}`;
        
        let barClass = '';
        if (g.id === 'wg2' && progress > g.target) {
          barClass = 'over-limit'; // Red bar for exceeding limit
        }

        card.innerHTML = `
          <div class="q-content" style="width: 100%;">
            <div class="q-title-row">
              <h3>${g.name}</h3>
              <span class="q-points">+${g.pts} 🪙</span>
            </div>
            <p class="sub">${g.desc}</p>
            <div class="prog-wrap">
              <div class="prog-fill ${barClass}" style="width: ${pct}%"></div>
            </div>
            <span class="sub text-right" style="display:block; margin-top:4px;">
              ${progress.toFixed(1)} / ${g.target} ${g.unit} (${pct.toFixed(0)}%)
            </span>
          </div>
        `;
        weeklyContainer.appendChild(card);
      });
    }

    // 3. Monthly Goals
    const monthlyContainer = this.el.monthlyGoals;
    if (monthlyContainer) {
      monthlyContainer.innerHTML = '';
      QUEST_DATA.monthly.forEach(m => {
        let progress = 0;
        if (m.id === 'mg1') {
          // Carbon Defender check: if today spent is under 3.5 kg, log it.
          // In real application this increments daily. Here we check historyDaysUnderBudget + current day check.
          const currentDayCheck = S.spent <= 3.5 && S.spent > 0 ? 1 : 0;
          progress = S.historyDaysUnderBudget + currentDayCheck;
        } else if (m.id === 'mg2') {
          progress = (S.activities.email_d || 0) + (S.digital.email_j || 0);
        }

        const isDone = progress >= m.target;
        if (isDone && !S.quests.includes(m.id)) {
          S.quests.push(m.id);
          S.coins += m.pts;
          S.save();
          SoundSynth.play('victory');
          if (typeof PlantCompanion !== 'undefined' && PlantCompanion.sayText) {
            PlantCompanion.sayText(`Amazing! You achieved the monthly milestone: "${m.name}" and earned 🪙 ${m.pts} Green Coins! 🏆🌟`);
          }
          if (U.el.coins) U.el.coins.textContent = S.coins;
          const shopCoins = document.getElementById('shop-coins-val');
          if (shopCoins) shopCoins.textContent = S.coins;
        }

        const pct = Math.min(100, (progress / m.target) * 100);
        const card = document.createElement('div');
        card.className = `quest-card ${isDone ? 'done' : ''}`;
        card.innerHTML = `
          <div class="q-content" style="width: 100%;">
            <div class="q-title-row">
              <h3>${m.name}</h3>
              <span class="q-points">+${m.pts} 🪙</span>
            </div>
            <p class="sub">${m.desc}</p>
            <div class="prog-wrap">
              <div class="prog-fill" style="width: ${pct}%"></div>
            </div>
            <span class="sub text-right" style="display:block; margin-top:4px;">
              ${progress} / ${m.target} ${m.unit} (${pct.toFixed(0)}%)
            </span>
          </div>
        `;
        monthlyContainer.appendChild(card);
      });
    }
  },

  handleQuestVerification(id, type, btn) {
    if (type === 'self') {
      S.claimQuest(id);
      this.render();
    } else if (type === 'api') {
      btn.disabled = true;
      btn.textContent = 'Verifying API...';
      SoundSynth.play('click');
      setTimeout(() => {
        S.claimQuest(id);
        this.render();
      }, 1500);
    } else if (type === 'photo') {
      const uploadModal = document.getElementById('upload-modal');
      const fileInput = document.getElementById('quest-file-input');
      const submitBtn = document.getElementById('btn-submit-proof');
      const previewContainer = document.getElementById('upload-preview-container');
      const previewImg = document.getElementById('upload-preview-img');
      const dropZone = document.getElementById('drop-zone');
      
      if (!uploadModal || !fileInput || !submitBtn) return;
      
      uploadModal.dataset.questId = id;
      fileInput.value = '';
      submitBtn.disabled = true;
      if (previewContainer) previewContainer.classList.add('hidden');
      if (previewImg) previewImg.src = '';
      if (dropZone) dropZone.classList.remove('hidden');

      // Reset tabs and stop previous stream
      stopCamera();
      const tabUploadFile = document.getElementById('tab-upload-file');
      const tabTakePhoto = document.getElementById('tab-take-photo');
      const fileUploadZone = document.getElementById('file-upload-zone');
      const cameraCaptureZone = document.getElementById('camera-capture-zone');
      
      if (tabUploadFile) {
        tabUploadFile.classList.add('active');
        tabUploadFile.style.background = 'var(--green)';
        tabUploadFile.style.color = '#000';
        tabUploadFile.style.borderColor = 'transparent';
      }
      if (tabTakePhoto) {
        tabTakePhoto.classList.remove('active');
        tabTakePhoto.style.background = 'rgba(255,255,255,0.02)';
        tabTakePhoto.style.color = 'var(--text-muted)';
        tabTakePhoto.style.borderColor = 'rgba(255,255,255,0.06)';
      }
      if (fileUploadZone) fileUploadZone.classList.remove('hidden');
      if (cameraCaptureZone) cameraCaptureZone.classList.add('hidden');
      
      uploadModal.classList.remove('hidden');
      SoundSynth.play('pop');
      fileInput.click();
    }
  },

  showPhotoProofLightbox(id) {
    const photoModal = document.getElementById('photo-modal');
    const previewImg = document.getElementById('photo-preview-img');
    const desc = document.getElementById('photo-modal-desc');
    const q = QUEST_DATA.daily.find(item => item.id === id);
    
    if (!photoModal || !previewImg) return;
    
    previewImg.src = S.questPhotos[id] || '';
    if (desc && q) {
      desc.textContent = `Uploaded proof for "${q.name}" daily quest.`;
    }
    
    photoModal.classList.remove('hidden');
    SoundSynth.play('pop');
  }
};

/* ── DOM Event Listeners ── */
function wire() {
  // 1. Tab switches
  U.el.tabs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabId = btn.dataset.tab;
      
      U.el.tabs.forEach(t => t.classList.remove('active'));
      U.el.panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = U.$(tabId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      if (tabId === 'p-analytics') {
        ChartAnalyticsManager.renderChart();
      }
    });
  });

  // 2. Pledge Submit Signature
  U.el.btnPledgeSubmit?.addEventListener('click', () => {
    const name = U.el.pledgeName?.value.trim();
    if (!name) {
      alert("Please enter your name to sign the commitment pledge.");
      return;
    }
    S.userName = name;
    S.pledge = true;
    S.save();
    U.render();
  });

  // 3. Reset Ledger / Clean all inputs
  U.el.btnClearLedger?.addEventListener('click', () => {
    if (confirm("Reset today's activity journal and footprint sliders?")) {
      S.reset();
      U.render();
    }
  });

  // 4. Streak Protection (Oops I Slipped)
  U.el.btnSlip?.addEventListener('click', () => {
    S.protected = !S.protected;
    if (S.protected) {
      alert("Streak protection activated! Admitting slips honestly earns integrity points. 🌱");
    }
    S.recalc();
    S.save();
    U.render();
  });

  // 5. Appliance Scheduler Hour dropdown loading
  const hourDropdown = U.el.schedHour;
  if (hourDropdown) {
    hourDropdown.innerHTML = '';
    for (let hr = 0; hr < 24; hr++) {
      const opt = document.createElement('option');
      opt.value = hr;
      const h12 = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
      const ap = hr >= 12 ? 'PM' : 'AM';
      opt.textContent = `${h12} ${ap} (${GRID_PROFILE[hr].toUpperCase()})`;
      hourDropdown.appendChild(opt);
    }
  }

  // 6. Schedule Task Add button
  U.el.btnScheduleAdd?.addEventListener('click', () => {
    const hour = parseInt(U.el.schedHour.value) || 0;
    const selectEl = U.el.schedAppliance;
    const option = selectEl.options[selectEl.selectedIndex];
    const name = option.text;
    const kw = parseFloat(option.dataset.kw) || 1.0;
    const duration = parseFloat(U.el.schedHours.value) || 1.0;

    if (duration <= 0) {
      alert("Please enter a valid run duration.");
      return;
    }

    // Schedule task at hour
    S.gridSchedule[hour] = {
      name,
      kw,
      hours: duration
    };

    S.recalc();
    S.save();
    U.render();
  });

  // 7. v4 Cloud Sync Click
  U.el.btnCloudSync?.addEventListener('click', () => {
    SoundSynth.play('click');
    CloudSyncManager.performSync();
  });

  // 8. v4 Google Health Sync Clicks
  U.el.btnHealthSync?.addEventListener('click', () => {
    SoundSynth.play('click');
    GoogleHealthManager.openConsentModal();
  });
  U.el.btnOauthAllow?.addEventListener('click', () => {
    SoundSynth.play('victory');
    GoogleHealthManager.approveSync();
  });
  U.el.btnOauthDeny?.addEventListener('click', () => {
    SoundSynth.play('click');
    GoogleHealthManager.denySync();
  });

  // 9. Sound Toggle Click
  const soundBtn = document.getElementById('sound-toggle');
  if (soundBtn) {
    soundBtn.textContent = S.soundEnabled ? '🔊' : '🔇';
    soundBtn.style.color = S.soundEnabled ? 'var(--green)' : 'var(--text-muted)';
    soundBtn.addEventListener('click', () => {
      S.soundEnabled = !S.soundEnabled;
      soundBtn.textContent = S.soundEnabled ? '🔊' : '🔇';
      soundBtn.style.color = S.soundEnabled ? 'var(--green)' : 'var(--text-muted)';
      S.save();
      SoundSynth.play('click');
      if (S.soundEnabled) {
        SoundSynth.startLofi();
      } else {
        SoundSynth.stopLofi();
      }
    });
  }

  // 10. Shop Boutique Modal wires
  ShopManager.init();

  // 11. Water button wires
  WateringManager.init();

  // 11b. Trivia Quizzes Engine init
  TriviaEngine.init();

  // 12. Trivia button click - switch to Eco Quizzes tab
  const triviaBtn = document.getElementById('trivia-btn');
  if (triviaBtn) {
    triviaBtn.addEventListener('click', () => {
      const quizTabBtn = document.querySelector('.tab-btn[data-tab="p-quizzes"]');
      if (quizTabBtn) {
        quizTabBtn.click();
      }
      SoundSynth.play('pop');
    });
  }

  // 13. Photo Upload & Lightbox Modals Wires
  const uploadCloseBtn = document.getElementById('btn-upload-close');
  const uploadModal = document.getElementById('upload-modal');
  if (uploadCloseBtn && uploadModal) {
    uploadCloseBtn.addEventListener('click', () => {
      uploadModal.classList.add('hidden');
      SoundSynth.play('click');
      stopCamera();
    });
  }

  const photoCloseBtn = document.getElementById('btn-photo-close');
  const photoModal = document.getElementById('photo-modal');
  if (photoCloseBtn && photoModal) {
    photoCloseBtn.addEventListener('click', () => {
      photoModal.classList.add('hidden');
      SoundSynth.play('click');
    });
  }

  const fileInput = document.getElementById('quest-file-input');
  const dropZone = document.getElementById('drop-zone');
  const previewContainer = document.getElementById('upload-preview-container');
  const previewImg = document.getElementById('upload-preview-img');
  const submitBtn = document.getElementById('btn-submit-proof');
  const removePhotoBtn = document.getElementById('btn-remove-selected-photo');

  // Camera capture variables and logic inside wire()
  const tabUploadFile = document.getElementById('tab-upload-file');
  const tabTakePhoto = document.getElementById('tab-take-photo');
  const fileUploadZone = document.getElementById('file-upload-zone');
  const cameraCaptureZone = document.getElementById('camera-capture-zone');
  const cameraStream = document.getElementById('camera-stream');
  const cameraLoading = document.getElementById('camera-loading');
  const btnCapturePhoto = document.getElementById('btn-capture-photo');

  function startCamera() {
    if (cameraLoading) cameraLoading.textContent = 'Initializing Camera...';
    if (cameraLoading) cameraLoading.classList.remove('hidden');
    if (cameraStream) cameraStream.classList.add('hidden');

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (cameraStream) {
          cameraStream.srcObject = stream;
          cameraStream.classList.remove('hidden');
        }
        if (cameraLoading) cameraLoading.classList.add('hidden');
        activeCameraStream = stream;
      })
      .catch(err => {
        console.error("Camera error:", err);
        if (cameraLoading) cameraLoading.textContent = 'Camera unavailable or permission denied.';
      });
  }

  if (tabUploadFile && tabTakePhoto && fileUploadZone && cameraCaptureZone) {
    tabUploadFile.style.background = 'var(--green)';
    tabUploadFile.style.color = '#000';
    tabUploadFile.style.borderColor = 'transparent';

    tabUploadFile.addEventListener('click', () => {
      tabUploadFile.classList.add('active');
      tabUploadFile.style.background = 'var(--green)';
      tabUploadFile.style.color = '#000';
      tabUploadFile.style.borderColor = 'transparent';

      tabTakePhoto.classList.remove('active');
      tabTakePhoto.style.background = 'rgba(255,255,255,0.02)';
      tabTakePhoto.style.color = 'var(--text-muted)';
      tabTakePhoto.style.borderColor = 'rgba(255,255,255,0.06)';

      fileUploadZone.classList.remove('hidden');
      cameraCaptureZone.classList.add('hidden');
      stopCamera();
    });

    tabTakePhoto.addEventListener('click', () => {
      tabTakePhoto.classList.add('active');
      tabTakePhoto.style.background = 'var(--green)';
      tabTakePhoto.style.color = '#000';
      tabTakePhoto.style.borderColor = 'transparent';

      tabUploadFile.classList.remove('active');
      tabUploadFile.style.background = 'rgba(255,255,255,0.02)';
      tabUploadFile.style.color = 'var(--text-muted)';
      tabUploadFile.style.borderColor = 'rgba(255,255,255,0.06)';

      fileUploadZone.classList.add('hidden');
      cameraCaptureZone.classList.remove('hidden');
      if (previewContainer && previewContainer.classList.contains('hidden')) {
        startCamera();
      }
    });
  }

  if (btnCapturePhoto && cameraStream && previewImg && previewContainer) {
    btnCapturePhoto.addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      canvas.width = cameraStream.videoWidth || 640;
      canvas.height = cameraStream.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(cameraStream, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');

      stopCamera();
      previewImg.src = dataUrl;
      previewContainer.classList.remove('hidden');
      cameraCaptureZone.classList.add('hidden');
      if (submitBtn) submitBtn.disabled = false;
      SoundSynth.play('pop');
    });
  }

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => {
      fileInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--green)';
      dropZone.style.backgroundColor = 'rgba(0, 240, 160, 0.05)';
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      dropZone.style.backgroundColor = 'rgba(0,0,0,0.1)';
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      dropZone.style.backgroundColor = 'rgba(0,0,0,0.1)';
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleSelectedFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        handleSelectedFile(fileInput.files[0]);
      }
    });
  }

  function handleSelectedFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (previewImg && previewContainer && submitBtn && dropZone) {
        previewImg.src = e.target.result;
        previewContainer.classList.remove('hidden');
        dropZone.classList.add('hidden');
        submitBtn.disabled = false;
        SoundSynth.play('pop');
      }
    };
    reader.readAsDataURL(file);
  }

  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (fileInput) fileInput.value = '';
      if (previewContainer) previewContainer.classList.add('hidden');
      
      if (tabTakePhoto && tabTakePhoto.classList.contains('active')) {
        if (cameraCaptureZone) cameraCaptureZone.classList.remove('hidden');
        startCamera();
      } else {
        if (dropZone) dropZone.classList.remove('hidden');
      }
      
      if (submitBtn) submitBtn.disabled = true;
      SoundSynth.play('click');
    });
  }

  if (submitBtn && uploadModal && previewImg) {
    submitBtn.addEventListener('click', () => {
      const id = uploadModal.dataset.questId;
      if (!id || !previewImg.src) return;

      S.questPhotos = S.questPhotos || {};
      S.questPhotos[id] = previewImg.src;
      S.claimQuest(id);
      
      uploadModal.classList.add('hidden');
      U.render();
      stopCamera();
    });
  }

  // Prevent default drag and drop behaviors globally on the window
  window.addEventListener('dragover', (e) => {
    e.preventDefault();
  }, false);
  window.addEventListener('drop', (e) => {
    e.preventDefault();
  }, false);
}

/* ── App Startup ── */
window.addEventListener('DOMContentLoaded', () => {
  // Initialize state & Cache UI elements
  S.init();
  U.cache();
  
  // Wire DOM listeners
  wire();
  
  // Render layout
  U.render();

  // Boot visual enhancement systems
  PlantCompanion.init();
  ParticleSystem.init();

  // Boot v4 Cloud and Health integration managers
  CloudSyncManager.init();
  GoogleHealthManager.init();

  // Run automated tests silently in background if loaded
  if (window.UnitTestSuite) {
    console.log("%c[TESTS] Running automated assertions...", "color: #a78bfa; font-weight: bold;");
    const testResults = window.UnitTestSuite.runAllTests(S, C);
    const passed = testResults.filter(r => r.status === 'PASSED').length;
    const total = testResults.length;
    console.log(`%c[TESTS] Result: ${passed}/${total} assertions passed.`, `color: ${passed === total ? '#10b981' : '#f43f5e'}; font-weight: bold;`);
  }

  // Autoplay Audio Unlock listener on first click/key
  const unlockAudio = () => {
    if (S.soundEnabled) {
      SoundSynth.startLofi();
    }
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
  };
  document.addEventListener('click', unlockAudio);
  document.addEventListener('keydown', unlockAudio);
});

/* ==========================================================================
   TALKING PLANT COMPANION ENGINE
   Context-aware speech bubbles, pupil tracking, mood-based mouth changes
   ========================================================================== */
/* ==========================================================================
   V5 INTERACTIVE SYSTEMS: SOUND SYNTH, TRIVIA ENGINE, SHOP, WATERING OFFSET
   ========================================================================== */

/* ── Global Camera State & Helpers ── */
let activeCameraStream = null;
function stopCamera() {
  if (activeCameraStream) {
    activeCameraStream.getTracks().forEach(track => track.stop());
    activeCameraStream = null;
  }
  const cameraStream = document.getElementById('camera-stream');
  if (cameraStream) {
    cameraStream.srcObject = null;
  }
}

/* ── Cozy Web Audio Synthesizer ── */
const SoundSynth = {
  ctx: null,
  lofiPlaying: false,
  lofiTimer: null,
  nextLofiBeatTime: 0,
  lofiChordIdx: 0,
  lofiNoiseSource: null,

  play(type) {
    if (!S.soundEnabled) return;
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      if (type === 'pop') {
        // Giggle or mini click
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.1);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'water') {
        // Splishing splash (filtered bandpass noise)
        const bufferSize = this.ctx.sampleRate * 0.35;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.exponentialRampToValueAtTime(1600, now + 0.18);
        filter.Q.value = 6.0;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.30, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        source.start(now);
        source.stop(now + 0.35);
      } else if (type === 'victory') {
        // Cozy pentatonic jingle (C4 - E4 - G4 - C5)
        const notes = [261.63, 329.63, 392.00, 523.25];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.22);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.25);
        });
      } else if (type === 'snooze') {
        // Slow soft wave for night time
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.7);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.10, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === 'click') {
        // Simple organic plop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      console.warn("Sound Synth fail:", e);
    }
  },

  startLofi() {
    if (!S.soundEnabled || this.lofiPlaying) return;
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.lofiPlaying = true;
      this.nextLofiBeatTime = this.ctx.currentTime;
      this.lofiChordIdx = 0;
      this.scheduleLofiLoop();
      this.startLofiNoise();
    } catch (e) {
      console.warn("Lofi play fail:", e);
    }
  },

  stopLofi() {
    this.lofiPlaying = false;
    if (this.lofiTimer) {
      clearTimeout(this.lofiTimer);
      this.lofiTimer = null;
    }
    if (this.lofiNoiseSource) {
      try {
        this.lofiNoiseSource.stop();
      } catch (e) {}
      this.lofiNoiseSource = null;
    }
    if (this.ctx && typeof this.ctx.suspend === 'function' && this.ctx.state === 'running') {
      try {
        this.ctx.suspend();
      } catch (e) {}
    }
  },

  scheduleLofiLoop() {
    if (!this.lofiPlaying) return;
    const tempo = 72; // slow lofi bpm
    const beatLen = 60.0 / tempo;
    const scheduleAheadTime = 0.2;
    const lookahead = 50.0; // ms

    while (this.nextLofiBeatTime < this.ctx.currentTime + scheduleAheadTime) {
      this.playLofiMeasure(this.lofiChordIdx, this.nextLofiBeatTime, beatLen);
      this.nextLofiBeatTime += beatLen * 4; // increment by 4 beats (1 measure)
      this.lofiChordIdx = (this.lofiChordIdx + 1) % 4; // 4 chords
    }

    this.lofiTimer = setTimeout(() => this.scheduleLofiLoop(), lookahead);
  },

  playLofiMeasure(chordIdx, time, beatLen) {
    // Chords: Am7 -> D9 -> Gmaj7 -> Cmaj7
    const chords = [
      { root: 110.00, freqs: [220.00, 261.63, 329.63, 392.00] }, // Am7 (A3, C4, E4, G4)
      { root: 146.83, freqs: [146.83, 220.00, 277.18, 329.63] }, // D9 (D3, A3, C#4, E4)
      { root: 98.00,  freqs: [196.00, 246.94, 293.66, 369.99] }, // Gmaj7 (G3, B3, D4, F#4)
      { root: 130.81, freqs: [130.81, 164.81, 196.00, 246.94] }  // Cmaj7 (C3, E3, G3, B3)
    ];

    const chord = chords[chordIdx];

    // 1. Play Cozy Rhodes chords (soft triangle waves with lowpass filter)
    chord.freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      // Mellow pitch flutter
      osc.frequency.linearRampToValueAtTime(freq * (1 + 0.002 * Math.sin(idx)), time + beatLen * 4);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.15, time + 0.25); // slow attack
      gain.gain.setValueAtTime(0.15, time + beatLen * 3.6);
      gain.gain.exponentialRampToValueAtTime(0.001, time + beatLen * 4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + beatLen * 4);
    });

    // 2. Play Cozy Bassline (sine wave on root frequency)
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(chord.root, time);

    bassGain.gain.setValueAtTime(0, time);
    bassGain.gain.linearRampToValueAtTime(0.20, time + 0.15);
    bassGain.gain.setValueAtTime(0.20, time + beatLen * 3.6);
    bassGain.gain.exponentialRampToValueAtTime(0.001, time + beatLen * 3.9);

    bassOsc.connect(bassGain);
    bassGain.connect(this.ctx.destination);
    bassOsc.start(time);
    bassOsc.stop(time + beatLen * 4);

    // 3. Drum Beats: Kick (beat 1, 3) and Snare (beat 2, 4)
    this.playLofiKick(time);
    this.playLofiSnare(time + beatLen);
    this.playLofiKick(time + beatLen * 2);
    this.playLofiSnare(time + beatLen * 3);

    // Play soft hi-hats on every beat
    for (let b = 0; b < 4; b++) {
      this.playLofiHihat(time + beatLen * b + beatLen / 2);
    }
  },

  playLofiKick(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.15);
    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.15);
  },

  playLofiSnare(time) {
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    source.start(time);
    source.stop(time + 0.1);
  },

  playLofiHihat(time) {
    const bufferSize = this.ctx.sampleRate * 0.03;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 8000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    source.start(time);
    source.stop(time + 0.03);
  },

  startLofiNoise() {
    const bufferSize = this.ctx.sampleRate * 2.0;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const noise = Math.random() * 2 - 1;
      const pop = Math.random() < 0.0003 ? (Math.random() * 0.5 - 0.25) : 0;
      data[i] = noise * 0.006 + pop * 0.12;
    }
    
    this.lofiNoiseSource = this.ctx.createBufferSource();
    this.lofiNoiseSource.buffer = buffer;
    this.lofiNoiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1400;
    filter.Q.value = 0.5;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.05; // soft lofi noise level

    this.lofiNoiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    this.lofiNoiseSource.start(0);
  }
};

/* ── Daily Eco-Trivia Mini-Game ── */
const TriviaEngine = {
  questions: {
    easy: [
      {
        q: "What is the most eco-friendly way to dry your clothes?",
        o: ["Using a clothes dryer", "Air drying on a line", "Ironing them dry"],
        a: 1
      },
      {
        q: "Which type of light bulb is the most energy-efficient?",
        o: ["Incandescent", "Halogen", "LED"],
        a: 2
      },
      {
        q: "What is the best way to reduce plastic waste?",
        o: ["Use reusable bags", "Recycle single-use cups", "Burn plastic bags"],
        a: 0
      },
      {
        q: "How can you save water while brushing your teeth?",
        o: ["Turn off the tap", "Brush faster", "Use hot water"],
        a: 0
      },
      {
        q: "Which of these is a clean, renewable energy source?",
        o: ["Coal power", "Solar energy", "Natural gas"],
        a: 1
      },
      {
        q: "What does the term 'Reduce, Reuse, Recycle' prioritize first?",
        o: ["Recycling waste", "Reducing consumption", "Reusing old items"],
        a: 1
      },
      {
        q: "Which transport mode has the lowest carbon footprint per passenger?",
        o: ["Gasoline car", "Walking or biking", "Diesel bus"],
        a: 1
      },
      {
        q: "What should you do with leftover food scraps?",
        o: ["Throw in trash", "Compost them", "Flush down sink"],
        a: 1
      },
      {
        q: "Which material takes the longest to decompose in a landfill?",
        o: ["Paper bag", "Orange peel", "Plastic bottle"],
        a: 2
      },
      {
        q: "Unplugging chargers when not in use helps stop what?",
        o: ["Phantom power drain", "Short circuits", "Battery explosion"],
        a: 0
      }
    ],
    medium: [
      {
        q: "By how much does washing laundry at 30°C vs 40°C cut energy use?",
        o: ["Around 10%", "Around 38%", "Around 60%"],
        a: 1
      },
      {
        q: "Deleting 100 junk emails offsets approximately how much CO₂?",
        o: ["0.3 kg CO₂", "3.0 kg CO₂", "0.03 kg CO₂"],
        a: 0
      },
      {
        q: "Which food category generally has the highest greenhouse gas footprint?",
        o: ["Poultry meals", "Dairy and cheese", "Beef and lamb"],
        a: 2
      },
      {
        q: "What is the cleanest timing for household power grid usage?",
        o: ["Peak demand hours", "Clean energy windows", "Midday coal hours"],
        a: 1
      },
      {
        q: "How much global food production is wasted every year?",
        o: ["About 10%", "About 33%", "About 50%"],
        a: 1
      },
      {
        q: "Which type of bag requires the most energy to manufacture?",
        o: ["Single-use plastic bag", "Paper bag", "Cotton tote bag"],
        a: 2
      },
      {
        q: "What is the primary target of carbon offsetting?",
        o: ["Stopping consumption", "Neutralizing emissions", "Increasing green tax"],
        a: 1
      },
      {
        q: "Which appliance typically consumes the most energy annually?",
        o: ["Heating and cooling", "Refrigerator", "Microwave oven"],
        a: 0
      },
      {
        q: "What percentage of global electricity comes from renewable sources today?",
        o: ["Around 10%", "Around 30%", "Around 60%"],
        a: 1
      },
      {
        q: "Which of these has the lowest carbon footprint for digital storage?",
        o: ["Local SSD drive", "Cloud storage", "Physical paper copies"],
        a: 1
      }
    ],
    hard: [
      {
        q: "Which activity releases the most CO₂ per hour?",
        o: ["4K Video Streaming", "Smart Speaker Use", "Bitcoin Mining"],
        a: 2
      },
      {
        q: "Which streaming resolution consumes about 4x more carbon than 1080p?",
        o: ["720p HD", "1080p Full HD", "4K Ultra HD"],
        a: 2
      },
      {
        q: "What is the approximate carbon intensity of the US power grid average?",
        o: ["~150g CO2/kWh", "~380g CO2/kWh", "~700g CO2/kWh"],
        a: 1
      },
      {
        q: "Which of these chemical compounds is a potent greenhouse gas used in ACs?",
        o: ["Hydrofluorocarbons (HFCs)", "Carbon Dioxide", "Nitrous Oxide"],
        a: 0
      },
      {
        q: "What is the concept of 'Embodied Carbon' in products?",
        o: ["Carbon added in recycling", "Emissions during production", "End-of-life disposal carbon"],
        a: 1
      },
      {
        q: "How much carbon is sequestered annually by a mature forest tree on average?",
        o: ["About 2 kg", "About 22 kg", "About 220 kg"],
        a: 1
      },
      {
        q: "What is 'E-waste' and why is it a significant eco concern?",
        o: ["Paper printed emails", "Discarded electronics", "Inefficient code bases"],
        a: 1
      },
      {
        q: "Which sector contributes the most to global greenhouse gas emissions?",
        o: ["Transportation", "Agriculture", "Electricity & Heat Production"],
        a: 2
      },
      {
        q: "What is the carbon payback time for a typical residential solar panel system?",
        o: ["1 to 3 years", "5 to 8 years", "10 to 12 years"],
        a: 0
      },
      {
        q: "Which process causes 'Ocean Acidification' due to excess carbon?",
        o: ["Acid rain in oceans", "CO2 dissolving in seawater", "Algae blooms dying"],
        a: 1
      }
    ]
  },

  selectedLevel: 'easy',
  quizQuestions: [],
  currentQuestionIdx: 0,
  correctAnswersCount: 0,

  init() {
    // Attach selection screen start quiz buttons
    const startBtns = document.querySelectorAll('.start-quiz-btn');
    startBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lvl = btn.dataset.level;
        this.startQuiz(lvl);
      });
    });

    // Next question button
    const nextBtn = document.getElementById('quiz-next-question-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextQuestion();
      });
    }

    // Results back button
    const backBtn = document.getElementById('quiz-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.resetQuizView();
      });
    }
  },

  startQuiz(level) {
    const today = new Date().toDateString();
    if (S.lastTriviaDate === today) {
      alert("You've already completed a trivia quiz today! Come back tomorrow. 🧠🌻");
      SoundSynth.play('click');
      return;
    }

    this.selectedLevel = level;
    this.quizQuestions = [...this.questions[level]];
    this.currentQuestionIdx = 0;
    this.correctAnswersCount = 0;

    // Show play screen and hide others
    document.getElementById('quiz-selection-screen').classList.add('hidden');
    document.getElementById('quiz-play-screen').classList.remove('hidden');
    document.getElementById('quiz-results-screen').classList.add('hidden');

    // Update level display badge
    const badge = document.getElementById('quiz-level-indicator');
    if (badge) {
      badge.textContent = level;
      badge.className = `badge level-${level}`;
      if (level === 'easy') {
        badge.style.background = 'rgba(16,185,129,0.1)';
        badge.style.color = 'var(--green)';
      } else if (level === 'medium') {
        badge.style.background = 'rgba(251,191,36,0.1)';
        badge.style.color = 'var(--yellow)';
      } else {
        badge.style.background = 'rgba(244,63,94,0.1)';
        badge.style.color = 'var(--rose)';
      }
    }

    SoundSynth.play('pop');
    this.showCurrentQuestion();
  },

  showCurrentQuestion() {
    const totalQ = this.quizQuestions.length;
    const item = this.quizQuestions[this.currentQuestionIdx];

    // Hide feedback box
    const feedbackBox = document.getElementById('quiz-feedback-box');
    if (feedbackBox) feedbackBox.classList.add('hidden');

    // Update progress text
    const progText = document.getElementById('quiz-progress-text');
    if (progText) progText.textContent = `Question ${this.currentQuestionIdx + 1} of ${totalQ}`;

    // Update progress bar width
    const progBar = document.getElementById('quiz-progress-bar');
    if (progBar) {
      const pct = ((this.currentQuestionIdx + 1) / totalQ) * 100;
      progBar.style.width = `${pct}%`;
      // set color based on level
      if (this.selectedLevel === 'easy') progBar.style.background = 'var(--green)';
      else if (this.selectedLevel === 'medium') progBar.style.background = 'var(--yellow)';
      else progBar.style.background = 'var(--rose)';
    }

    // Question Text
    const qText = document.getElementById('quiz-question-text');
    if (qText) qText.textContent = item.q;

    // Options
    const optContainer = document.getElementById('quiz-options-container');
    if (optContainer) {
      optContainer.innerHTML = '';
      item.o.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt-btn';
        btn.textContent = opt;
        btn.dataset.idx = idx;
        btn.addEventListener('click', () => {
          this.submitAnswer(idx);
        });
        optContainer.appendChild(btn);
      });
    }
  },

  submitAnswer(selectedIdx) {
    const item = this.quizQuestions[this.currentQuestionIdx];
    const isCorrect = (selectedIdx === item.a);

    // Disable all option buttons
    const optButtons = document.querySelectorAll('.quiz-opt-btn');
    optButtons.forEach(btn => {
      btn.disabled = true;
      const idx = parseInt(btn.dataset.idx);
      if (idx === item.a) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('incorrect');
      }
    });

    if (isCorrect) {
      this.correctAnswersCount++;
      SoundSynth.play('victory');
    } else {
      SoundSynth.play('click');
    }

    // Render feedback box
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const feedbackTitle = document.getElementById('quiz-feedback-title');
    const feedbackDesc = document.getElementById('quiz-feedback-desc');
    const nextBtn = document.getElementById('quiz-next-question-btn');

    if (feedbackBox && feedbackTitle && feedbackDesc && nextBtn) {
      feedbackTitle.textContent = isCorrect ? '🌟 Correct!' : '❌ Incorrect';
      feedbackTitle.style.color = isCorrect ? 'var(--green)' : 'var(--rose)';
      feedbackDesc.innerHTML = isCorrect 
        ? 'Great ecological knowledge!' 
        : `The correct answer was: <strong>"${item.o[item.a]}"</strong>.`;
      
      const isLast = (this.currentQuestionIdx === this.quizQuestions.length - 1);
      nextBtn.textContent = isLast ? 'See Results 🏆' : 'Next Question ➡️';
      
      feedbackBox.classList.remove('hidden');
    }
  },

  nextQuestion() {
    const totalQ = this.quizQuestions.length;
    const isLast = (this.currentQuestionIdx === totalQ - 1);

    if (isLast) {
      this.finishQuiz();
    } else {
      this.currentQuestionIdx++;
      this.showCurrentQuestion();
    }
  },

  finishQuiz() {
    const today = new Date().toDateString();
    const totalQ = this.quizQuestions.length;
    const gotAllCorrect = (this.correctAnswersCount === totalQ);

    let payout = 0;
    if (gotAllCorrect) {
      if (this.selectedLevel === 'easy') payout = 20;
      else if (this.selectedLevel === 'medium') payout = 50;
      else if (this.selectedLevel === 'hard') payout = 85;

      S.coins += payout;
      S.lastTriviaDate = today;
      S.save();
      U.render();
      SoundSynth.play('victory');
    } else {
      SoundSynth.play('pop');
    }

    // Populate Results Screen
    const resultEmoji = document.getElementById('quiz-result-emoji');
    const resultTitle = document.getElementById('quiz-result-title');
    const resultScore = document.getElementById('quiz-result-score');
    const resultPayout = document.getElementById('quiz-result-payout');
    const resultDesc = document.getElementById('quiz-result-desc');

    if (resultEmoji && resultTitle && resultScore && resultPayout && resultDesc) {
      resultScore.textContent = `${this.correctAnswersCount} / ${totalQ}`;
      
      if (gotAllCorrect) {
        resultEmoji.textContent = '🏆';
        resultTitle.textContent = 'Perfect Score!';
        resultPayout.style.display = 'block';
        resultPayout.textContent = `🪙 +${payout} Green Coins Earned!`;
        resultDesc.textContent = `Awesome environmental knowledge! You unlocked a daily reward. Keep playing daily to grow your garden boutique!`;
        PlantCompanion.sayText(`🎉 Perfect score on the ${this.selectedLevel} quiz! You earned 🪙 ${payout} Green Coins! 🧠🌻`);
      } else {
        resultEmoji.textContent = '🌱';
        resultTitle.textContent = 'Quiz Completed';
        resultPayout.style.display = 'none';
        resultDesc.textContent = `You got ${this.correctAnswersCount} out of ${totalQ} correct. A perfect 10/10 score is required to earn the coins! Try again tomorrow.`;
        PlantCompanion.sayText(`You finished the quiz with ${this.correctAnswersCount}/${totalQ} correct. Get 10/10 next time to earn coins! 🧠💚`);
      }
    }

    // Switch view
    document.getElementById('quiz-selection-screen').classList.add('hidden');
    document.getElementById('quiz-play-screen').classList.add('hidden');
    document.getElementById('quiz-results-screen').classList.remove('hidden');
  },

  resetQuizView() {
    document.getElementById('quiz-selection-screen').classList.remove('hidden');
    document.getElementById('quiz-play-screen').classList.add('hidden');
    document.getElementById('quiz-results-screen').classList.add('hidden');
    SoundSynth.play('click');
  }
};

/* ── Sunflower Accessories Boutique Manager ── */
const ShopManager = {
  items: {
    'top-hat': { name: 'Tiny Top Hat', price: 125, elId: 'acc-top-hat', type: 'svg', preview: '🎩' },
    'sunglasses': { name: 'Cool Sunglasses', price: 190, elId: 'acc-sunglasses', type: 'svg', preview: '🕶️' },
    'bow-tie': { name: 'Cute Bow Tie', price: 100, elId: 'acc-bow-tie', type: 'svg', preview: '🎀' },
    'crown': { name: 'Eco Crown', price: 250, elId: 'acc-crown', type: 'svg', preview: '👑' },
    'chef-hat': { name: 'Chef Hat', price: 140, elId: 'acc-chef-hat', type: 'svg', preview: '👨‍🍳' },
    'headphones': { name: 'DJ Headphones', price: 210, elId: 'acc-headphones', type: 'svg', preview: '🎧' },
    'rose': { name: 'Red Rose', price: 75, elId: 'acc-rose', type: 'svg', preview: '🌹' },
    'cowboy': { name: 'Cowboy Hat', price: 160, elId: 'acc-cowboy', type: 'svg', preview: '🤠' },
    'straw-hat': { name: 'Straw Hat', price: 110, elId: 'acc-straw-hat', type: 'svg', preview: '👒' },
    'santa-hat': { name: 'Santa Hat', price: 175, elId: 'acc-santa-hat', type: 'svg', preview: '🎅' },
    'ninja': { name: 'Ninja Mask', price: 225, elId: 'acc-ninja', type: 'svg', preview: '🥷' },
    'detective': { name: 'Detective Monocle', price: 190, elId: 'acc-detective', type: 'svg', preview: '🕵️' },
    'bunny-ears': { name: 'Bunny Ears', price: 150, elId: 'acc-bunny-ears', type: 'svg', preview: '🐰' },
    'disguise': { name: 'Disguise Mask', price: 125, elId: 'acc-disguise', type: 'svg', preview: '🥸' },
    'butterfly': { name: 'Butterfly Friend', price: 125, elId: 'acc-butterfly', type: 'svg', preview: '🦋' },
    'bee': { name: 'Little Bee', price: 110, elId: 'acc-bee', type: 'svg', preview: '🐝' },
    'cat-ears': { name: 'Cute Cat Ears', price: 160, elId: 'acc-cat-ears', type: 'svg', preview: '🐱' },
    'smart-glasses': { name: 'Smart Glasses', price: 100, elId: 'acc-smart-glasses', type: 'svg', preview: '👓' },
    'hibiscus': { name: 'Hibiscus Flower', price: 90, elId: 'acc-hibiscus', type: 'svg', preview: '🌺' },
    'witch-hat': { name: 'Witch Hat', price: 210, elId: 'acc-witch-hat', type: 'svg', preview: '🧙‍♀️' }
  },

  init() {
    this.modal = document.getElementById('shop-modal');
    this.btnOpen = document.getElementById('shop-btn');
    this.btnClose = document.getElementById('btn-shop-close');
    this.coinsDisplay = document.getElementById('shop-coins-val');

    if (this.btnOpen) {
      this.btnOpen.addEventListener('click', () => this.open());
    }
    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => this.close());
    }

    // Event delegation on grid container
    const grid = document.getElementById('shop-items-grid');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-shop-action');
        if (btn) {
          const itemEl = btn.closest('.shop-item');
          if (itemEl) {
            const itemKey = itemEl.dataset.item;
            this.handleItemAction(itemKey);
          }
        }
      });
    }

    this.applyEquippedAccessory();
  },

  open() {
    if (!this.modal) return;
    this.modal.classList.remove('hidden');
    if (this.coinsDisplay) this.coinsDisplay.textContent = S.coins;
    this.renderShopItems();
    SoundSynth.play('pop');
  },

  close() {
    if (!this.modal) return;
    this.modal.classList.add('hidden');
    SoundSynth.play('click');
  },

  renderShopItems() {
    const grid = document.getElementById('shop-items-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const shopState = S.shop || { owned: ['none'], equipped: 'none' };

    for (const [itemKey, details] of Object.entries(this.items)) {
      const isOwned = shopState.owned.includes(itemKey);
      const isEquipped = shopState.equipped === itemKey;

      const itemEl = document.createElement('div');
      itemEl.dataset.item = itemKey;

      let btnText = `Buy (${details.price})`;
      let btnClass = 'btn btn-sm btn-glow btn-shop-action';
      let btnStyle = '';

      itemEl.className = 'shop-item glass-panel';
      if (isEquipped) {
        itemEl.classList.add('equipped');
        btnText = 'Equipped';
        btnClass = 'btn btn-sm btn-glow btn-shop-action';
        btnStyle = 'background: var(--green);';
      } else if (isOwned) {
        itemEl.classList.add('owned');
        btnText = 'Equip';
        btnClass = 'btn btn-sm btn-shop-action';
        btnStyle = 'background: rgba(255,255,255,0.06);';
      }

      itemEl.innerHTML = `
        <div class="shop-item-preview" style="font-size: 2.2rem; margin: 10px 0; height: 50px; display: flex; align-items: center; justify-content: center;">
          ${details.preview}
        </div>
        <div style="font-weight: 700; font-size: 0.82rem; margin-bottom: 4px; font-family: var(--font-display); text-align: center;">${details.name}</div>
        <button class="${btnClass}" style="width: 100%; margin-top: 8px; justify-content: center; ${btnStyle}">${btnText}</button>
      `;

      grid.appendChild(itemEl);
    }
  },

  handleItemAction(itemKey) {
    const details = this.items[itemKey];
    if (!details) return;

    S.shop = S.shop || { owned: ['none'], equipped: 'none' };
    const isOwned = S.shop.owned.includes(itemKey);
    const isEquipped = S.shop.equipped === itemKey;

    if (isEquipped) {
      S.shop.equipped = 'none';
      SoundSynth.play('click');
    } else if (isOwned) {
      S.shop.equipped = itemKey;
      SoundSynth.play('pop');
    } else {
      if (S.coins >= details.price) {
        S.coins -= details.price;
        S.shop.owned.push(itemKey);
        S.shop.equipped = itemKey;
        SoundSynth.play('victory');
      } else {
        alert("Not enough Green Coins! Complete daily quests to earn more. 🪙");
        SoundSynth.play('click');
        return;
      }
    }

    S.save();
    U.render();
    if (this.coinsDisplay) this.coinsDisplay.textContent = S.coins;
    this.renderShopItems();
    this.applyEquippedAccessory();
  },

  applyEquippedAccessory() {
    const accElements = document.querySelectorAll('.plant-accessory');
    accElements.forEach(el => el.classList.add('hidden'));

    S.shop = S.shop || { owned: ['none'], equipped: 'none' };
    const equipped = S.shop.equipped;
    if (equipped && equipped !== 'none') {
      const details = this.items[equipped];
      if (details && details.elId) {
        const el = document.getElementById(details.elId);
        if (el) el.classList.remove('hidden');
      }
    }
  }
};

/* ── Watering & Carbon Offsetting Manager ── */
const WateringManager = {
  isWatering: false,

  init() {
    this.btn = document.getElementById('water-btn');
    if (this.btn) {
      this.btn.addEventListener('click', () => this.water());
    }
  },

  water() {
    if (this.isWatering) return;

    if (S.coins < 30) {
      alert("Watering the Sunflower costs 30 Green Coins! Complete some quests first. 🪙💧");
      SoundSynth.play('click');
      return;
    }

    this.isWatering = true;
    S.coins -= 30;
    S.wateringCount = (S.wateringCount || 0) + 1;

    S.recalc();
    S.save();
    U.render();

    SoundSynth.play('water');
    this.runDropletAnimation();

    const avatarEl = document.getElementById('avatar-wrap');
    if (avatarEl) {
      avatarEl.classList.add('giggling');
      avatarEl.style.transform = 'scale(1.1)';
      avatarEl.style.transition = 'transform 0.3s ease';
      
      setTimeout(() => {
        avatarEl.classList.remove('giggling');
        avatarEl.style.transform = '';
      }, 1500);
    }

    PlantCompanion.sayText("Aahh... thank you! 💦 That cold water was delicious. I just helped offset 0.5 kg of your CO₂! 🌻");

    setTimeout(() => {
      this.isWatering = false;
    }, 1500);
  },

  runDropletAnimation() {
    const container = document.getElementById('water-droplets');
    if (!container) return;

    container.innerHTML = '';
    for (let i = 0; i < 15; i++) {
      const drop = document.createElement('div');
      drop.className = 'water-drop';
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.animationDelay = `${Math.random() * 0.4}s`;
      container.appendChild(drop);
    }

    setTimeout(() => {
      container.innerHTML = '';
    }, 1200);
  }
};

/* ── Talking Sunflower Engine (PvZ Reference Style) ── */
const PlantCompanion = {
  speechEl: null,
  speechTextEl: null,
  mouthEl: null,
  pupilLeftEl: null,
  pupilRightEl: null,
  eyebrowLeftEl: null,
  eyebrowRightEl: null,
  speechTimer: null,
  currentMood: 'happy',

  lines: {
    greet: [
      "Hello! Let's save the planet! 🌍",
      "Welcome back, eco-friend! 🌱",
      "Ready to absorb some solar goodness? ☀️",
      "Looking bright today! Let's go green! 🌻",
      "Ready to track your footprint? 🐾"
    ],
    happy: [
      "You're doing great! Keep it up! 🌟",
      "The planet thanks you! 🌎",
      "Every small action feeds my petals! ✨",
      "Ah, the sun feels warm and emissions are low! ☀️",
      "I'm glowing because of you! 🌿"
    ],
    encourage: [
      "Try logging a cold wash swap! ❄️",
      "How about biking today? 🚴",
      "Delete some old emails! 📧",
      "Use your reusable cup! ♻️",
      "Check the GreenGrid timing! ⚡"
    ],
    warn: [
      "Hmm, emissions are rising... 😟",
      "Let's try some offsets! 💧",
      "My leaves are getting heavy... 🍂",
      "Can we find some green swaps? 🔄",
      "I'm starting to droop! 🥀"
    ],
    sad: [
      "Oh no, we went over budget! 😢",
      "I'm wilting... please help! 🥀",
      "Too much carbon today... 😞",
      "My seeds feel heavy... 🌧️",
      "Let's try harder tomorrow! 💪"
    ],
    questDone: [
      "Quest complete! 🎉 Amazing!",
      "You earned more coins! 🪙✨",
      "I'm so proud of you! 🌟",
      "Achievement unlocked! 🏆",
      "Green champion status! 💚"
    ],
    slip: [
      "Honesty is growth! 🌱",
      "Thanks for being truthful! 💚",
      "Logging slips takes courage! 🦁",
      "Your streak is safe with me! 🛡️"
    ],
    idle: [
      "The breeze feels nice... 🍃",
      "I wonder what the grid looks like... ⚡",
      "*sways gently* 🌻",
      "Did you know emails have carbon? 📧",
      "Cold washes save so much energy! ❄️",
      "I love when we garden together! 💚",
      "Is it sunny outside? I love sunshine! ☀️"
    ],
    sleep: [
      "Zzz... let's sleep clean... 💤",
      "Yawn... unplugging idle chargers... 😴",
      "Resting my petals... see you tomorrow... 💤",
      "Goodnight eco-friend... snooze mode... 🌙"
    ]
  },

  init() {
    this.speechEl = document.getElementById('plant-speech');
    this.speechTextEl = document.getElementById('speech-text');
    this.mouthEl = document.getElementById('plant-mouth');
    this.pupilLeftEl = document.querySelector('.pupil-left');
    this.pupilRightEl = document.querySelector('.pupil-right');
    this.eyebrowLeftEl = document.getElementById('eyebrow-left');
    this.eyebrowRightEl = document.getElementById('eyebrow-right');

    // Boot Time & Weather reactivity
    this.initWeatherAndTime();

    // Say greeting on load
    this.say('greet');

    // Start idle speech cycle
    this.startIdleCycle();

    // Track mouse for pupil movement
    this.initPupilTracking();

    // Interactive giggle trigger on mouseover
    const avatarEl = document.getElementById('avatar-wrap');
    if (avatarEl) {
      avatarEl.addEventListener('mouseenter', () => {
        if (this.currentMood !== 'sleep') {
          this.triggerGiggle();
        }
      });
      avatarEl.addEventListener('click', () => {
        if (this.currentMood === 'sleep') {
          this.sayText("Mmm... five more minutes? 😴 *yawn*");
          SoundSynth.play('snooze');
        } else {
          this.triggerGiggle();
        }
      });
    }
  },

  initWeatherAndTime() {
    const wrap = document.getElementById('avatar-wrap');
    const badge = document.getElementById('weather-badge');
    const canopy = document.getElementById('rain-canopy');

    if (!wrap) return;

    const hour = new Date().getHours();
    const isNight = hour >= 20 || hour < 6;

    if (isNight) {
      this.currentMood = 'sleep';
      wrap.classList.add('sleep-mode');
      if (badge) badge.textContent = "Night";
      
      if (this.eyebrowLeftEl) this.eyebrowLeftEl.setAttribute('d', 'M38,42 Q42,45 46,42');
      if (this.eyebrowRightEl) this.eyebrowRightEl.setAttribute('d', 'M54,42 Q58,45 62,42');
      if (this.mouthEl) this.mouthEl.setAttribute('d', 'M48,52 Q50,54 52,52');
      return;
    }

    if (!S.weather) {
      const weathers = ['Sunny', 'Rainy', 'Windy'];
      S.weather = weathers[Math.floor(Math.random() * weathers.length)];
      S.save();
    }

    wrap.classList.remove('sunny-day', 'rainy-day', 'windy-day');
    if (canopy) canopy.classList.add('hidden');

    if (S.weather === 'Rainy') {
      wrap.classList.add('rainy-day');
      if (badge) badge.textContent = "Rainy";
      if (canopy) canopy.classList.remove('hidden');
    } else if (S.weather === 'Windy') {
      wrap.classList.add('windy-day');
      if (badge) badge.textContent = "Windy";
    } else {
      wrap.classList.add('sunny-day');
      if (badge) badge.textContent = "Sunny";
      console.log("[Weather] Sunny day activated (+5% Green Coin Quests Bonus simulated)");
    }
  },

  say(category) {
    if (this.currentMood === 'sleep') category = 'sleep';
    const pool = this.lines[category] || this.lines.idle;
    const line = pool[Math.floor(Math.random() * pool.length)];

    this.sayText(line);
  },

  sayText(text) {
    if (!this.speechTextEl || !this.speechEl) return;

    this.speechEl.style.animation = 'none';
    void this.speechEl.offsetHeight;
    this.speechEl.style.animation = '';

    this.speechTextEl.textContent = text;
    this.animateTalking();
  },

  showTriviaBubble(question, options) {
    if (!this.speechEl || !this.speechTextEl) return;
    this.speechEl.style.animation = 'none';
    void this.speechEl.offsetHeight;
    this.speechEl.style.animation = '';

    let html = `<div style="font-weight:700; margin-bottom:8px; font-size:0.8rem; line-height:1.35;">${question}</div>`;
    html += `<div style="display:flex; flex-direction:column; gap:6px; margin-top:8px;">`;
    options.forEach((opt, idx) => {
      html += `<button class="trivia-opt-btn" data-opt="${idx}" style="text-align:left; font-size:0.75rem; padding:6px 10px; width:100%; border:1px solid rgba(255,255,255,0.08); border-radius:var(--r-sm); background:rgba(255,255,255,0.03); color:var(--text); cursor:pointer; font-weight:500; transition:all 0.2s;">${idx+1}. ${opt}</button>`;
    });
    html += `</div>`;

    this.speechTextEl.innerHTML = html;

    setTimeout(() => {
      const buttons = this.speechEl.querySelectorAll('.trivia-opt-btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const optIdx = parseInt(btn.dataset.opt);
          TriviaEngine.submitAnswer(optIdx);
        });
      });
    }, 100);
  },

  updateMood() {
    if (this.currentMood === 'sleep') return;

    const rem = S.budget - S.spent;
    const ratio = rem / S.budget;

    if (S.protected) {
      this.setMood('slip');
    } else if (ratio <= 0) {
      this.setMood('sad');
    } else if (ratio < 0.3) {
      this.setMood('warn');
    } else if (S.streak >= 3) {
      this.setMood('happy');
    } else {
      this.setMood('neutral');
    }
  },

  setMood(mood) {
    if (this.currentMood === 'sleep') return;
    if (mood === this.currentMood) return;
    this.currentMood = mood;

    if (this.mouthEl) {
      if (mood === 'sad') {
        this.mouthEl.setAttribute('d', 'M45,54 Q50,50 55,54');
        if (this.eyebrowLeftEl) this.eyebrowLeftEl.setAttribute('d', 'M39,36 Q42,34 45,33');
        if (this.eyebrowRightEl) this.eyebrowRightEl.setAttribute('d', 'M55,33 Q58,34 61,36');
      } else if (mood === 'warn') {
        this.mouthEl.setAttribute('d', 'M45,53 L55,53');
        if (this.eyebrowLeftEl) this.eyebrowLeftEl.setAttribute('d', 'M38,34 Q42,36 45,38');
        if (this.eyebrowRightEl) this.eyebrowRightEl.setAttribute('d', 'M55,38 Q58,36 62,34');
      } else if (mood === 'happy') {
        this.mouthEl.setAttribute('d', 'M43,51 Q50,58 57,51');
        if (this.eyebrowLeftEl) this.eyebrowLeftEl.setAttribute('d', 'M37,34 Q41,31 45,34');
        if (this.eyebrowRightEl) this.eyebrowRightEl.setAttribute('d', 'M55,34 Q59,31 63,34');
      } else if (mood === 'slip') {
        this.mouthEl.setAttribute('d', 'M47,52 Q50,55 53,52');
        if (this.eyebrowLeftEl) this.eyebrowLeftEl.setAttribute('d', 'M38,32 Q42,29 46,32');
        if (this.eyebrowRightEl) this.eyebrowRightEl.setAttribute('d', 'M54,32 Q58,29 62,32');
      } else {
        this.mouthEl.setAttribute('d', 'M45,51 Q50,56 55,51');
        if (this.eyebrowLeftEl) this.eyebrowLeftEl.setAttribute('d', 'M38,36 Q42,34 45,36');
        if (this.eyebrowRightEl) this.eyebrowRightEl.setAttribute('d', 'M55,36 Q58,34 62,36');
      }
    }

    if (mood === 'sad') this.say('sad');
    else if (mood === 'warn') this.say('warn');
    else if (mood === 'happy') this.say('happy');
    else if (mood === 'slip') this.say('slip');
  },

  animateTalking() {
    if (!this.mouthEl || this.currentMood === 'sleep') return;

    const savedPath = this.mouthEl.getAttribute('d');

    this.mouthEl.setAttribute('d', 'M46,51 Q50,57 54,51');
    this.mouthEl.setAttribute('stroke-width', '2.5');

    setTimeout(() => {
      this.mouthEl.setAttribute('d', 'M44,52 Q50,59 56,52');
    }, 120);

    setTimeout(() => {
      this.mouthEl.setAttribute('d', 'M46,51 Q50,55 54,51');
    }, 250);

    setTimeout(() => {
      this.mouthEl.setAttribute('d', savedPath);
      this.mouthEl.setAttribute('stroke-width', '2');
    }, 400);
  },

  triggerGiggle() {
    const avatarEl = document.getElementById('avatar-wrap');
    if (!avatarEl || avatarEl.classList.contains('giggling')) return;

    avatarEl.classList.add('giggling');
    SoundSynth.play('pop');
    
    const giggleLines = [
      "Hehehe! That tickles! 😄🌻",
      "Aha! Bouncing sunlight! ☀️💛",
      "I love when you play with me! 💚",
      "Giggle giggle... eco-warrior rules! 🌻"
    ];
    this.sayText(giggleLines[Math.floor(Math.random() * giggleLines.length)]);

    const savedL = this.eyebrowLeftEl ? this.eyebrowLeftEl.getAttribute('d') : null;
    const savedR = this.eyebrowRightEl ? this.eyebrowRightEl.getAttribute('d') : null;

    if (this.eyebrowLeftEl) this.eyebrowLeftEl.setAttribute('d', 'M38,32 Q42,29 46,32');
    if (this.eyebrowRightEl) this.eyebrowRightEl.setAttribute('d', 'M54,32 Q58,29 62,32');

    setTimeout(() => {
      avatarEl.classList.remove('giggling');
      if (this.eyebrowLeftEl && savedL) this.eyebrowLeftEl.setAttribute('d', savedL);
      if (this.eyebrowRightEl && savedR) this.eyebrowRightEl.setAttribute('d', savedR);
    }, 1200);
  },

  startIdleCycle() {
    const tick = () => {
      const delay = 12000 + Math.random() * 13000;
      this.speechTimer = setTimeout(() => {
        this.updateMood();
        
        if (this.currentMood === 'sleep') {
          this.say('sleep');
          SoundSynth.play('snooze');
        } else {
          const rem = S.budget - S.spent;
          if (rem < 0) {
            this.say('sad');
          } else if (rem / S.budget < 0.3) {
            this.say('warn');
          } else if (Math.random() < 0.35) {
            this.say('encourage');
          } else {
            this.say('idle');
          }
        }
        tick();
      }, delay);
    };
    tick();
  },

  initPupilTracking() {
    if (!this.pupilLeftEl || !this.pupilRightEl) return;

    const avatarEl = document.getElementById('avatar-wrap');
    if (!avatarEl) return;

    document.addEventListener('mousemove', (e) => {
      if (this.currentMood === 'sleep') return;

      const rect = avatarEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const maxShift = 1.6;
      const nx = (dx / dist) * Math.min(maxShift, dist / 80);
      const ny = (dy / dist) * Math.min(maxShift, dist / 80);

      this.pupilLeftEl.setAttribute('cx', 40.5 + nx);
      this.pupilLeftEl.setAttribute('cy', 40.5 + ny);
      this.pupilRightEl.setAttribute('cx', 56.5 + nx);
      this.pupilRightEl.setAttribute('cy', 40.5 + ny);
    });
  }
};

const ParticleSystem = {
  container: null,
  particles: [],
  maxParticles: 30,

  init() {
    this.container = document.getElementById('particles');
    if (!this.container) return;

    // Spawn initial batch
    for (let i = 0; i < this.maxParticles; i++) {
      this.spawnParticle(true);
    }
  },

  /**
   * Create a single floating particle
   * @param {boolean} randomStart - If true, starts at random y position. Otherwise starts from bottom.
   */
  spawnParticle(randomStart) {
    const el = document.createElement('div');
    el.className = 'particle';

    // Random properties
    const size = 2 + Math.random() * 4;
    const x = Math.random() * 100;
    const startY = randomStart ? Math.random() * 100 : 100 + Math.random() * 10;
    const duration = 15 + Math.random() * 25;
    const delay = randomStart ? -(Math.random() * duration) : 0;
    const drift = -20 + Math.random() * 40;

    // Random color from our palette
    const colors = [
      'rgba(16, 185, 129, 0.25)',
      'rgba(56, 189, 248, 0.2)',
      'rgba(167, 139, 250, 0.15)',
      'rgba(20, 184, 166, 0.2)',
      'rgba(251, 191, 36, 0.12)'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${startY}%;
      background: ${color};
      box-shadow: 0 0 ${size * 2}px ${color};
      animation: particle-float ${duration}s linear ${delay}s infinite;
      opacity: 0;
    `;

    this.container.appendChild(el);

    // Inject keyframes dynamically for unique drift per particle
    const keyframeName = `pf-${Math.random().toString(36).substr(2, 6)}`;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ${keyframeName} {
        0% {
          transform: translate(0, 0) scale(1);
          opacity: 0;
        }
        10% {
          opacity: 0.6;
        }
        90% {
          opacity: 0.4;
        }
        100% {
          transform: translate(${drift}px, -${100 + startY}vh) scale(0.5);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    el.style.animationName = keyframeName;
  }
};

/* ==========================================================================
   V4 MANAGERS — CLOUD SYNC, CHART ANALYTICS & GOOGLE HEALTH INTEGRATION
   ========================================================================== */

const CloudSyncManager = {
  db: null,
  auth: null,
  syncStatus: 'offline', // 'offline' | 'syncing' | 'online'
  uid: null,

  init() {
    if (typeof firebase !== 'undefined') {
      try {
        const firebaseConfig = {
          apiKey: "AIzaSyFakeKeyPlaceholderForAppStreakV4Security",
          authDomain: "terrastreak-v4-mock.firebaseapp.com",
          projectId: "terrastreak-v4-mock",
          storageBucket: "terrastreak-v4-mock.appspot.com",
          messagingSenderId: "1234567890",
          appId: "1:1234567890:web:abcdef123456"
        };
        firebase.initializeApp(firebaseConfig);
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        console.log("[Firebase] Configured successfully.");
      } catch (e) {
        console.warn("[Firebase] Initialization error: ", e);
      }
    } else {
      console.log("[Firebase] SDK not loaded. Operating in offline/mock mode.");
    }
    this.updateStatusBadge();
  },

  updateStatusBadge() {
    const dot = U.el.syncDot;
    const txt = U.el.syncText;
    if (!dot || !txt) return;

    dot.className = `sync-dot ${this.syncStatus}`;
    if (this.syncStatus === 'offline') {
      txt.textContent = 'Sync: Local Storage';
    } else if (this.syncStatus === 'syncing') {
      txt.textContent = 'Syncing to Cloud...';
    } else if (this.syncStatus === 'online') {
      txt.textContent = 'Sync: Connected';
    }
  },

  async performSync() {
    this.syncStatus = 'syncing';
    this.updateStatusBadge();

    if (!this.auth || !this.db) {
      setTimeout(() => {
        this.syncStatus = 'online';
        this.updateStatusBadge();
        console.log("[Sync Mock] Successfully pushed state to simulated Firestore:", JSON.stringify(S));
      }, 1000);
      return;
    }

    try {
      if (!this.auth.currentUser) {
        const userCred = await this.auth.signInAnonymously();
        this.uid = userCred.user.uid;
      } else {
        this.uid = this.auth.currentUser.uid;
      }

      const stateObj = {
        userName: S.userName || 'Eco-Warrior',
        pledge: S.pledge || false,
        budget: S.budget || 5.0,
        spent: S.spent || 0,
        emissionsTotal: S.emissionsTotal || 0,
        offsetsTotal: S.offsetsTotal || 0,
        streak: S.streak || 0,
        coins: S.coins || 0,
        protected: S.protected || false,
        quests: S.quests || [],
        gridHr: S.gridHr || 12,
        activities: S.activities || {},
        digital: S.digital || {},
        gridSchedule: S.gridSchedule || {},
        history: S.history || [],
        lastSynced: firebase.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection('users').doc(this.uid).set(stateObj, { merge: true });
      this.syncStatus = 'online';
      this.updateStatusBadge();
      console.log("[Firebase] Sync completed successfully. UID:", this.uid);
    } catch (e) {
      console.error("[Firebase] Sync failed: ", e);
      this.syncStatus = 'offline';
      this.updateStatusBadge();
      alert("Cloud Sync failed. Operating in offline/localStorage mode.");
    }
  }
};

const ChartAnalyticsManager = {
  chartInstance: null,

  renderChart() {
    const canvas = document.getElementById('emissions-chart');
    if (!canvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const labels = S.history.map(h => h.day);
    const spentData = S.history.map(h => h.spent);
    const budgetData = S.history.map(h => h.budget);

    this.updateStatsCards(spentData);

    if (typeof Chart === 'undefined') {
      console.warn("[Chart.js] Library not loaded. Cannot render analytics chart.");
      canvas.parentNode.innerHTML = `<div class="empty-state" style="padding: 40px; color: var(--rose); text-align: center;">Chart.js could not be loaded. Check connection.</div>`;
      return;
    }

    const ctx = canvas.getContext('2d');
    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Emissions Spent (kg)',
            data: spentData,
            backgroundColor: S.history.map(h => h.spent > h.budget ? 'rgba(251, 113, 133, 0.6)' : 'rgba(20, 184, 166, 0.6)'),
            borderColor: S.history.map(h => h.spent > h.budget ? 'var(--rose)' : 'var(--teal)'),
            borderWidth: 1.5,
            borderRadius: 4
          },
          {
            label: 'Carbon Allowance Budget',
            data: budgetData,
            type: 'line',
            fill: false,
            borderColor: 'rgba(251, 191, 36, 0.8)',
            borderDash: [6, 4],
            borderWidth: 2,
            pointStyle: 'circle',
            pointRadius: 4,
            pointBackgroundColor: 'var(--amber)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#94a3b8',
              font: { family: 'Outfit', size: 11 }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } },
            suggestedMax: 6
          }
        }
      }
    });
  },

  updateStatsCards(spentData) {
    const sum = spentData.reduce((a, b) => a + b, 0);
    const avg = spentData.length > 0 ? sum / spentData.length : 0;
    const avgEl = U.el.analyticsAvgSpent;
    if (avgEl) avgEl.textContent = `${avg.toFixed(2)} kg`;

    const best = spentData.length > 0 ? Math.min(...spentData) : 0;
    const bestEl = U.el.analyticsBestDay;
    if (bestEl) bestEl.textContent = `${best.toFixed(2)} kg`;

    let compliantDays = 0;
    S.history.forEach(h => {
      if (h.spent <= h.budget) compliantDays++;
    });
    const compliancePct = S.history.length > 0 ? (compliantDays / S.history.length) * 100 : 0;
    const complianceEl = U.el.analyticsCompliance;
    if (complianceEl) {
      complianceEl.textContent = `${compliancePct.toFixed(0)}%`;
      if (compliancePct >= 80) {
        complianceEl.className = 'card-large tg';
      } else if (compliancePct >= 50) {
        complianceEl.className = 'card-large ta';
      } else {
        complianceEl.className = 'card-large tr';
      }
    }
  }
};

const GoogleHealthManager = {
  isConnected: false,

  init() {
    this.updateHealthUI();
  },

  updateHealthUI() {
    const details = U.el.healthSyncDetails;
    const btn = U.el.btnHealthSync;
    if (!details || !btn) return;

    if (this.isConnected) {
      details.innerHTML = `Status: <span style="color: var(--green); font-weight: 600;">Connected</span>. Google Health API auto-synchronized active transit metrics successfully.`;
      btn.textContent = "🏥 Sync Active Transit";
      btn.classList.add('btn-g');
      btn.classList.remove('btn-glow');
    } else {
      details.innerHTML = `Status: <span style="color: var(--rose); font-weight: 600;">Not Synced</span>. Connect to automatically sync active daily walking and cycling metrics.`;
      btn.textContent = "Link Google Health";
      btn.classList.remove('btn-g');
      btn.classList.add('btn-glow');
    }
  },

  openConsentModal() {
    U.el.healthOauthModal?.classList.remove('hidden');
  },

  closeConsentModal() {
    U.el.healthOauthModal?.classList.add('hidden');
  },

  approveSync() {
    this.closeConsentModal();
    this.isConnected = true;
    this.updateHealthUI();

    S.activities.bike = 3.5;
    S.activities.transit = 1.8;
    S.recalc();
    S.save();
    U.render();

    if (typeof PlantCompanion !== 'undefined') {
      PlantCompanion.say('questDone');
      setTimeout(() => {
        if (PlantCompanion.speechTextEl) {
          PlantCompanion.speechTextEl.textContent = "I just synced 5.3 miles of active green travel from your Google Health account! 🚴🚶";
          PlantCompanion.animateTalking();
        }
      }, 2500);
    }
  },

  denySync() {
    this.closeConsentModal();
    console.log("[Google Health] Consent denied.");
  }
};

