import { useEffect, useState } from 'react';
import { updateTheme } from '.';
import { ThemeProviderContext, type Theme } from './hooks';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export default function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    updateTheme(theme);

    const mql = matchMedia('(prefers-color-scheme: dark)');
    const event = 'change';
    const handleMql = () => updateTheme(theme);

    mql.addEventListener(event, handleMql);

    return () => {
      mql.removeEventListener(event, handleMql);
    };
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}
    </ThemeProviderContext>
  );
}
