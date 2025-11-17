import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const isDarkMode = 
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setTheme(isDarkMode ? 'dark' : 'light');
  }, []);
  
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);
  
  return [theme, toggleTheme];
}
