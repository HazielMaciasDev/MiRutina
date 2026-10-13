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

  // Tasks applicable to a given date's day-of-week
  tasksForDate(date, tasks) {
    return Utils.tasksForDay(tasks, Utils.dow(date));
  },

  // Current perfect streak ending today or yesterday
  perfectStreak() {
    const tasks = Store.getTasks();
    const log = Store.getLog();
    let streak = 0;
    let d = new Date();

    const todayKey = Utils.todayKey(d);
    const todayTasks = this.tasksForDate(d, tasks);
    if (todayTasks.length > 0) {
      const todayPct = this.percentFor(todayKey, todayTasks);
      if (todayPct < 100) {
        d = Utils.addDays(d, -1);
      }
    }

    for (let i = 0; i < 365; i++) {
      const dayTasks = this.tasksForDate(d, tasks);
      if (dayTasks.length === 0) {
        d = Utils.addDays(d, -1);
        continue;
      }
      const key = Utils.todayKey(d);
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
      const dayTasks = this.tasksForDate(d, tasks);
      if (dayTasks.length === 0) continue;
      total += dayTasks.length;
      const log = Store.getDayLog(Utils.todayKey(d));
      done += dayTasks.filter(t => log[t.id]?.done).length;
    }
    return total === 0 ? 0 : Math.round((done / total) * 100);
  },

  // Best day of week by avg % (only weekdays with assigned tasks: L M X J V)
  bestDayOfWeek() {
    const tasks = Store.getTasks();
    const log = Store.getLog();
    const buckets = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    for (const dateKey in log) {
      const date = Utils.parseKey(dateKey);
      const dow = Utils.dow(date);
      if (!buckets[dow]) continue;
      const dayTasks = this.tasksForDate(date, tasks);
      if (dayTasks.length === 0) continue;
      const logEntry = log[dateKey];
      const done = dayTasks.filter(t => logEntry[t.id]?.done).length;
      buckets[dow].push((done / dayTasks.length) * 100);
    }
    let bestDow = null, bestAvg = -1;
    for (const d in buckets) {
      if (!buckets[d].length) continue;
      const avg = buckets[d].reduce((a, b) => a + b, 0) / buckets[d].length;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestDow = Number(d);
      }
    }
    return { dow: bestDow, avg: Math.round(bestAvg) };
  },

  // Compliance per category (all-time)
  categoryCompliance() {
    const tasks = Store.getTasks();
    const cats = Store.getCategories();
    const log = Store.getLog();
    const stats = {};
    cats.forEach(c => { stats[c.id] = { total: 0, done: 0, category: c }; });
    for (const dateKey in log) {
      const date = Utils.parseKey(dateKey);
      const dayTasks = this.tasksForDate(date, tasks);
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

  // 7-day rolling week bars
  weekBars() {
    const tasks = Store.getTasks();
    const bars = [];
    for (let i = 6; i >= 0; i--) {
      const d = Utils.addDays(new Date(), -i);
      const dayTasks = this.tasksForDate(d, tasks);
      const key = Utils.todayKey(d);
      let pct = 0;
      if (dayTasks.length) {
        const log = Store.getDayLog(key);
        const done = dayTasks.filter(t => log[t.id]?.done).length;
        pct = Math.round((done / dayTasks.length) * 100);
      }
      bars.push({
        key,
        date: d,
        dow: Utils.dow(d),
        label: Utils.dayNameShort(d),
        pct,
        isToday: i === 0,
        hasTasks: dayTasks.length > 0,
        isFuture: d > new Date(),
      });
    }
    return bars;
  },

  // Stats for one month calendar view
  monthStats(year, month) {
    const tasks = Store.getTasks();
    const last = new Date(year, month + 1, 0);
    const result = {};
    for (let day = 1; day <= last.getDate(); day++) {
      const d = new Date(year, month, day);
      const key = Utils.todayKey(d);
      const dayTasks = this.tasksForDate(d, tasks);
      const total = dayTasks.length;
      const log = Store.getDayLog(key);
      const done = dayTasks.filter(t => log[t.id]?.done).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      result[key] = { pct, total, done, hasTasks: total > 0 };
    }
    return result;
  },
};

window.Stats = Stats;