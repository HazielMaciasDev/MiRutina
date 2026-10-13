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
    const d = this.dow(date);
    if (d === 1 || d === 3) return 'L-X';
    if (d === 2 || d === 4) return 'M-J';
    if (d === 5) return 'V';
    return null;
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