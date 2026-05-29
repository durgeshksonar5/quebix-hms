import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
