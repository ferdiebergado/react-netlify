import { useEffect, useState, type ReactNode } from 'react';
import { updateTheme } from '.';
import { ThemeProviderContext, type Theme } from './hooks';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () =>
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      (localStorage.getItem(storageKey) ?? defaultTheme) as Theme,
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
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}
    </ThemeProviderContext>
  );
}
