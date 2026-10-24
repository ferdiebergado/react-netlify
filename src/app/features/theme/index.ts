import type { Theme } from './hooks';

export function updateTheme(theme: Theme) {
  const mql = matchMedia('(prefers-color-scheme: dark)');
  const isDark = theme === 'dark' || (theme === 'system' && mql.matches);
  document.documentElement.classList.toggle('dark', isDark);
}

export function loadTheme() {
  const savedTheme = localStorage.getItem('vite-ui-theme');
  if (
    savedTheme === 'dark' ||
    savedTheme === 'light' ||
    savedTheme === 'system'
  ) {
    updateTheme(savedTheme);
  } else {
    updateTheme('system');
  }
}
