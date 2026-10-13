/* ============================================
   UTILS — Date helpers, formatting, ids
   ============================================ */

const Utils = {
  // ===== Dates =====
  todayKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  // Day of week 0=Sun, 1=Mon ... 6=Sat
  dow(date = new Date()) {
    return date.getDay();
  },

  isWeekend(date = new Date()) {
    const d = this.dow(date);
    return d === 0 || d === 6;
  },

  dayGroupForDate(date = new Date()) {
    return this.dow(date); // returns 0..6 or null if invalid
  },

  // Tasks that apply to a given day-of-week (0=Sun..6=Sat)
  tasksForDay(tasks, dayIdx) {
    return tasks.filter(t => {
      const groups = t.dayGroups && t.dayGroups.length
        ? t.dayGroups
        : (t.dayGroup === 'L-X' ? [1, 3]
          : t.dayGroup === 'M-J' ? [2, 4]
          : t.dayGroup === 'V'   ? [5]
          : []);
      return groups.includes(dayIdx);
    });
  },

  dayName(date = new Date()) {
    return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][this.dow(date)];
  },

  dayNameShort(date = new Date()) {
    return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][this.dow(date)];
  },

  monthName(date) {
    return [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ][date.getMonth()];
  },

  formatHour(h, m) {
    const hh = h % 24;
    const period = hh < 12 ? 'am' : 'pm';
    let h12 = hh % 12;
    if (h12 === 0) h12 = 12;
    return `${h12}:${String(m).padStart(2, '0')} ${period}`;
  },

  // Format as "Miércoles 13 de octubre"
  formatLongDate(date) {
    return `${this.dayName(date)} ${date.getDate()} de ${this.monthName(date)}`;
  },

  parseKey(key) {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
  },

  addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  },

  startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  },

  endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  },

  // ===== IDs =====
  uid(prefix = 'id') {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  },

  // ===== HTML escape =====
  esc(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  },
};

// Expose globally
window.Utils = Utils;