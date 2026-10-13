/* ============================================
   SETTINGS VIEW — manage tasks + categories (per day)
   ============================================ */

const SettingsView = {
  el: null,
  editingId: null,

  init() {
    this.el = document.getElementById('view-settings');
    Store.on('tasks:changed', () => this.render());
    Store.on('log:changed', () => this.render());
    this.render();
  },

  render() {
    if (!this.el) return;
    const tasks = Store.getTasks();
    const cats = Store.getCategories();

    this.el.innerHTML = `
      <header class="settings-header">
        <span class="settings-header__eyebrow">Ajustes</span>
        <h1 class="settings-header__title">Tu rutina</h1>
      </header>
      <hr class="settings-header__rule" />

      <div class="settings">
        ${this.renderAllDays(tasks, cats)}

        <section class="settings-section">
          <div class="settings-section__head">
            <span class="settings-section__title">Categorías</span>
            <span class="settings-section__rule"></span>
          </div>
          <div>
            ${cats.map(c => this.renderCategory(c)).join('')}
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section__head">
            <span class="settings-section__title">Datos</span>
            <span class="settings-section__rule"></span>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <button class="btn btn--ghost btn--block" data-action="reset">Borrar todos los datos</button>
            <button class="btn btn--ghost btn--block" data-action="seed">Restaurar rutina original</button>
          </div>
        </section>

        <div class="about">
          <div class="about__eyebrow">Mi Rutina</div>
          <div class="about__name">v1.0</div>
          <div class="about__sub">Local-first · Tracker L-V</div>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  // ===== Days =====
  // dayIndex: 0=Domingo ... 6=Sábado. We display Lun..Dom.
  getDisplayDays() {
    return [
      { key: 1, label: 'Lunes' },
      { key: 2, label: 'Martes' },
      { key: 3, label: 'Miércoles' },
      { key: 4, label: 'Jueves' },
      { key: 5, label: 'Viernes' },
      { key: 6, label: 'Sábado' },
      { key: 0, label: 'Domingo' },
    ];
  },

  // Map a dayIndex (0..6) to the dayGroup code used in stored tasks.
  // By default: L-X means Mon or Wed (idx 1,3). M-J means Tue/Thu (2,4). V means Fri (5).
  // If a user edits tasks, the task carries its own dayGroup. So the same task can appear
  // under two days. We render a task once per day it applies to.
  renderAllDays(tasks, cats) {
    return `
      <section class="settings-section">
        <div class="settings-section__head">
          <span class="settings-section__title">Tareas por día</span>
          <span class="settings-section__rule"></span>
        </div>
        ${this.getDisplayDays().map(day => {
          const applicableTasks = tasks
            .filter(t => this.taskAppliesTo(t, day.key))
            .sort((a, b) => (a.hour - b.hour) || (a.minute - b.minute));
          return `
            <div class="day-section">
              <div class="day-section__head">
                <span class="day-section__title">${day.label}</span>
                <span class="day-section__count">${applicableTasks.length} ${applicableTasks.length === 1 ? 'tarea' : 'tareas'}</span>
              </div>
              <div class="day-section__rule"></div>
              <div class="day-section__list" data-day="${day.key}">
                ${applicableTasks.map(t => this.renderTaskEdit(t, cats, day.key)).join('')}
              </div>
              <form class="add-task-inline" data-day="${day.key}">
                <input type="time" class="input add-task-inline__time" required />
                <input type="text" class="input add-task-inline__label" placeholder="Nueva tarea…" required />
                <select class="select add-task-inline__cat" required>
                  ${cats.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}
                </select>
                <button type="submit" class="btn btn--primary btn--sm">Añadir</button>
              </form>
            </div>
          `;
        }).join('')}
      </section>
    `;
  },

  taskAppliesTo(task, dayIdx) {
    const groups = task.dayGroups && task.dayGroups.length
      ? task.dayGroups
      : this.legacyGroupToDays(task.dayGroup);
    return groups.includes(dayIdx);
  },

  // Backward compatibility for the original seed which used dayGroup codes.
  legacyGroupToDays(code) {
    switch (code) {
      case 'L-X': return [1, 3];
      case 'M-J': return [2, 4];
      case 'V':   return [5];
      default:     return [];
    }
  },

  // ===== Renderers =====
  renderTaskEdit(task, cats, dayIdx) {
    const cat = cats.find(c => c.id === task.categoryId);
    const isEditing = this.editingId === task.id;
    if (isEditing) {
      return `
        <div class="task-edit task-edit--editing" data-task-id="${task.id}">
          <div class="task-edit__form">
            <input type="time" class="input" data-field="time" value="${task.hour}:${String(task.minute).padStart(2,'0')}" />
            <input type="text" class="input" data-field="label" value="${Utils.esc(task.label)}" />
            <select class="select" data-field="cat">
              ${cats.map(c => `<option value="${c.id}" ${c.id === task.categoryId ? 'selected' : ''}>${c.label}</option>`).join('')}
            </select>
            <div class="task-edit__form-actions">
              <button class="btn btn--primary btn--sm" data-action="save-edit">Guardar</button>
              <button class="btn btn--quiet btn--sm" data-action="cancel-edit">Cancelar</button>
            </div>
          </div>
        </div>
      `;
    }
    return `
      <div class="task-edit" data-task-id="${task.id}" data-day="${dayIdx}">
        <span class="task-edit__time">${Utils.formatHour(task.hour, task.minute)}</span>
        <span class="task-edit__label">${Utils.esc(task.label)}</span>
        ${cat ? `<span class="chip" style="background:${cat.color}1a;color:${cat.color};border:none;">${cat.label}</span>` : ''}
        <div class="task-edit__actions">
          <button class="task-edit__icon" data-action="edit-task" aria-label="Editar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="task-edit__icon" data-action="remove-task" aria-label="Eliminar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  },

  renderCategory(c) {
    return `
      <div class="cat-edit" data-cat-id="${c.id}">
        <span class="cat-edit__swatch" style="background:${c.color};"></span>
        <span class="cat-edit__name">${Utils.esc(c.label)}</span>
      </div>
    `;
  },

  // ===== Events =====
  bindEvents() {
    // Add task (per day form)
    this.el.querySelectorAll('.add-task-inline').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const dayIdx = Number(form.dataset.day);
        const time = form.querySelector('.add-task-inline__time').value;
        const label = form.querySelector('.add-task-inline__label').value.trim();
        const catId = form.querySelector('.add-task-inline__cat').value;
        if (!time || !label) return;
        const [h, m] = time.split(':').map(Number);
        // New task applies ONLY to the day it was added on.
        Store.addTask({
          hour: h,
          minute: m,
          label,
          categoryId: catId,
          dayGroups: [dayIdx],
        });
        form.querySelector('.add-task-inline__label').value = '';
        form.querySelector('.add-task-inline__time').value = '';
      });
    });

    // Edit / Save / Cancel / Remove
    this.el.querySelectorAll('[data-action="edit-task"]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.closest('.task-edit').dataset.taskId;
        this.editingId = id;
        this.render();
      });
    });

    this.el.querySelectorAll('[data-action="cancel-edit"]').forEach(b => {
      b.addEventListener('click', () => {
        this.editingId = null;
        this.render();
      });
    });

    this.el.querySelectorAll('[data-action="save-edit"]').forEach(b => {
      b.addEventListener('click', () => {
        const root = b.closest('.task-edit');
        const id = root.dataset.taskId;
        const time = root.querySelector('[data-field="time"]').value;
        const label = root.querySelector('[data-field="label"]').value.trim();
        const cat = root.querySelector('[data-field="cat"]').value;
        if (!time || !label) return alert('Completa la hora y el nombre.');
        const [h, m] = time.split(':').map(Number);
        Store.updateTask(id, {
          hour: h, minute: m, label, categoryId: cat,
        });
        this.editingId = null;
      });
    });

    this.el.querySelectorAll('[data-action="remove-task"]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.closest('.task-edit').dataset.taskId;
        if (confirm('¿Eliminar esta tarea?')) {
          Store.removeTask(id);
        }
      });
    });

    // Reset
    this.el.querySelector('[data-action="reset"]').addEventListener('click', () => {
      if (confirm('Esto borrará TODO tu historial y configuración. ¿Continuar?')) {
        Store.resetAll();
        this.editingId = null;
      }
    });

    // Seed
    this.el.querySelector('[data-action="seed"]').addEventListener('click', () => {
      if (confirm('Esto restaurará las tareas originales desde RUTINA.MD. ¿Continuar?')) {
        localStorage.removeItem('rutina.tasks');
        localStorage.removeItem('rutina.categories');
        Store.emit('tasks:changed');
      }
    });
  },
};

window.SettingsView = SettingsView;