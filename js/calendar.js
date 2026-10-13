/* ============================================
   STATS VIEW — statistics + calendar
   ============================================ */

const StatsView = {
  el: null,
  monthRef: new Date(),

  init() {
    this.el = document.getElementById('view-stats');
    Store.on('log:changed', () => this.render());
    Store.on('tasks:changed', () => this.render());
    this.render();
  },

  render() {
    if (!this.el) return;
    const streak = Stats.perfectStreak();
    const weekPct = Stats.weekPercent();
    const totalDone = Stats.totalCompleted();
    const totalDays = Stats.totalDaysTracked();
    const best = Stats.bestDayOfWeek();
    const weekBars = Stats.weekBars();
    const catStats = Stats.categoryCompliance();

    const bestLabel = best.dow != null ? Utils.dayName({ getDay: () => best.dow }) : '—';

    this.el.innerHTML = `
      <header class="stats-hero">
        <span class="stats-hero__eyebrow">Tu progreso</span>
        <h2 class="stats-hero__num">${streak}</h2>
        <p class="stats-hero__label">${streak === 1 ? 'día' : 'días'} consecutivos al 100%</p>
        <hr class="stats-hero__rule" />
      </header>

      <section class="stats-grid">
        <div class="stat-card">
          <span class="stat-card__label">% semana</span>
          <span class="stat-card__num stat-card__num--accent">${weekPct}<span class="stat-card__unit">%</span></span>
          <span class="stat-card__sub">Cumplimiento</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__label">Hechas</span>
          <span class="stat-card__num stat-card__num--sage">${totalDone}</span>
          <span class="stat-card__sub">En ${totalDays} días</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__label">Mejor día</span>
          ${best.dow != null
            ? `<span class="stat-card__num stat-card__num--small">${bestLabel}</span>`
            : `<span class="stat-card__num stat-card__num--small stat-card__num--muted">—</span>`}
          <span class="stat-card__sub">${best.dow != null ? `${best.avg}% promedio` : 'Sin datos aún'}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__label">Racha</span>
          <span class="stat-card__num">${streak}</span>
          <span class="stat-card__sub">Días perfectos</span>
        </div>
      </section>

      <section class="section">
        <div class="section-label">
          <span class="section-label__text">Últimos 7 días</span>
          <span class="section-label__rule"></span>
        </div>
        <div class="week">
          <div class="week__bars">
            ${weekBars.map(b => this.renderWeekBar(b)).join('')}
          </div>
        </div>
      </section>

      ${catStats.length ? `
        <section class="section">
          <div class="section-label">
            <span class="section-label__text">Por categoría</span>
            <span class="section-label__rule"></span>
          </div>
          <div class="cat-bars">
            ${catStats.map(c => this.renderCatBar(c)).join('')}
          </div>
        </section>
      ` : ''}

      <section class="section">
        <div class="section-label">
          <span class="section-label__text">Historial</span>
          <span class="section-label__rule"></span>
        </div>
        ${this.renderCalendar()}
      </section>

      <div class="day-modal-backdrop" id="day-modal" role="dialog" aria-hidden="true">
        <div class="day-modal" id="day-modal-content"></div>
      </div>
    `;

    this.bindEvents();
  },

  renderWeekBar(b) {
    const cls = [
      'week__bar',
      b.isToday ? 'is-today' : '',
      b.isFuture ? 'is-future' : '',
      !b.hasTasks ? 'is-no-tasks' : '',
    ].join(' ');
    const fillHeight = b.hasTasks ? b.pct : 0;
    return `
      <div class="${cls}">
        <div class="week__bar-track">
          <div class="week__bar-fill" style="height:${fillHeight}%;"></div>
        </div>
        <span class="week__bar-day">${b.label}</span>
      </div>
    `;
  },

  renderCatBar(c) {
    return `
      <div class="cat-bar">
        <div class="cat-bar__head">
          <span class="cat-bar__name">
            <span class="cat-bar__swatch" style="background:${c.category.color};"></span>
            ${Utils.esc(c.category.label)}
          </span>
          <span class="cat-bar__num">${c.done}/${c.total} · ${c.pct}%</span>
        </div>
        <div class="cat-bar__track">
          <div class="cat-bar__fill" style="width:${c.pct}%;background:${c.category.color};"></div>
        </div>
      </div>
    `;
  },

  renderCalendar() {
    const y = this.monthRef.getFullYear();
    const m = this.monthRef.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const padStart = first.getDay();
    const todayKey = Utils.todayKey();
    const monthStats = Stats.monthStats(y, m);

    const dows = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
      .map(d => `<div class="calendar__dow">${d}</div>`).join('');

    const cells = [];
    for (let i = 0; i < padStart; i++) {
      cells.push(`<div class="calendar__cell is-empty"></div>`);
    }
    for (let day = 1; day <= last.getDate(); day++) {
      const d = new Date(y, m, day);
      const key = Utils.todayKey(d);
      const stat = monthStats[key];
      const isToday = key === todayKey;
      const isFuture = d > new Date();
      const hasTasks = stat && stat.hasTasks;
      const showDot = hasTasks && stat.done > 0;
      const cls = [
        'calendar__cell',
        isToday ? 'is-today' : '',
        !hasTasks ? 'is-no-tasks' : '',
        isFuture ? 'is-future' : '',
      ].join(' ');
      cells.push(`
        <button class="${cls}" data-action="open-day" data-key="${key}" ${isFuture ? 'disabled' : ''}>
          ${day}
          ${showDot ? '<span class="calendar__cell-done"></span>' : ''}
        </button>
      `);
    }

    return `
      <div class="calendar">
        <div class="calendar__head">
          <span class="calendar__month">${Utils.monthName(first)} ${y}</span>
          <div class="calendar__nav">
            <button class="btn btn--ghost btn--sm" data-action="prev-month" aria-label="Mes anterior">‹</button>
            <button class="btn btn--ghost btn--sm" data-action="next-month" aria-label="Mes siguiente">›</button>
          </div>
        </div>
        <div class="calendar__grid">
          ${dows}${cells.join('')}
        </div>
      </div>
    `;
  },

  bindEvents() {
    this.el.querySelectorAll('[data-action="prev-month"]').forEach(b => {
      b.addEventListener('click', () => {
        this.monthRef = new Date(this.monthRef.getFullYear(), this.monthRef.getMonth() - 1, 1);
        this.render();
      });
    });
    this.el.querySelectorAll('[data-action="next-month"]').forEach(b => {
      b.addEventListener('click', () => {
        this.monthRef = new Date(this.monthRef.getFullYear(), this.monthRef.getMonth() + 1, 1);
        this.render();
      });
    });
    this.el.querySelectorAll('[data-action="open-day"]').forEach(b => {
      b.addEventListener('click', () => this.openDayModal(b.dataset.key));
    });
  },

  openDayModal(dateKey) {
    const date = Utils.parseKey(dateKey);
    const tasks = Store.getTasks();
    const cats = Store.getCategories();
    const dayIdx = Utils.dow(date);
    const dayTasks = Utils.tasksForDay(tasks, dayIdx)
      .sort((a, b) => (a.hour - b.hour) || (a.minute - b.minute));
    const log = Store.getDayLog(dateKey);
    const done = dayTasks.filter(t => log[t.id]?.done).length;
    const pct = dayTasks.length ? Math.round((done / dayTasks.length) * 100) : 0;

    const content = document.getElementById('day-modal-content');
    content.innerHTML = `
      <div class="day-modal__handle"></div>
      <div class="day-modal__head">
        <div>
          <div class="day-modal__date">${date.getDate()} ${Utils.monthName(date)}</div>
          <div class="day-modal__sub">${Utils.dayName(date)} · ${done} / ${dayTasks.length} · ${pct}%</div>
        </div>
        <button class="btn btn--ghost btn--sm" data-action="close-modal">Cerrar</button>
      </div>
      ${dayTasks.length ? dayTasks.map(task => {
        const cat = cats.find(c => c.id === task.categoryId);
        const entry = log[task.id] || {};
        const isDone = !!entry.done;
        return `
          <div class="day-task ${isDone ? 'is-done' : ''}">
            <div class="day-task__check">
              ${isDone ? '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
            <div class="day-task__body">
              <div class="day-task__label">${Utils.esc(task.label)}</div>
              <div class="day-task__row">
                <span class="day-task__time">${Utils.formatHour(task.hour, task.minute)}</span>
                ${cat ? `<span class="chip" style="background:${cat.color}1a;color:${cat.color};border:none;">${cat.label}</span>` : ''}
              </div>
              ${entry.note ? `<div class="day-task__note">${Utils.esc(entry.note)}</div>` : ''}
            </div>
          </div>
        `;
      }).join('') : `
        <div class="empty-state" style="padding:32px 0;">
          <span class="empty-state__mark"></span>
          <h2 class="t-title">Sin tareas</h2>
          <p class="t-charcoal">No hay tareas registradas para este día.</p>
        </div>
      `}
    `;

    const backdrop = document.getElementById('day-modal');
    backdrop.classList.add('is-open');
    content.querySelector('[data-action="close-modal"]').addEventListener('click', () => this.closeModal());
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.closeModal();
    });
  },

  closeModal() {
    const backdrop = document.getElementById('day-modal');
    if (backdrop) backdrop.classList.remove('is-open');
  },
};

window.StatsView = StatsView;