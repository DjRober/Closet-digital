import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { GarmentForm } from './components/GarmentForm';
import { GarmentGallery } from './components/GarmentGallery';
import { OutfitsSection } from './components/OutfitsSection';
import { OutfitCreatorScreen } from './components/OutfitCreatorScreen';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { Garment, Outfit } from './types';
import { INITIAL_GARMENTS } from './data/garmentOptions';
import { Sparkles, Check } from 'lucide-react';

const STORAGE_KEY = 'armario_digital_prendas';
const OUTFITS_STORAGE_KEY = 'armario_digital_outfits';
const THEME_KEY = 'armario_digital_tema';

// Initial sample outfit combining two pieces
const INITIAL_SAMPLE_OUTFITS: Outfit[] = [
  {
    id: 'outfit-sample-1',
    name: 'Look Elegante Casual',
    garmentIds: ['sample-1', 'sample-2', 'sample-3'],
    garments: INITIAL_GARMENTS,
    createdAt: Date.now() - 3600000 * 2,
    occasion: 'Trabajo / Casual',
  },
];

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

  const [outfits, setOutfits] = useState<Outfit[]>(() => {
    try {
      const saved = localStorage.getItem(OUTFITS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Fall through
    }
    return INITIAL_SAMPLE_OUTFITS;
  });

  // Navigation & Screen states
  const [currentScreen, setCurrentScreen] = useState<'wardrobe' | 'outfit-creator'>('wardrobe');
  const [activeTab, setActiveTab] = useState<'armario' | 'outfits'>('armario');

  // Garment selection for outfit combination
  const [selectedGarmentIds, setSelectedGarmentIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);

  // Success toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State for garment deletion confirmation
  const [garmentToDelete, setGarmentToDelete] = useState<Garment | null>(null);

  // State for garment being edited
  const [editingGarment, setEditingGarment] = useState<Garment | null>(null);

  const formSectionRef = useRef<HTMLDivElement>(null);
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const outfitsSectionRef = useRef<HTMLDivElement>(null);

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

  // Save garments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(garments));
    } catch (e) {
      console.warn('Could not save garments to localStorage', e);
    }
  }, [garments]);

  // Save outfits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(OUTFITS_STORAGE_KEY, JSON.stringify(outfits));
    } catch (e) {
      console.warn('Could not save outfits to localStorage', e);
    }
  }, [outfits]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleAddGarment = (newGarment: Garment) => {
    setGarments((prev) => [newGarment, ...prev]);
    showToast(`Prenda "${newGarment.type}" agregada al armario`);
  };

  const handleUpdateGarment = (updatedGarment: Garment) => {
    setGarments((prev) =>
      prev.map((g) => (g.id === updatedGarment.id ? updatedGarment : g))
    );
    // Also update any outfits containing this garment
    setOutfits((prev) =>
      prev.map((outfit) => ({
        ...outfit,
        garments: outfit.garments.map((g) =>
          g.id === updatedGarment.id ? updatedGarment : g
        ),
      }))
    );
    setEditingGarment(null);
    showToast(`Prenda "${updatedGarment.type}" actualizada`);
  };

  const handleSelectGarment = (garment: Garment) => {
    setEditingGarment(garment);
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancelEdit = () => {
    setEditingGarment(null);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleRequestDelete = (garment: Garment) => {
    setGarmentToDelete(garment);
  };

  const handleConfirmDelete = () => {
    if (!garmentToDelete) return;
    const deletedId = garmentToDelete.id;
    setGarments((prev) => prev.filter((g) => g.id !== deletedId));
    setSelectedGarmentIds((prev) => prev.filter((id) => id !== deletedId));
    if (editingGarment?.id === deletedId) {
      setEditingGarment(null);
    }
    // Remove garment from any outfits
    setOutfits((prev) =>
      prev.map((o) => ({
        ...o,
        garmentIds: o.garmentIds.filter((id) => id !== deletedId),
        garments: o.garments.filter((g) => g.id !== deletedId),
      }))
    );
    setGarmentToDelete(null);
    showToast(`Prenda eliminada del armario`);
  };

  const handleCancelDelete = () => {
    setGarmentToDelete(null);
  };

  // Outfit Selection & Creation Handlers
  const handleToggleSelectGarment = (garment: Garment) => {
    setIsSelectionMode(true);
    setSelectedGarmentIds((prev) =>
      prev.includes(garment.id)
        ? prev.filter((id) => id !== garment.id)
        : [...prev, garment.id]
    );
  };

  const handleToggleSelectionMode = () => {
    setIsSelectionMode((prev) => !prev);
    if (isSelectionMode) {
      setSelectedGarmentIds([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedGarmentIds([]);
  };

  const handleOpenOutfitCreator = () => {
    if (selectedGarmentIds.length === 0) {
      setIsSelectionMode(true);
      if (gallerySectionRef.current) {
        gallerySectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      showToast('Selecciona las prendas que deseas combinar en la galería');
      return;
    }
    setCurrentScreen('outfit-creator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveOutfit = (outfitData: Omit<Outfit, 'id' | 'createdAt'>) => {
    const newOutfit: Outfit = {
      ...outfitData,
      id: `outfit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };

    setOutfits((prev) => [newOutfit, ...prev]);
    setSelectedGarmentIds([]);
    setIsSelectionMode(false);
    setCurrentScreen('wardrobe');
    setActiveTab('outfits');

    showToast(`¡Outfit "${newOutfit.name}" guardado con éxito!`);

    // Smoothly scroll down to the "Mis outfits" section
    setTimeout(() => {
      if (outfitsSectionRef.current) {
        outfitsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleDeleteOutfit = (outfitId: string) => {
    setOutfits((prev) => prev.filter((o) => o.id !== outfitId));
    showToast('Outfit eliminado');
  };

  const handleRemoveGarmentFromOutfitScreen = (garmentId: string) => {
    setSelectedGarmentIds((prev) => prev.filter((id) => id !== garmentId));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const selectedGarmentsList = garments.filter((g) =>
    selectedGarmentIds.includes(g.id)
  );

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors duration-200">
      {/* Header */}
      <Header
        garmentCount={garments.length}
        outfitCount={outfits.length}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setCurrentScreen('wardrobe');
          if (tab === 'outfits' && outfitsSectionRef.current) {
            outfitsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else if (tab === 'armario' && formSectionRef.current) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed top-20 right-5 z-50 px-4 py-3 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium shadow-lg flex items-center gap-2 animate-fade-in border border-stone-800 dark:border-stone-300"
        >
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-12">
        {currentScreen === 'outfit-creator' ? (
          /* Nueva Pantalla: Ver prendas juntas y guardar outfit */
          <OutfitCreatorScreen
            selectedGarments={selectedGarmentsList}
            onSaveOutfit={handleSaveOutfit}
            onCancel={() => setCurrentScreen('wardrobe')}
            onRemoveGarment={handleRemoveGarmentFromOutfitScreen}
          />
        ) : (
          /* Pantalla Principal: Armario (Registro, Edición, Galería) + Mis Outfits */
          <>
            {/* Formulario de registro y edición */}
            <div ref={formSectionRef} className="scroll-mt-6">
              <GarmentForm
                onAddGarment={handleAddGarment}
                editingGarment={editingGarment}
                onUpdateGarment={handleUpdateGarment}
                onCancelEdit={handleCancelEdit}
              />
            </div>

            {/* Galería de prendas en el armario con soporte de selección para outfit */}
            <div ref={gallerySectionRef} className="scroll-mt-6">
              <GarmentGallery
                garments={garments}
                editingGarmentId={editingGarment?.id}
                selectedGarmentIds={selectedGarmentIds}
                isSelectionMode={isSelectionMode}
                onToggleSelectionMode={handleToggleSelectionMode}
                onSelectGarment={handleSelectGarment}
                onToggleSelectGarment={handleToggleSelectGarment}
                onClearSelection={handleClearSelection}
                onCreateOutfitClick={handleOpenOutfitCreator}
                onDeleteRequest={handleRequestDelete}
              />
            </div>

            {/* Sección "Mis outfits" */}
            <div ref={outfitsSectionRef} className="scroll-mt-6">
              <OutfitsSection
                outfits={outfits}
                onDeleteOutfit={handleDeleteOutfit}
                onCreateOutfitClick={() => {
                  setIsSelectionMode(true);
                  if (gallerySectionRef.current) {
                    gallerySectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  showToast('Selecciona las prendas en tu armario para combinarlas');
                }}
              />
            </div>
          </>
        )}
      </main>

      {/* Confirmation Modal for Garment Deletion */}
      <DeleteConfirmationModal
        isOpen={Boolean(garmentToDelete)}
        garment={garmentToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-stone-200/60 dark:border-stone-800/80 py-6 text-center text-xs text-stone-400 dark:text-stone-500">
        <p>Armario Digital — Registro de prendas y combinador de outfits</p>
      </footer>
    </div>
  );
}
