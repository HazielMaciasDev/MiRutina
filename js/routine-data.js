/* ============================================
   ROUTINE SEED — Data parsed from RUTINA.MD
   ============================================ */

const DAY_GROUPS = {
  'L-X': { label: 'Lunes y miércoles', dow: [1, 3] },
  'M-J': { label: 'Martes y jueves', dow: [2, 4] },
  V: { label: 'Viernes', dow: [5] },
};

const DEFAULT_CATEGORIES = [
  { id: 'descanso', label: 'Descanso', emoji: '🌙', color: '#b3b3b3' },
  { id: 'hogar', label: 'Hogar', emoji: '🍳', color: '#0091ff' },
  { id: 'estudio', label: 'Estudio', emoji: '🎓', color: '#6647f0' },
  { id: 'aprendizaje', label: 'Aprendizaje', emoji: '📚', color: '#00c07a' },
  { id: 'trabajo', label: 'Trabajo', emoji: '💼', color: '#2a2a2a' },
  { id: 'ejercicio', label: 'Ejercicio', emoji: '💪', color: '#fc6d7b' },
  { id: 'personal', label: 'Personal', emoji: '🎹', color: '#fd9a46' },
];

// Helper to build a task entry: hour can wrap past midnight (e.g. 10:30 pm sleeping)
function t(hour, minute, label, categoryId, dayGroup, opts = {}) {
  return {
    id: `${dayGroup}-${hour}-${minute}-${label}`.toLowerCase().replace(/\s+/g, '-'),
    hour,
    minute,
    label,
    categoryId,
    dayGroup,
    endHour: opts.endHour ?? null,
    endMinute: opts.endMinute ?? null,
  };
}

