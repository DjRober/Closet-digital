import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GarmentForm } from './components/GarmentForm';
import { GarmentGallery } from './components/GarmentGallery';
import { Garment } from './types';
import { INITIAL_GARMENTS } from './data/garmentOptions';

const STORAGE_KEY = 'armario_digital_prendas';
const THEME_KEY = 'armario_digital_tema';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch {
      // Ignore
    }
    // Default to dark mode as requested by user
    return 'dark';
  });

  const [garments, setGarments] = useState<Garment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fall through to initial presets
    }
    return INITIAL_GARMENTS;
  });

  // Apply dark mode class to document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  // Save to localStorage when garments change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(garments));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [garments]);

  const handleAddGarment = (newGarment: Garment) => {
    setGarments((prev) => [newGarment, ...prev]);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors duration-200">
      {/* Header */}
      <Header
        garmentCount={garments.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Formulario de registro */}
        <GarmentForm onAddGarment={handleAddGarment} />

        {/* Galería de prendas registradas en el armario */}
        <GarmentGallery garments={garments} />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-stone-200/60 dark:border-stone-800/80 py-6 text-center text-xs text-stone-400 dark:text-stone-500">
        <p>Armario Digital — Mockup de registro y visualización de prendas</p>
      </footer>
    </div>
  );
}
