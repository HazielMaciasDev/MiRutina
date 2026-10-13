/* ============================================
   ROUTINE SEED — Data parsed from RUTINA.MD
   ============================================ */

const DAY_GROUPS = {
  'L-X': { label: 'Lunes y miércoles', dow: [1, 3] },
  'M-J': { label: 'Martes y jueves', dow: [2, 4] },
  V: { label: 'Viernes', dow: [5] },
};

const DEFAULT_CATEGORIES = [
  { id: 'descanso', label: 'Descanso', color: '#b3b3b3' },
  { id: 'hogar', label: 'Hogar', color: '#0091ff' },
  { id: 'estudio', label: 'Estudio', color: '#6647f0' },
  { id: 'aprendizaje', label: 'Aprendizaje', color: '#00c07a' },
  { id: 'trabajo', label: 'Trabajo', color: '#2a2a2a' },
  { id: 'ejercicio', label: 'Ejercicio', color: '#fc6d7b' },
  { id: 'personal', label: 'Personal', color: '#fd9a46' },
];

// Helper to build a task entry. Each task carries the list of dayIndexes (0=Sun..6=Sat) it applies to.
function t(hour, minute, label, categoryId, dayIndexes, opts = {}) {
  return {
    id: `${dayIndexes.join('-')}-${hour}-${minute}-${label}`.toLowerCase().replace(/\s+/g, '-'),
    hour,
    minute,
    label,
    categoryId,
    dayGroups: [...dayIndexes],
    endHour: opts.endHour ?? null,
    endMinute: opts.endMinute ?? null,
  };
}

// Backwards-compatible group codes (used by older seeded data).
// (DAY_GROUPS is defined at the top of the file.)

