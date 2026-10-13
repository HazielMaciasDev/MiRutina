/* ============================================
   TODAY VIEW — main routine checklist
   ============================================ */

const TodayView = {
  el: null,

  init() {
    this.el = document.getElementById('view-today');
    Store.on('log:changed', () => this.render());
    Store.on('tasks:changed', () => this.render());
    this.render();
  },

  render() {
    if (!this.el) return;
    const tasks = Store.getTasks();
    const cats = Store.getCategories();
    const now = new Date();
    const group = Utils.dayGroupForDate(now);

    // Render hero
    this.el.innerHTML = `
      <header class="today-hero">
        <span class="today-hero__eyebrow">
          <span class="today-hero__eyebrow-dot"></span>
          ${this.eyebrow()}
        </span>
        <h1 class="today-hero__date">${String(now.getDate()).padStart(2, '0')}</h1>
        <p class="today-hero__sub">${Utils.monthName(now)} · ${Utils.dayName(now)}</p>
        ${group ? this.renderProgress(tasks, group) : this.renderWeekendHero()}
        <hr class="today-hero__rule" />
      </header>

      <section class="day-block">
        ${group
          ? this.renderTaskGroups(tasks, cats, group)
          : this.renderWeekend()}
      </section>
    `;

    this.bindEvents();
  },

  eyebrow() {
    const d = new Date();
    const dow = Utils.dow(d);
    if (dow === 0 || dow === 6) return 'Día de descanso';
    return `Hoy · ${Utils.dayName(d)}`;
  },

  renderProgress(tasks, dayIdx) {
    const todayKey = Utils.todayKey();
    const log = Store.getDayLog(todayKey);
    const dayTasks = Utils.tasksForDay(tasks, dayIdx);
    const done = dayTasks.filter(t => log[t.id]?.done).length;
    const pct = dayTasks.length ? Math.round((done / dayTasks.length) * 100) : 0;
    return `
      <div class="progress" aria-label="Progreso del día">
        <div class="progress__track">
          <div class="progress__fill" style="width: ${pct}%"></div>
        </div>
        <div class="progress__meta">
          <span><strong>${done}</strong> / ${dayTasks.length} hechas</span>
          <span><strong>${pct}%</strong></span>
        </div>
      </div>
    `;
  },

  renderWeekendHero() {
    return `
      <p class="today-hero__sub" style="margin-top:8px;">
        Sábado y domingo no forman parte de la rutina.<br/>Vuelve el lunes.
      </p>
    `;
  },

  renderWeekend() {
    return `
      <div class="empty-state">
        <span class="empty-state__mark"></span>
        <h2 class="t-title">Sin tareas hoy</h2>
        <p class="t-charcoal" style="max-width:320px;">
          Tu rutina vuelve el lunes. Mientras tanto, haz algo que disfrutes.
        </p>
      </div>
    `;
  },

  renderTaskGroups(tasks, cats, dayIdx) {
    const todayKey = Utils.todayKey();
    const log = Store.getDayLog(todayKey);
    const dayTasks = Utils.tasksForDay(tasks, dayIdx)
      .sort((a, b) => (a.hour - b.hour) || (a.minute - b.minute));

    // Group by time of day
    const buckets = {
      Mañana: [],
      Tarde: [],
      Noche: [],
    };
    for (const t of dayTasks) {
      const h = t.hour % 24;
      if (h < 12) buckets.Mañana.push(t);
      else if (h < 18) buckets.Tarde.push(t);
      else buckets.Noche.push(t);
    }

    return Object.entries(buckets)
      .filter(([, list]) => list.length)
      .map(([label, list]) => `
        <div class="day-block">
          <div class="day-block__head">
            <span class="day-block__title">${label}</span>
            <span class="day-block__rule"></span>
          </div>
          <div class="tasks">
            ${list.map(t => this.renderTask(t, cats, log[t.id])).join('')}
          </div>
        </div>
      `).join('');
  },

  renderTask(task, cats, entry) {
    const cat = cats.find(c => c.id === task.categoryId);
    const done = entry?.done;
    const note = entry?.note;
    const time = Utils.formatHour(task.hour, task.minute);
    const catChipClass = cat ? this.catChipClass(cat) : 'chip';
    return `
      <article class="task ${done ? 'is-done' : ''}" data-task-id="${Utils.esc(task.id)}">
        <div class="task__check" data-action="toggle" role="checkbox" tabindex="0">
          <div class="checkbox-circle">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
        <div class="task__body">
          <span class="task__label">${Utils.esc(task.label)}</span>
          <div class="task__meta">
            <span class="${catChipClass}" style="${catStyleAttr(cat)}">${Utils.esc(cat?.label || 'Otro')}</span>
            <span class="task__time">${time}</span>
          </div>
          ${note ? `<p class="task__note-display">${Utils.esc(note)}</p>` : ''}
          <div class="task__note-form">
            <textarea class="textarea" placeholder="Escribe una nota…" data-action="note">${Utils.esc(note || '')}</textarea>
          </div>
        </div>
        <button class="task__expand" data-action="expand" aria-label="Expandir">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </article>
    `;
  },

  catChipClass(cat) {
    // Map category color hue to a base chip variant for the strong tokens.
    const map = {
      '#6ee7b7': 'chip chip--sage',
      '#00c07a': 'chip chip--sage',
      '#0091ff': 'chip chip--indigo',
      '#6647f0': 'chip chip--indigo',
      '#3a4a6b': 'chip chip--indigo',
    };
    return map[cat?.color?.toLowerCase?.()] || 'chip';
  },

  bindEvents() {
    this.el.querySelectorAll('.task').forEach(taskEl => {
      const taskId = taskEl.dataset.taskId;
      taskEl.querySelector('[data-action="toggle"]').addEventListener('click', () => {
        const todayKey = Utils.todayKey();
        Store.toggleTaskDone(todayKey, taskId);
      });
      taskEl.querySelector('[data-action="expand"]').addEventListener('click', (e) => {
        e.stopPropagation();
        taskEl.classList.toggle('is-expanded');
      });
      const noteEl = taskEl.querySelector('[data-action="note"]');
      if (noteEl) {
        let timeout;
        noteEl.addEventListener('input', () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            Store.setTaskNote(Utils.todayKey(), taskId, noteEl.value);
          }, 400);
        });
      }
    });
  },
};

function catStyleAttr(cat) {
  if (!cat) return '';
  // Use a soft tint from the category color
  return `background:${cat.color}1a;color:${cat.color};border:none;`;
}

window.TodayView = TodayView;