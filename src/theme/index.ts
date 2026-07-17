import type { Theme } from './hooks';

export function updateTheme(theme: Theme) {
  const mql = matchMedia('(prefers-color-scheme: dark)');
  const isDark = theme === 'dark' || (theme === 'system' && mql.matches);
  document.documentElement.classList.toggle('dark', isDark);
}

export function loadTheme() {
  const savedTheme =
    (localStorage.getItem('vite-ui-theme') as Theme) || 'system';
  updateTheme(savedTheme);
}
