import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GarmentForm } from './components/GarmentForm';
import { GarmentGallery } from './components/GarmentGallery';
import { Garment } from './types';
import { INITIAL_GARMENTS } from './data/garmentOptions';

const STORAGE_KEY = 'armario_digital_prendas';

export default function App() {
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

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {/* Header */}
      <Header garmentCount={garments.length} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Formulario de registro */}
        <GarmentForm onAddGarment={handleAddGarment} />

        {/* Galería de prendas registradas en el armario */}
        <GarmentGallery garments={garments} />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-stone-200/60 py-6 text-center text-xs text-stone-400">
        <p>Armario Digital — Mockup de registro y visualización de prendas</p>
      </footer>
    </div>
  );
}
