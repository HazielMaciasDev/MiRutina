/* ============================================
   APP — Entry point, router, service worker
   ============================================ */

(function () {
  'use strict';

  // ===== Router =====
  const VIEWS = ['today', 'stats', 'settings'];

  function showView(name) {
    if (!VIEWS.includes(name)) name = 'today';
    document.querySelectorAll('.view').forEach(v => v.classList.remove('is-active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('is-active'));
    const view = document.getElementById(`view-${name}`);
    const tab = document.querySelector(`.tab[data-tab="${name}"]`);
    if (view) view.classList.add('is-active');
    if (tab) tab.classList.add('is-active');
    if (location.hash !== `#${name}`) {
      history.replaceState(null, '', `#${name}`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function handleRoute() {
    const hash = location.hash.replace('#', '');
    showView(hash);
  }

  // ===== Init =====
  function init() {
    // Tab bar
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => showView(tab.dataset.tab));
    });
    window.addEventListener('hashchange', handleRoute);

    // Init views
    TodayView.init();
    StatsView.init();
    SettingsView.init();

    // Initial route
    handleRoute();

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('service-worker.js')
          .then(reg => {
            // When a new SW is installed and waiting, activate it immediately
            // and reload so the user sees the latest version on next visit.
            if (reg.waiting) {
              reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            reg.addEventListener('updatefound', () => {
              const sw = reg.installing;
              if (!sw) return;
              sw.addEventListener('statechange', () => {
                if (sw.state === 'installed' && navigator.serviceWorker.controller) {
                  sw.postMessage({ type: 'SKIP_WAITING' });
                }
              });
            });
          })
          .catch(err => console.warn('SW registration failed:', err));

        // Reload once when the new SW takes control (controllerchanged).
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchanged', () => {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();