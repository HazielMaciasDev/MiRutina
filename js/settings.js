/* ============================================
   SETTINGS VIEW — manage tasks + categories
   ============================================ */

const SettingsView = {
  el: null,
  activeDayGroup: 'L-X',

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

    const filtered = tasks.filter(t => t.dayGroup === this.activeDayGroup);

    this.el.innerHTML = `
      <header class="topbar">
        <div class="topbar-meta">
          <span class="t-mono">Ajustes</span>
          <h1 class="t-h">Tu rutina</h1>
        </div>
      </header>

      <div class="daygroup-tabs">
        ${Object.keys(DAY_GROUPS).map(g => `
          <div class="daygroup-tab ${g === this.activeDayGroup ? 'is-active' : ''}" data-group="${g}">
            ${DAY_GROUPS[g].label}
          </div>
        `).join('')}
      </div>

      <section class="settings-section">
        <div class="settings-section__head">
          <span class="settings-section__title">${DAY_GROUPS[this.activeDayGroup].label} (${filtered.length})</span>
        </div>
        <div id="task-edit-list">
          ${filtered.map(t => this.renderTaskEdit(t, cats)).join('')}
        </div>
        <form class="add-task-form" id="add-task-form">
          <input type="time" class="input" id="new-task-time" required />
          <input type="text" class="input" id="new-task-label" placeholder="Nueva tarea…" required />
          <select class="input" id="new-task-cat" required>
            ${cats.map(c => `<option value="${c.id}">${c.emoji} ${c.label}</option>`).join('')}
          </select>
        </form>
        <button class="btn btn--primary btn--block" style="margin-top:12px;" data-action="add-task">+ Añadir tarea</button>
      </section>

      <section class="settings-section">
        <div class="settings-section__head">
          <span class="settings-section__title">Categorías</span>
        </div>
        <div>
          ${cats.map(c => this.renderCategory(c)).join('')}
        </div>
      </section>

      <section class="settings-section">
        <div class="settings-section__head">
          <span class="settings-section__title">Datos</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <button class="btn btn--ghost btn--block" data-action="reset">Borrar todos los datos</button>
          <button class="btn btn--ghost btn--block" data-action="seed">Restaurar rutina original</button>
        </div>
      </section>

      <div class="about">
        <div class="about__name">Mi Rutina</div>
        <div class="about__sub">v1.0 · Local-first · L-V tracker</div>
      </div>
    `;

    this.bindEvents();
  },

  renderTaskEdit(task, cats) {
    const cat = cats.find(c => c.id === task.categoryId);
    return `
      <div class="task-edit" data-task-id="${task.id}">
        <span class="task-edit__time">${Utils.formatHour(task.hour, task.minute)}</span>
        <span class="task-edit__label">${Utils.esc(task.label)}</span>
        <span class="task-edit__cat pill" style="background:${cat?.color}1a;color:${cat?.color};border:none;">
          ${cat?.emoji}
        </span>
        <button class="task-edit__remove" data-action="remove-task" aria-label="Eliminar">✕</button>
      </div>
    `;
  },

  renderCategory(c) {
    return `
      <div class="cat-edit" data-cat-id="${c.id}">
        <span class="cat-edit__swatch" style="background:${c.color};"></span>
        <span class="cat-edit__emoji">${c.emoji}</span>
        <span class="cat-edit__name">${Utils.esc(c.label)}</span>
      </div>
    `;
  },

  bindEvents() {
    // Day group tabs
    this.el.querySelectorAll('.daygroup-tab').forEach(t => {
      t.addEventListener('click', () => {
        this.activeDayGroup = t.dataset.group;
        this.render();
      });
    });

    // Remove task
    this.el.querySelectorAll('[data-action="remove-task"]').forEach(b => {
      b.addEventListener('click', () => {
        const taskId = b.closest('.task-edit').dataset.taskId;
        if (confirm('¿Eliminar esta tarea?')) {
          Store.removeTask(taskId);
        }
      });
    });

    // Add task
    this.el.querySelector('[data-action="add-task"]').addEventListener('click', () => {
      const time = this.el.querySelector('#new-task-time').value;
      const label = this.el.querySelector('#new-task-label').value.trim();
      const catId = this.el.querySelector('#new-task-cat').value;
      if (!time || !label) return alert('Completa la hora y el nombre.');
      const [h, m] = time.split(':').map(Number);
      Store.addTask({
        hour: h,
        minute: m,
        label,
        categoryId: catId,
        dayGroup: this.activeDayGroup,
        endHour: h,
        endMinute: m + 30,
      });
      this.el.querySelector('#new-task-label').value = '';
    });

    // Reset
    this.el.querySelector('[data-action="reset"]').addEventListener('click', () => {
      if (confirm('Esto borrará TODO tu historial y configuración. ¿Continuar?')) {
        Store.resetAll();
        this.activeDayGroup = 'L-X';
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