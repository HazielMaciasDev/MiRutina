/* ============================================
   STATS — calculations over log
   ============================================ */

const Stats = {
  // % done for a given date
  percentFor(dateKey, tasks) {
    const log = Store.getDayLog(dateKey);
    if (!tasks.length) return 0;
    const done = tasks.filter(t => log[t.id]?.done).length;
    return Math.round((done / tasks.length) * 100);
  },

  // Current perfect streak ending today or yesterday
  // (only counts days where routine applies: Mon-Fri)
  perfectStreak() {
    const tasks = Store.getTasks();
    const cats = Store.getCategories();
    const log = Store.getLog();
    let streak = 0;
    let d = new Date();

    // If today is a weekend, start from yesterday's weekday
    // If today is not at 100% yet, allow counting back from yesterday
    const todayKey = Utils.todayKey(d);
    const todayGroup = Utils.dayGroupForDate(d);
    if (todayGroup) {
      const todayPct = this.percentFor(todayKey, tasks.filter(t => t.dayGroup === todayGroup));
      if (todayPct < 100) {
        d = Utils.addDays(d, -1);
      }
    }

    // Walk backwards up to 365 days
    for (let i = 0; i < 365; i++) {
      const group = Utils.dayGroupForDate(d);
      if (!group) {
        d = Utils.addDays(d, -1);
        continue;
      }
      const key = Utils.todayKey(d);
      const dayTasks = tasks.filter(t => t.dayGroup === group);
      const done = dayTasks.filter(t => log[key]?.[t.id]?.done).length;
      if (done === dayTasks.length) {
        streak++;
      } else {
        break;
      }
      d = Utils.addDays(d, -1);
    }
    return streak;
  },

  // Total tasks completed ever
  totalCompleted() {
    const log = Store.getLog();
    let count = 0;
    for (const dateKey in log) {
      for (const taskId in log[dateKey]) {
        if (log[dateKey][taskId].done) count++;
      }
    }
    return count;
  },

  // Total days tracked
  totalDaysTracked() {
    return Object.keys(Store.getLog()).filter(k => {
      return Object.values(Store.getLog()[k] || {}).some(e => e.done);
    }).length;
  },

  // % compliance last 7 days (rolling)
  weekPercent() {
    const tasks = Store.getTasks();
    let total = 0, done = 0;
    for (let i = 0; i < 7; i++) {
      const d = Utils.addDays(new Date(), -i);
      const group = Utils.dayGroupForDate(d);
      if (!group) continue;
      const dayTasks = tasks.filter(t => t.dayGroup === group);
      total += dayTasks.length;
      const log = Store.getDayLog(Utils.todayKey(d));
      done += dayTasks.filter(t => log[t.id]?.done).length;
    }
    return total === 0 ? 0 : Math.round((done / total) * 100);
  },

  // Best day of week (Lun..Vie) by avg %
  bestDayOfWeek() {
    const tasks = Store.getTasks();
    const log = Store.getLog();
    const buckets = { 'L-X': [], 'M-J': [], V: [] };
    for (const dateKey in log) {
      const date = Utils.parseKey(dateKey);
      const group = Utils.dayGroupForDate(date);
      if (!group) continue;
      const dayTasks = tasks.filter(t => t.dayGroup === group);
      const logEntry = log[dateKey];
      const done = dayTasks.filter(t => logEntry[t.id]?.done).length;
      const pct = (done / dayTasks.length) * 100;
      buckets[group].push(pct);
    }
    let bestGroup = null, bestAvg = -1;
    for (const g in buckets) {
      if (!buckets[g].length) continue;
      const avg = buckets[g].reduce((a, b) => a + b, 0) / buckets[g].length;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestGroup = g;
      }
    }
    return { group: bestGroup, avg: Math.round(bestAvg) };
  },

  // Compliance per category (all-time)
  categoryCompliance() {
    const tasks = Store.getTasks();
    const cats = Store.getCategories();
    const log = Store.getLog();
    const stats = {};
    cats.forEach(c => {
      stats[c.id] = { total: 0, done: 0, category: c };
    });
    for (const dateKey in log) {
      const date = Utils.parseKey(dateKey);
      const group = Utils.dayGroupForDate(date);
      if (!group) continue;
      const dayTasks = tasks.filter(t => t.dayGroup === group);
      for (const t of dayTasks) {
        const catId = t.categoryId;
        if (!stats[catId]) continue;
        stats[catId].total++;
        if (log[dateKey][t.id]?.done) stats[catId].done++;
      }
    }
    return Object.values(stats)
      .filter(s => s.total > 0)
      .map(s => ({ ...s, pct: Math.round((s.done / s.total) * 100) }))
      .sort((a, b) => b.pct - a.pct);
  },

  // 7-day rolling week bars (last 7 days)
  weekBars() {
    const tasks = Store.getTasks();
    const bars = [];
    for (let i = 6; i >= 0; i--) {
      const d = Utils.addDays(new Date(), -i);
      const group = Utils.dayGroupForDate(d);
      const key = Utils.todayKey(d);
      let pct = 0, isFuture = false;
      if (i === 0 && !group) isFuture = false; // today weekend
      if (d > new Date()) isFuture = true;
      if (group) {
        const dayTasks = tasks.filter(t => t.dayGroup === group);
        const log = Store.getDayLog(key);
        const done = dayTasks.filter(t => log[t.id]?.done).length;
        pct = dayTasks.length ? Math.round((done / dayTasks.length) * 100) : 0;
      }
      bars.push({
        key,
        date: d,
        dow: Utils.dow(d),
        label: Utils.dayNameShort(d),
        pct,
        isToday: i === 0,
        isWeekend: !group,
        isFuture,
      });
    }
    return bars;
  },

  // Stats for one month calendar view
  monthStats(year, month) {
    const tasks = Store.getTasks();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const result = {};
    for (let day = 1; day <= last.getDate(); day++) {
      const d = new Date(year, month, day);
      const key = Utils.todayKey(d);
      const group = Utils.dayGroupForDate(d);
      let pct = 0, total = 0, done = 0;
      if (group) {
        const dayTasks = tasks.filter(t => t.dayGroup === group);
        total = dayTasks.length;
        const log = Store.getDayLog(key);
        done = dayTasks.filter(t => log[t.id]?.done).length;
        pct = total ? Math.round((done / total) * 100) : 0;
      }
      result[key] = { pct, total, done, group };
    }
    return result;
  },
};

window.Stats = Stats;