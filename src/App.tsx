import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { GarmentForm } from './components/GarmentForm';
import { GarmentGallery } from './components/GarmentGallery';
import { OutfitsSection } from './components/OutfitsSection';
import { OutfitCreatorScreen } from './components/OutfitCreatorScreen';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { AuthModal } from './components/AuthModal';
import { Garment, Outfit } from './types';
import { INITIAL_GARMENTS } from './data/garmentOptions';
import { useAuth } from './context/AuthContext';
import {
  subscribeToGarments,
  subscribeToOutfits,
  saveGarmentToFirestore,
  deleteGarmentFromFirestore,
  saveOutfitToFirestore,
  deleteOutfitFromFirestore,
} from './lib/firestoreService';
import { Check, Cloud, LogIn, Mail, AlertCircle, X, UserPlus } from 'lucide-react';

const STORAGE_KEY = 'armario_digital_prendas';
const OUTFITS_STORAGE_KEY = 'armario_digital_outfits';
const THEME_KEY = 'armario_digital_tema';

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
  const { user, loading: authLoading, signInWithGoogle, logout, authError, clearAuthError } = useAuth();

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
      // Fall through
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

  const [isSyncing, setIsSyncing] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'wardrobe' | 'outfit-creator'>('wardrobe');
  const [activeTab, setActiveTab] = useState<'armario' | 'outfits'>('armario');

  // Garment selection for outfit combination
  const [selectedGarmentIds, setSelectedGarmentIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'signin' | 'signup'>('signup');

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

  // Save garments to localStorage as local cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(garments));
    } catch (e) {
      console.warn('Could not save garments to localStorage', e);
    }
  }, [garments]);

  // Save outfits to localStorage as local cache
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

  // Real-time Firestore synchronization when user is authenticated
  useEffect(() => {
    if (!user) return;

    setIsSyncing(true);

    // Subscribe to user garments
    const unsubscribeGarments = subscribeToGarments(
      user.uid,
      (remoteGarments) => {
        setIsSyncing(false);
        if (remoteGarments.length > 0) {
          setGarments(remoteGarments);
        } else {
          // If remote is empty, seed with current local garments so user doesn't lose anything
          garments.forEach((garment) => {
            saveGarmentToFirestore(user.uid, garment).catch((err) =>
              console.error('Error seeding garment to Firestore:', err)
            );
          });
        }
      },
      (err) => {
        setIsSyncing(false);
        console.error('Error in garments Firestore subscription:', err);
      }
    );

    // Subscribe to user outfits
    const unsubscribeOutfits = subscribeToOutfits(
      user.uid,
      (remoteOutfits) => {
        if (remoteOutfits.length > 0) {
          setOutfits(remoteOutfits);
        } else {
          // If remote is empty, seed with current local outfits
          outfits.forEach((outfit) => {
            saveOutfitToFirestore(user.uid, outfit).catch((err) =>
              console.error('Error seeding outfit to Firestore:', err)
            );
          });
        }
      },
      (err) => {
        console.error('Error in outfits Firestore subscription:', err);
      }
    );

    return () => {
      unsubscribeGarments();
      unsubscribeOutfits();
    };
  }, [user]);

  const handleOpenAuthModal = (mode: 'signin' | 'signup' = 'signup') => {
    setAuthModalInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAddGarment = async (newGarment: Garment) => {
    setGarments((prev) => [newGarment, ...prev]);

    if (user) {
      try {
        setIsSyncing(true);
        await saveGarmentToFirestore(user.uid, newGarment);
        setIsSyncing(false);
        showToast(`Prenda guardada en Firestore`);
      } catch (error) {
        setIsSyncing(false);
        console.error('Error saving garment to Firestore:', error);
        showToast(`Prenda guardada localmente (error en sincronización)`);
      }
    } else {
      showToast(`Prenda "${newGarment.type}" agregada al armario`);
    }
  };

  const handleUpdateGarment = async (updatedGarment: Garment) => {
    setGarments((prev) =>
      prev.map((g) => (g.id === updatedGarment.id ? updatedGarment : g))
    );

    // Also update any outfits containing this garment
    const updatedOutfits = outfits.map((outfit) => ({
      ...outfit,
      garments: outfit.garments.map((g) =>
        g.id === updatedGarment.id ? updatedGarment : g
      ),
    }));
    setOutfits(updatedOutfits);
    setEditingGarment(null);

    if (user) {
      try {
        setIsSyncing(true);
        await saveGarmentToFirestore(user.uid, updatedGarment);
        for (const o of updatedOutfits) {
          if (o.garmentIds.includes(updatedGarment.id)) {
            await saveOutfitToFirestore(user.uid, o);
          }
        }
        setIsSyncing(false);
        showToast(`Prenda actualizada en Firestore`);
      } catch (error) {
        setIsSyncing(false);
        console.error('Error updating garment in Firestore:', error);
        showToast(`Prenda actualizada`);
      }
    } else {
      showToast(`Prenda "${updatedGarment.type}" actualizada`);
    }
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

  const handleConfirmDelete = async () => {
    if (!garmentToDelete) return;
    const deletedId = garmentToDelete.id;

    setGarments((prev) => prev.filter((g) => g.id !== deletedId));
    setSelectedGarmentIds((prev) => prev.filter((id) => id !== deletedId));
    if (editingGarment?.id === deletedId) {
      setEditingGarment(null);
    }

    // Remove garment from outfits
    const updatedOutfits = outfits.map((o) => ({
      ...o,
      garmentIds: o.garmentIds.filter((id) => id !== deletedId),
      garments: o.garments.filter((g) => g.id !== deletedId),
    }));
    setOutfits(updatedOutfits);
    setGarmentToDelete(null);

    if (user) {
      try {
        setIsSyncing(true);
        await deleteGarmentFromFirestore(user.uid, deletedId);
        for (const o of updatedOutfits) {
          await saveOutfitToFirestore(user.uid, o);
        }
        setIsSyncing(false);
        showToast(`Prenda eliminada de Firestore`);
      } catch (error) {
        setIsSyncing(false);
        console.error('Error deleting from Firestore:', error);
        showToast(`Prenda eliminada del armario`);
      }
    } else {
      showToast(`Prenda eliminada del armario`);
    }
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

  const handleSaveOutfit = async (outfitData: Omit<Outfit, 'id' | 'createdAt'>) => {
    const newOutfit: Outfit = {
      ...outfitData,
      id: `outfit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
      userId: user?.uid,
    };

    setOutfits((prev) => [newOutfit, ...prev]);
    setSelectedGarmentIds([]);
    setIsSelectionMode(false);
    setCurrentScreen('wardrobe');
    setActiveTab('outfits');

    if (user) {
      try {
        setIsSyncing(true);
        await saveOutfitToFirestore(user.uid, newOutfit);
        setIsSyncing(false);
        showToast(`Outfit guardado en Firestore`);
      } catch (error) {
        setIsSyncing(false);
        console.error('Error saving outfit to Firestore:', error);
        showToast(`Outfit "${newOutfit.name}" guardado localmente`);
      }
    } else {
      showToast(`¡Outfit "${newOutfit.name}" guardado con éxito!`);
    }

    setTimeout(() => {
      if (outfitsSectionRef.current) {
        outfitsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleDeleteOutfit = async (outfitId: string) => {
    setOutfits((prev) => prev.filter((o) => o.id !== outfitId));

    if (user) {
      try {
        setIsSyncing(true);
        await deleteOutfitFromFirestore(user.uid, outfitId);
        setIsSyncing(false);
        showToast('Outfit eliminado de Firestore');
      } catch (error) {
        setIsSyncing(false);
        console.error('Error deleting outfit from Firestore:', error);
        showToast('Outfit eliminado');
      }
    } else {
      showToast('Outfit eliminado');
    }
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
      {/* Header with Navigation and User Auth */}
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
        user={user}
        onSignIn={() => handleOpenAuthModal('signin')}
        onSignOut={logout}
        isSyncing={isSyncing}
      />

      {/* Auth Error Banner if any */}
      {authError && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 w-full">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{authError}</span>
            </div>
            <button
              onClick={clearAuthError}
              className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Firebase Cloud Sync Banner for Guests with Email & Password option */}
      {!user && !authLoading && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 w-full">
          <div
            id="banner-firebase-info"
            className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center shrink-0">
                <Cloud className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  Respalda tu armario en la nube con Firebase
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Regístrate gratis con tu correo electrónico o cuenta de Google para acceder a tus prendas desde cualquier dispositivo.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                id="btn-banner-registro-email"
                onClick={() => handleOpenAuthModal('signup')}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Registrarse con correo</span>
              </button>

              <button
                type="button"
                id="btn-banner-login-email"
                onClick={() => handleOpenAuthModal('signin')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium shadow-2xs transition-all cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Iniciar sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Auth Modal for Email/Password Registration & Login */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalInitialMode}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Confirmation Modal for Garment Deletion */}
      <DeleteConfirmationModal
        isOpen={Boolean(garmentToDelete)}
        garment={garmentToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-stone-200/60 dark:border-stone-800/80 py-6 text-center text-xs text-stone-400 dark:text-stone-500">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Cloud className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-medium text-stone-600 dark:text-stone-400">Armario Digital</span>
          <span>•</span>
          <span>Firebase Firestore & Auth</span>
        </div>
        <p>Registro de prendas y organizador de outfits con respaldo en la nube</p>
      </footer>
    </div>
  );
}
