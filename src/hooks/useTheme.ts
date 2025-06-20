import { useState, useEffect } from 'react';
import type { Theme } from '../schemas';

/**
 * Hook para gerenciamento de tema da aplicação
 * Segue o princípio SRP (Single Responsibility Principle)
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme['mode']>('dark');

  useEffect(() => {
    // Carrega tema salvo do localStorage
    const savedTheme = localStorage.getItem('app-theme') as Theme['mode'] | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Define tema padrão como dark conforme requisitos
      applyTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
  };

  const applyTheme = (mode: Theme['mode']) => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };
} 