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
        <span class="today-hero__eyebrow">${this.eyebrow(group)}</span>
        <h1 class="today-hero__date">
          <span>${now.getDate()}</span>
          <em>${Utils.monthName(now)}</em>
        </h1>
        <p class="today-hero__sub">${Utils.formatLongDate(now)}</p>
        ${group ? this.renderProgress(tasks, group) : this.renderWeekendHero()}
      </header>

      <section class="tasks">
        ${group
          ? this.renderTaskGroups(tasks, cats, group)
          : this.renderWeekend()}
      </section>
    `;

    this.bindEvents();
  },

  eyebrow(group) {
    if (!group) return 'Hoy · Descanso';
    const d = new Date();
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
          <span>${done} / ${dayTasks.length} completadas</span>
          <span>${pct}%</span>
        </div>
      </div>
    `;
  },

  renderWeekendHero() {
    return `
      <p class="today-hero__sub" style="margin-top:8px;color:var(--color-slate);">
        Sábado y domingo no forman parte de la rutina. Descansa, recarga y vuelve el lunes con todo.
      </p>
    `;
  },

  renderWeekend() {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </div>
        <h2 class="t-h-sm">Sin tareas hoy</h2>
        <p class="t-slate" style="max-width:280px;text-align:center;">
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
        <div class="task-group">
          <div class="task-group__title">${label}</div>
          ${list.map(t => this.renderTask(t, cats, log[t.id])).join('')}
        </div>
      `).join('');
  },

  renderTask(task, cats, entry) {
    const cat = cats.find(c => c.id === task.categoryId);
    const done = entry?.done;
    const note = entry?.note;
    const time = Utils.formatHour(task.hour, task.minute);
    return `
      <article class="task ${done ? 'is-done' : ''}" data-task-id="${Utils.esc(task.id)}">
        <div class="task__check" data-action="toggle">
          <div class="checkbox-circle">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
        <div class="task__body">
          <div class="task__row">
            <span class="task__label">${Utils.esc(task.label)}</span>
            <span class="task__time">${time}</span>
          </div>
          <div class="task__meta">
            <span class="pill" style="--c:${cat?.color}20;color:${cat?.color};border-color:transparent;background:${cat?.color}1a;">
              ${Utils.esc(cat?.label || 'Otro')}
            </span>
          </div>
          ${note ? `<p class="task__note">${Utils.esc(note)}</p>` : ''}
          <div class="task__note-input">
            <textarea class="textarea" placeholder="Añadir una nota a esta tarea…" data-action="note">${Utils.esc(note || '')}</textarea>
          </div>
        </div>
        <div class="task__toggle" data-action="expand" aria-label="Expandir">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </article>
    `;
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

window.TodayView = TodayView;