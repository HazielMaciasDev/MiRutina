# Mi Rutina

Tracker de rutina diaria de **lunes a viernes** con notas, historial y estadísticas. Local-first, mobile-first, instalable como PWA en iOS.

## ✨ Features

- **Hoy** — Checklist de tu rutina organizada por bloques del día (Mañana / Tarde / Noche) con hora y categoría.
- **Notas por tarea** — Cada tarea tiene su propia nota breve.
- **Estadísticas** — Racha de días perfectos, % semanal, total tareas hechas, mejor día de la semana, cumplimiento por categoría.
- **Calendario histórico** — Mes a mes, con puntos verdes en días completados y modal de detalle por día.
- **PWA** — Instálala desde Safari → Compartir → "Añadir a pantalla de inicio" en iPhone. Funciona offline.
- **Sin backend** — Todo se guarda en `localStorage` del navegador.

## 🚀 Stack

- HTML5 + CSS3 + Vanilla JS (sin frameworks, sin build step)
- Diseño basado en `DESIGN.MD` (ClickUp-style: Plus Jakarta Sans, pills 9999px, conic gradient border)
- Datos seed desde `RUTINA.MD` (parseado a JS en `js/routine-data.js`)

## 📁 Estructura

```
.
├── index.html              # Entry point + tabbar + PWA meta
├── manifest.json           # PWA manifest
├── service-worker.js       # Cache PWA
├── css/
│   ├── tokens.css          # Variables de DESIGN.MD
│   ├── base.css            # Reset + tipografía + layout
│   ├── components.css      # Botones, cards, pills, tabbar, FAB
│   └── views.css           # Estilos específicos por vista
├── js/
│   ├── routine-data.js     # Seed desde RUTINA.MD (Lunes-X, Martes-Y, Viernes)
│   ├── utils.js            # Helpers de fecha
│   ├── store.js            # Capa localStorage (tasks, log, categories)
│   ├── stats.js            # Cálculos: rachas, %, categorías
│   ├── today.js            # Vista Hoy
│   ├── calendar.js         # Vista Stats + Calendar
│   ├── settings.js         # Vista Ajustes
│   └── app.js              # Router + init
├── assets/
│   ├── icon-192.png
│   └── icon-512.png
├── scripts/
│   └── make-icons.js       # Regenera iconos (requiere `npm install`)
├── DESIGN.MD               # Sistema de diseño
├── RUTINA.MD               # Tu fuente de datos (la rutina original)
└── README.md
```

## 🌐 Deploy en GitHub Pages

1. Sube el repo a GitHub (branch `main`).
2. **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` / root.
3. Espera 1-2 min. Tu app estará en `https://<usuario>.github.io/MiRutina/`.

> El service worker sólo funciona sobre HTTPS o `localhost`. GitHub Pages usa HTTPS por defecto ✓.

## 📱 Instalar como app en iPhone

1. Abre la URL en **Safari** (no Chrome).
2. Toca el botón **Compartir** → **Añadir a pantalla de inicio**.
3. Confirma el nombre. Aparecerá un icono propio, splash blanco y la app en modo standalone (sin barra de Safari).

## ✏️ Editar la rutina

Los datos originales viven en `js/routine-data.js`. Cada tarea tiene:

```js
t(hora, minuto, 'Etiqueta', 'categoriaId', 'L-X' | 'M-J' | 'V', {
  endHour, endMinute  // para mostrar duración implícita
})
```

Categorías en `DEFAULT_CATEGORIES` (mismo archivo). Después de editar, recarga el navegador.

**Alternativa:** ve a la pestaña **Ajustes** de la app y edita/añade tareas visualmente (se persisten en localStorage). Para volver a la rutina original usa el botón **"Restaurar rutina original"**.

## 🧪 Regenerar iconos

```bash
npm install
node scripts/make-icons.js
```

Genera `assets/icon-192.png` y `assets/icon-512.png` con la marca "R" y gradiente primario.

## 🗺️ Roadmap

- [ ] Drag & drop para reordenar tareas en Ajustes
- [ ] Heatmap anual estilo GitHub
- [ ] Exportar / importar datos (JSON)
- [ ] Notificaciones push (con permiso del usuario)
- [ ] Modo oscuro (requeriría actualizar DESIGN.MD)

## 📝 Créditos

Diseño basado en `DESIGN.MD` (ClickUp™ style reference).
Datos de rutina personal del usuario (`RUTINA.MD`).