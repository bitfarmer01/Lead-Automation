import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon } from './icons';

export function ThemeToggle() {
  const [theme, toggleTheme] = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors backdrop-blur-sm border border-slate-300 dark:border-slate-700"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <MoonIcon className="w-6 h-6" />
      ) : (
        <SunIcon className="w-6 h-6" />
      )}
    </button>
  );
}
