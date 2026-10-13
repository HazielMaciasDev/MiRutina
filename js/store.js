/* ============================================
   STORE — localStorage CRUD layer
   ============================================ */

const KEYS = {
  TASKS: 'rutina.tasks',
  CATEGORIES: 'rutina.categories',
  LOG: 'rutina.log',
  META: 'rutina.meta',
};

const Store = {
  // ===== Tasks =====
  getTasks() {
    const stored = localStorage.getItem(KEYS.TASKS);
    if (!stored) {
      // seed from defaults
      localStorage.setItem(KEYS.TASKS, JSON.stringify(DEFAULT_TASKS));
      return [...DEFAULT_TASKS];
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [...DEFAULT_TASKS];
    }
  },

  saveTasks(tasks) {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    this.emit('tasks:changed');
  },

  addTask(task) {
    const tasks = this.getTasks();
    task.id = task.id || Utils.uid('task');
    tasks.push(task);
    this.saveTasks(tasks);
    return task;
  },

  removeTask(taskId) {
    const tasks = this.getTasks().filter(t => t.id !== taskId);
    this.saveTasks(tasks);
  },

  updateTask(taskId, patch) {
    const tasks = this.getTasks().map(t =>
      t.id === taskId ? { ...t, ...patch } : t
    );
    this.saveTasks(tasks);
  },

  // ===== Categories =====
  getCategories() {
    const stored = localStorage.getItem(KEYS.CATEGORIES);
    if (!stored) {
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      return [...DEFAULT_CATEGORIES];
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [...DEFAULT_CATEGORIES];
    }
  },

  saveCategories(cats) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(cats));
    this.emit('tasks:changed'); // re-render
  },

  // ===== Log: per-day, per-task =====
  // log[dateKey][taskId] = { done, timestamp, note }
  getLog() {
    const stored = localStorage.getItem(KEYS.LOG);
    return stored ? JSON.parse(stored) : {};
  },

  saveLog(log) {
    localStorage.setItem(KEYS.LOG, JSON.stringify(log));
    this.emit('log:changed');
  },

  getDayLog(dateKey) {
    const log = this.getLog();
    return log[dateKey] || {};
  },

  toggleTaskDone(dateKey, taskId) {
    const log = this.getLog();
    if (!log[dateKey]) log[dateKey] = {};
    const entry = log[dateKey][taskId] || {};
    entry.done = !entry.done;
    entry.timestamp = entry.done ? Date.now() : null;
    log[dateKey][taskId] = entry;
    this.saveLog(log);
    return entry;
  },

  setTaskNote(dateKey, taskId, note) {
    const log = this.getLog();
    if (!log[dateKey]) log[dateKey] = {};
    const entry = log[dateKey][taskId] || {};
    entry.note = note;
    log[dateKey][taskId] = entry;
    this.saveLog(log);
  },

  // ===== Event bus (simple) =====
  _listeners: {},
  on(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  },
  emit(event, payload) {
    (this._listeners[event] || []).forEach(fn => fn(payload));
  },

  // ===== Reset =====
  resetAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    this.emit('tasks:changed');
    this.emit('log:changed');
  },
};

window.Store = Store;
window.DEFAULT_CATEGORIES = DEFAULT_CATEGORIES;
window.DEFAULT_TASKS = DEFAULT_TASKS;