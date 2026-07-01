(() => {
  const theme = localStorage.getItem('vite-ui-theme') || 'system';
  const mql = matchMedia('(prefers-color-scheme: dark)');
  const isDark = theme === 'dark' || (theme === 'system' && mql.matches);
  document.documentElement.classList.toggle('dark', isDark);
})();
