import { useState, useEffect } from 'react';
import './theme-switcher.css';

const THEMES = [
  { key: 'mocha', name: 'Mocha', emoji: '🌙', category: 'Catppuccin' },
  { key: 'macchiato', name: 'Macchiato', emoji: '🌆', category: 'Catppuccin' },
  { key: 'frappe', name: 'Frappe', emoji: '🌃', category: 'Catppuccin' },
  { key: 'latte', name: 'Latte', emoji: '☀️', category: 'Catppuccin' },
  { key: 'vague', name: 'Vague', emoji: '🌫️', category: 'Modern' },
  { key: 'gruvbox', name: 'Gruvbox', emoji: '🍂', category: 'Classic' },
  { key: 'lush', name: 'Lush', emoji: '✨', category: 'Vibrant' }
] as const;

type ThemeKey = typeof THEMES[number]['key'];

export const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('vague');

  useEffect(() => {
    const savedTheme = localStorage.getItem('catppuccin-theme') as ThemeKey;
    if (savedTheme && THEMES.some(theme => theme.key === savedTheme)) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (theme: ThemeKey) => {
    const root = document.documentElement;
    if (theme === 'vague') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  };

  const switchTheme = () => {
    const currentIndex = THEMES.findIndex(theme => theme.key === currentTheme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    const nextTheme = THEMES[nextIndex].key;
    
    setCurrentTheme(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem('catppuccin-theme', nextTheme);
  };

  const currentThemeData = THEMES.find(theme => theme.key === currentTheme);

  return (
    <button 
      className="theme-switcher" 
      onClick={switchTheme}
      title={`Current theme: ${currentThemeData?.name}. Click to switch.`}
      aria-label={`Switch theme. Current: ${currentThemeData?.name}`}
    >
      <span className="theme-emoji">{currentThemeData?.emoji}</span>
      <span className="theme-name">{currentThemeData?.name}</span>
    </button>
  );
};