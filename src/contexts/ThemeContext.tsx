
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserRole } from '@/hooks/useUserRole';

type Theme = 'light' | 'dark';
type RoleTheme = 'admin' | 'landlord' | 'vendor' | 'tenant' | 'default';

interface ThemeContextType {
  theme: Theme;
  roleTheme: RoleTheme;
  toggleTheme: () => void;
  setRoleTheme: (role: RoleTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [roleTheme, setRoleTheme] = useState<RoleTheme>('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'admin-theme', 'landlord-theme', 'vendor-theme', 'tenant-theme');
    
    // Add current theme classes
    root.classList.add(theme);
    root.classList.add(`${roleTheme}-theme`);
    
    localStorage.setItem('theme', theme);
    localStorage.setItem('roleTheme', roleTheme);
  }, [theme, roleTheme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, roleTheme, toggleTheme, setRoleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
