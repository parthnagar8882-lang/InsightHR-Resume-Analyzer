/**
 * theme.js — Dark/Light Mode Toggle with localStorage + backend sync
 */
(function () {
  const STORAGE_KEY = 'resumeiq-theme';

  function getPreferred() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    // Update all toggle buttons
    document.querySelectorAll('.theme-toggle .material-symbols-outlined').forEach(el => {
      el.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    });
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    // Sync to backend (fire-and-forget)
    fetch('/api/theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: next }),
    }).catch(() => {});
  }

  // Apply immediately on load (before DOMContentLoaded to avoid flash)
  applyTheme(getPreferred());

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
  });
})();