const DEFAULT_TASKS = [
  // ===== Lunes y miércoles =====
  t(5, 30, 'Despertar', 'descanso', [1, 3], { endHour: 5, endMinute: 33 }),
  t(5, 33, 'Tomar agua', 'descanso', [1, 3], { endHour: 5, endMinute: 40 }),
  t(5, 40, 'Bañarse', 'hogar', [1, 3], { endHour: 5, endMinute: 50 }),
  t(5, 50, 'Vestirse', 'hogar', [1, 3], { endHour: 6, endMinute: 20 }),
  t(6, 20, 'Preparar desayuno', 'hogar', [1, 3], { endHour: 6, endMinute: 30 }),
  t(6, 30, 'Salir de casa', 'hogar', [1, 3], { endHour: 8, endMinute: 30 }),
  t(8, 30, 'Diseño Digital VLSI', 'estudio', [1, 3], { endHour: 8, endMinute: 50 }),
  t(8, 50, 'Desayuno', 'hogar', [1, 3], { endHour: 9, endMinute: 0 }),
  t(9, 0, 'Planeación del día', 'trabajo', [1, 3], { endHour: 9, endMinute: 30 }),
  t(9, 30, 'Inglés', 'aprendizaje', [1, 3], { endHour: 11, endMinute: 0 }),
  t(11, 0, 'Bloque de trabajo', 'trabajo', [1, 3], { endHour: 13, endMinute: 0 }),
  t(13, 0, 'Administración de Proyectos de Software', 'estudio', [1, 3], { endHour: 15, endMinute: 0 }),
  t(15, 0, 'Inteligencia Artificial', 'estudio', [1, 3], { endHour: 15, endMinute: 30 }),
  t(15, 30, 'Regreso a casa', 'hogar', [1, 3], { endHour: 17, endMinute: 30 }),
  t(17, 30, 'Gimnasio', 'ejercicio', [1, 3], { endHour: 18, endMinute: 30 }),
  t(18, 30, 'Ducha + arreglo post-gimnasio', 'hogar', [1, 3], { endHour: 19, endMinute: 20 }),
  t(19, 20, 'Preparar comida', 'hogar', [1, 3], { endHour: 20, endMinute: 0 }),
  t(20, 0, 'Bloque de trabajo', 'trabajo', [1, 3], { endHour: 20, endMinute: 30 }),
  t(20, 30, 'Bloque de aprendizaje (cursos)', 'aprendizaje', [1, 3], { endHour: 21, endMinute: 30 }),
  t(21, 30, 'Bloque de trabajo', 'trabajo', [1, 3], { endHour: 22, endMinute: 0 }),
  t(22, 0, 'Curso de piano', 'personal', [1, 3], { endHour: 22, endMinute: 30 }),
  t(22, 30, 'Quehaceres / rutina de limpieza', 'hogar', [1, 3], { endHour: 22, endMinute: 30 }),
  t(22, 30, 'Dormir', 'descanso', [1, 3], { endHour: 23, endMinute: 59 }),

  // ===== Martes y jueves =====
  t(5, 30, 'Despertar', 'descanso', [2, 4], { endHour: 5, endMinute: 33 }),
  t(5, 33, 'Tomar agua', 'descanso', [2, 4], { endHour: 5, endMinute: 40 }),
  t(5, 40, 'Bañarse', 'hogar', [2, 4], { endHour: 5, endMinute: 50 }),
  t(5, 50, 'Vestirse', 'hogar', [2, 4], { endHour: 6, endMinute: 20 }),
  t(6, 20, 'Preparar desayuno', 'hogar', [2, 4], { endHour: 6, endMinute: 30 }),
  t(6, 30, 'Salir de casa', 'hogar', [2, 4], { endHour: 9, endMinute: 0 }),
  t(9, 0, 'Lab. Circuitos Eléctricos (Mar) / Diseño Digital VLSI (Jue)', 'estudio', [2, 4], { endHour: 10, endMinute: 30 }),
  t(10, 30, 'Sistemas de Comunicaciones', 'estudio', [2, 4], { endHour: 11, endMinute: 0 }),
  t(11, 0, 'Regreso a casa', 'hogar', [2, 4], { endHour: 12, endMinute: 30 }),
  t(12, 30, 'Gimnasio', 'ejercicio', [2, 4], { endHour: 13, endMinute: 0 }),
  t(13, 0, 'Ducha + arreglo post-gimnasio', 'hogar', [2, 4], { endHour: 14, endMinute: 0 }),
  t(14, 0, 'Preparar de comer', 'hogar', [2, 4], { endHour: 14, endMinute: 30 }),
  t(14, 30, 'Inglés', 'aprendizaje', [2, 4], { endHour: 15, endMinute: 0 }),
  t(15, 0, 'Planeación del día', 'trabajo', [2, 4], { endHour: 16, endMinute: 0 }),
  t(16, 0, 'Bloque de trabajo', 'trabajo', [2, 4], { endHour: 17, endMinute: 30 }),
  t(17, 30, 'Bloque de trabajo', 'trabajo', [2, 4], { endHour: 18, endMinute: 0 }),
  t(18, 0, 'Francés', 'aprendizaje', [2, 4], { endHour: 19, endMinute: 0 }),
  t(19, 0, 'Bloque de trabajo', 'trabajo', [2, 4], { endHour: 19, endMinute: 45 }),
  t(19, 45, 'Cena', 'hogar', [2, 4], { endHour: 20, endMinute: 30 }),
  t(20, 30, 'Piano', 'personal', [2, 4], { endHour: 21, endMinute: 0 }),
  t(21, 0, 'Bloque de trabajo', 'trabajo', [2, 4], { endHour: 22, endMinute: 15 }),
  t(22, 15, 'Bloque de aprendizaje (cursos)', 'aprendizaje', [2, 4], { endHour: 22, endMinute: 30 }),
  t(22, 30, 'Quehaceres / rutina de limpieza', 'hogar', [2, 4], { endHour: 22, endMinute: 30 }),
  t(22, 30, 'Dormir', 'descanso', [2, 4], { endHour: 23, endMinute: 59 }),

  // ===== Viernes =====
  t(5, 30, 'Despertar', 'descanso', [5], { endHour: 5, endMinute: 33 }),
  t(5, 33, 'Tomar agua', 'descanso', [5], { endHour: 5, endMinute: 40 }),
  t(5, 40, 'Bañarse', 'hogar', [5], { endHour: 5, endMinute: 50 }),
  t(5, 50, 'Vestirse', 'hogar', [5], { endHour: 6, endMinute: 20 }),
  t(6, 20, 'Preparar desayuno', 'hogar', [5], { endHour: 6, endMinute: 30 }),
  t(6, 30, 'Salir de casa', 'hogar', [5], { endHour: 9, endMinute: 0 }),
  t(9, 0, 'Lab. Sistemas de Comunicaciones', 'estudio', [5], { endHour: 10, endMinute: 30 }),
  t(10, 30, 'Circuitos Eléctricos', 'estudio', [5], { endHour: 11, endMinute: 0 }),
  t(11, 0, 'Regreso a casa', 'hogar', [5], { endHour: 12, endMinute: 30 }),
  t(12, 30, 'Gimnasio', 'ejercicio', [5], { endHour: 13, endMinute: 0 }),
  t(13, 0, 'Ducha + arreglo post-gimnasio', 'hogar', [5], { endHour: 14, endMinute: 0 }),
  t(14, 0, 'Preparar de comer', 'hogar', [5], { endHour: 14, endMinute: 30 }),
  t(14, 30, 'Inglés', 'aprendizaje', [5], { endHour: 15, endMinute: 0 }),
  t(15, 0, 'Planeación del día', 'trabajo', [5], { endHour: 16, endMinute: 0 }),
  t(16, 0, 'Bloque de trabajo', 'trabajo', [5], { endHour: 17, endMinute: 30 }),
  t(17, 30, 'Bloque de trabajo', 'trabajo', [5], { endHour: 18, endMinute: 0 }),
  t(18, 0, 'Francés', 'aprendizaje', [5], { endHour: 19, endMinute: 0 }),
  t(19, 0, 'Bloque de trabajo', 'trabajo', [5], { endHour: 19, endMinute: 45 }),
  t(19, 45, 'Cena', 'hogar', [5], { endHour: 20, endMinute: 30 }),
  t(20, 30, 'Piano', 'personal', [5], { endHour: 21, endMinute: 0 }),
  t(21, 0, 'Bloque de trabajo', 'trabajo', [5], { endHour: 22, endMinute: 15 }),
  t(22, 15, 'Bloque de aprendizaje (cursos)', 'aprendizaje', [5], { endHour: 22, endMinute: 30 }),
  t(22, 30, 'Quehaceres / rutina de limpieza', 'hogar', [5], { endHour: 22, endMinute: 30 }),
  t(22, 30, 'Dormir', 'descanso', [5], { endHour: 23, endMinute: 59 }),
];