const DEFAULT_TASKS = [
  // ===== Lunes y miércoles =====
  t(5, 30, 'Despertar', 'descanso', 'L-X', { endHour: 5, endMinute: 33 }),
  t(5, 33, 'Tomar agua', 'descanso', 'L-X', { endHour: 5, endMinute: 40 }),
  t(5, 40, 'Bañarse', 'hogar', 'L-X', { endHour: 5, endMinute: 50 }),
  t(5, 50, 'Vestirse', 'hogar', 'L-X', { endHour: 6, endMinute: 20 }),
  t(6, 20, 'Preparar desayuno', 'hogar', 'L-X', { endHour: 6, endMinute: 30 }),
  t(6, 30, 'Salir de casa', 'hogar', 'L-X', { endHour: 8, endMinute: 30 }),
  t(8, 30, 'Diseño Digital VLSI', 'estudio', 'L-X', { endHour: 8, endMinute: 50 }),
  t(8, 50, 'Desayuno', 'hogar', 'L-X', { endHour: 9, endMinute: 0 }),
  t(9, 0, 'Planeación del día', 'trabajo', 'L-X', { endHour: 9, endMinute: 30 }),
  t(9, 30, 'Inglés', 'aprendizaje', 'L-X', { endHour: 11, endMinute: 0 }),
  t(11, 0, 'Bloque de trabajo', 'trabajo', 'L-X', { endHour: 13, endMinute: 0 }),
  t(13, 0, 'Administración de Proyectos de Software', 'estudio', 'L-X', { endHour: 15, endMinute: 0 }),
  t(15, 0, 'Inteligencia Artificial', 'estudio', 'L-X', { endHour: 15, endMinute: 30 }),
  t(15, 30, 'Regreso a casa', 'hogar', 'L-X', { endHour: 17, endMinute: 30 }),
  t(17, 30, 'Gimnasio', 'ejercicio', 'L-X', { endHour: 18, endMinute: 30 }),
  t(18, 30, 'Ducha + arreglo post-gimnasio', 'hogar', 'L-X', { endHour: 19, endMinute: 20 }),
  t(19, 20, 'Preparar comida', 'hogar', 'L-X', { endHour: 20, endMinute: 0 }),
  t(20, 0, 'Bloque de trabajo', 'trabajo', 'L-X', { endHour: 20, endMinute: 30 }),
  t(20, 30, 'Bloque de aprendizaje (cursos)', 'aprendizaje', 'L-X', { endHour: 21, endMinute: 30 }),
  t(21, 30, 'Bloque de trabajo', 'trabajo', 'L-X', { endHour: 22, endMinute: 0 }),
  t(22, 0, 'Curso de piano', 'personal', 'L-X', { endHour: 22, endMinute: 30 }),
  t(22, 30, 'Quehaceres / rutina de limpieza', 'hogar', 'L-X', { endHour: 22, endMinute: 30 }),
  t(22, 30, 'Dormir', 'descanso', 'L-X', { endHour: 23, endMinute: 59 }),

  // ===== Martes y jueves =====
  t(5, 30, 'Despertar', 'descanso', 'M-J', { endHour: 5, endMinute: 33 }),
  t(5, 33, 'Tomar agua', 'descanso', 'M-J', { endHour: 5, endMinute: 40 }),
  t(5, 40, 'Bañarse', 'hogar', 'M-J', { endHour: 5, endMinute: 50 }),
  t(5, 50, 'Vestirse', 'hogar', 'M-J', { endHour: 6, endMinute: 20 }),
  t(6, 20, 'Preparar desayuno', 'hogar', 'M-J', { endHour: 6, endMinute: 30 }),
  t(6, 30, 'Salir de casa', 'hogar', 'M-J', { endHour: 9, endMinute: 0 }),
  t(9, 0, 'Lab. Circuitos Eléctricos (Mar) / Diseño Digital VLSI (Jue)', 'estudio', 'M-J', { endHour: 10, endMinute: 30 }),
  t(10, 30, 'Sistemas de Comunicaciones', 'estudio', 'M-J', { endHour: 11, endMinute: 0 }),
  t(11, 0, 'Regreso a casa', 'hogar', 'M-J', { endHour: 12, endMinute: 30 }),
  t(12, 30, 'Gimnasio', 'ejercicio', 'M-J', { endHour: 13, endMinute: 0 }),
  t(13, 0, 'Ducha + arreglo post-gimnasio', 'hogar', 'M-J', { endHour: 14, endMinute: 0 }),
  t(14, 0, 'Preparar de comer', 'hogar', 'M-J', { endHour: 14, endMinute: 30 }),
  t(14, 30, 'Inglés', 'aprendizaje', 'M-J', { endHour: 15, endMinute: 0 }),
  t(15, 0, 'Planeación del día', 'trabajo', 'M-J', { endHour: 16, endMinute: 0 }),
  t(16, 0, 'Bloque de trabajo', 'trabajo', 'M-J', { endHour: 17, endMinute: 30 }),
  t(17, 30, 'Bloque de trabajo', 'trabajo', 'M-J', { endHour: 18, endMinute: 0 }),
  t(18, 0, 'Francés', 'aprendizaje', 'M-J', { endHour: 19, endMinute: 0 }),
  t(19, 0, 'Bloque de trabajo', 'trabajo', 'M-J', { endHour: 19, endMinute: 45 }),
  t(19, 45, 'Cena', 'hogar', 'M-J', { endHour: 20, endMinute: 30 }),
  t(20, 30, 'Piano', 'personal', 'M-J', { endHour: 21, endMinute: 0 }),
  t(21, 0, 'Bloque de trabajo', 'trabajo', 'M-J', { endHour: 22, endMinute: 15 }),
  t(22, 15, 'Bloque de aprendizaje (cursos)', 'aprendizaje', 'M-J', { endHour: 22, endMinute: 30 }),
  t(22, 30, 'Quehaceres / rutina de limpieza', 'hogar', 'M-J', { endHour: 22, endMinute: 30 }),
  t(22, 30, 'Dormir', 'descanso', 'M-J', { endHour: 23, endMinute: 59 }),

  // ===== Viernes =====
  t(5, 30, 'Despertar', 'descanso', 'V', { endHour: 5, endMinute: 33 }),
  t(5, 33, 'Tomar agua', 'descanso', 'V', { endHour: 5, endMinute: 40 }),
  t(5, 40, 'Bañarse', 'hogar', 'V', { endHour: 5, endMinute: 50 }),
  t(5, 50, 'Vestirse', 'hogar', 'V', { endHour: 6, endMinute: 20 }),
  t(6, 20, 'Preparar desayuno', 'hogar', 'V', { endHour: 6, endMinute: 30 }),
  t(6, 30, 'Salir de casa', 'hogar', 'V', { endHour: 9, endMinute: 0 }),
  t(9, 0, 'Lab. Sistemas de Comunicaciones', 'estudio', 'V', { endHour: 10, endMinute: 30 }),
  t(10, 30, 'Circuitos Eléctricos', 'estudio', 'V', { endHour: 11, endMinute: 0 }),
  t(11, 0, 'Regreso a casa', 'hogar', 'V', { endHour: 12, endMinute: 30 }),
  t(12, 30, 'Gimnasio', 'ejercicio', 'V', { endHour: 13, endMinute: 0 }),
  t(13, 0, 'Ducha + arreglo post-gimnasio', 'hogar', 'V', { endHour: 14, endMinute: 0 }),
  t(14, 0, 'Preparar de comer', 'hogar', 'V', { endHour: 14, endMinute: 30 }),
  t(14, 30, 'Inglés', 'aprendizaje', 'V', { endHour: 15, endMinute: 0 }),
  t(15, 0, 'Planeación del día', 'trabajo', 'V', { endHour: 16, endMinute: 0 }),
  t(16, 0, 'Bloque de trabajo', 'trabajo', 'V', { endHour: 17, endMinute: 30 }),
  t(17, 30, 'Bloque de trabajo', 'trabajo', 'V', { endHour: 18, endMinute: 0 }),
  t(18, 0, 'Francés', 'aprendizaje', 'V', { endHour: 19, endMinute: 0 }),
  t(19, 0, 'Bloque de trabajo', 'trabajo', 'V', { endHour: 19, endMinute: 45 }),
  t(19, 45, 'Cena', 'hogar', 'V', { endHour: 20, endMinute: 30 }),
  t(20, 30, 'Piano', 'personal', 'V', { endHour: 21, endMinute: 0 }),
  t(21, 0, 'Bloque de trabajo', 'trabajo', 'V', { endHour: 22, endMinute: 15 }),
  t(22, 15, 'Bloque de aprendizaje (cursos)', 'aprendizaje', 'V', { endHour: 22, endMinute: 30 }),
  t(22, 30, 'Quehaceres / rutina de limpieza', 'hogar', 'V', { endHour: 22, endMinute: 30 }),
  t(22, 30, 'Dormir', 'descanso', 'V', { endHour: 23, endMinute: 59 }),
];