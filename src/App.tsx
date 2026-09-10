import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { GarmentForm } from './components/GarmentForm';
import { GarmentGallery } from './components/GarmentGallery';
import { OutfitsSection } from './components/OutfitsSection';
import { OutfitCreatorScreen } from './components/OutfitCreatorScreen';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { AutoOutfitModal } from './components/AutoOutfitModal';
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
import { Check, Cloud, Mail, AlertCircle, X, UserPlus, Lock } from 'lucide-react';

const GUEST_STORAGE_KEY = 'armario_digital_guest_prendas';
const GUEST_OUTFITS_STORAGE_KEY = 'armario_digital_guest_outfits';
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
  const { user, loading: authLoading, logout, authError, clearAuthError } = useAuth();

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

  // Garments and Outfits state (scoped strictly to the current user or guest)
  const [garments, setGarments] = useState<Garment[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'wardrobe' | 'outfit-creator'>('wardrobe');
  const [activeTab, setActiveTab] = useState<'landing' | 'armario' | 'outfits'>('landing');

  // Garment selection for outfit combination
  const [selectedGarmentIds, setSelectedGarmentIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'signin' | 'signup'>('signup');

  // Auto Outfit Generator Modal state
  const [isAutoOutfitModalOpen, setIsAutoOutfitModalOpen] = useState(false);

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

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // USER-SCOPED DATA INITIALIZATION & FIRESTORE REAL-TIME SYNCHRONIZATION
  useEffect(() => {
    // Clear selection and editing mode when user account changes
    setSelectedGarmentIds([]);
    setEditingGarment(null);

    if (user) {
      // 1. Authenticated User: Load exclusively from their personal cache and Firestore
      setIsSyncing(true);

      const userGarmentsKey = `armario_digital_prendas_${user.uid}`;
      const userOutfitsKey = `armario_digital_outfits_${user.uid}`;

      try {
        const cachedGarments = localStorage.getItem(userGarmentsKey);
        if (cachedGarments) {
          setGarments(JSON.parse(cachedGarments));
        } else {
          setGarments([]); // Clean slate for new user account
        }

        const cachedOutfits = localStorage.getItem(userOutfitsKey);
        if (cachedOutfits) {
          setOutfits(JSON.parse(cachedOutfits));
        } else {
          setOutfits([]); // Clean slate for new user account
        }
      } catch (e) {
        setGarments([]);
        setOutfits([]);
      }

      // Real-time Firestore subscription for this user's garments
      const unsubscribeGarments = subscribeToGarments(
        user.uid,
        (remoteGarments) => {
          setIsSyncing(false);
          setGarments(remoteGarments);
          try {
            localStorage.setItem(userGarmentsKey, JSON.stringify(remoteGarments));
          } catch (e) {
            console.warn('Error saving to user cache:', e);
          }
        },
        (err) => {
          setIsSyncing(false);
          console.error('Error in user garments Firestore subscription:', err);
        }
      );

      // Real-time Firestore subscription for this user's outfits
      const unsubscribeOutfits = subscribeToOutfits(
        user.uid,
        (remoteOutfits) => {
          setOutfits(remoteOutfits);
          try {
            localStorage.setItem(userOutfitsKey, JSON.stringify(remoteOutfits));
          } catch (e) {
            console.warn('Error saving to user outfits cache:', e);
          }
        },
        (err) => {
          console.error('Error in user outfits Firestore subscription:', err);
        }
      );

      return () => {
        unsubscribeGarments();
        unsubscribeOutfits();
      };
    } else {
      // 2. Guest User (Unauthenticated): Load isolated guest storage
      setIsSyncing(false);
      try {
        const guestGarments = localStorage.getItem(GUEST_STORAGE_KEY);
        if (guestGarments) {
          const parsed = JSON.parse(guestGarments);
          setGarments(Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_GARMENTS);
        } else {
          setGarments(INITIAL_GARMENTS);
        }

        const guestOutfits = localStorage.getItem(GUEST_OUTFITS_STORAGE_KEY);
        if (guestOutfits) {
          const parsed = JSON.parse(guestOutfits);
          setOutfits(Array.isArray(parsed) ? parsed : INITIAL_SAMPLE_OUTFITS);
        } else {
          setOutfits(INITIAL_SAMPLE_OUTFITS);
        }
      } catch (e) {
        setGarments(INITIAL_GARMENTS);
        setOutfits(INITIAL_SAMPLE_OUTFITS);
      }
    }
  }, [user]);

  // Persist current garments to the correct user or guest storage key
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(`armario_digital_prendas_${user.uid}`, JSON.stringify(garments));
      } else {
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(garments));
      }
    } catch (e) {
      console.warn('Could not save garments locally:', e);
    }
  }, [garments, user]);

  // Persist current outfits to the correct user or guest storage key
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(`armario_digital_outfits_${user.uid}`, JSON.stringify(outfits));
      } else {
        localStorage.setItem(GUEST_OUTFITS_STORAGE_KEY, JSON.stringify(outfits));
      }
    } catch (e) {
      console.warn('Could not save outfits locally:', e);
    }
  }, [outfits, user]);

  const handleOpenAuthModal = (mode: 'signin' | 'signup' = 'signup') => {
    setAuthModalInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  // Optional: Allows a brand-new user to import starter sample clothes into their private account
  const handleLoadSampleGarmentsForUser = async () => {
    if (!user) return;
    setIsSyncing(true);
    const now = Date.now();
    const userSamples: Garment[] = INITIAL_GARMENTS.map((g, idx) => ({
      ...g,
      id: `user-${user.uid}-sample-${now}-${idx + 1}`,
      userId: user.uid,
      createdAt: now - idx * 1000,
    }));

    setGarments(userSamples);

    try {
      for (const item of userSamples) {
        await saveGarmentToFirestore(user.uid, item);
      }
      setIsSyncing(false);
      showToast('Prendas de muestra añadidas a tu armario personal');
    } catch (error) {
      setIsSyncing(false);
      console.error('Error saving sample garments for user:', error);
      showToast('Prendas añadidas localmente');
    }
  };

  const handleAddGarment = async (newGarment: Garment) => {
    const garmentWithUser: Garment = {
      ...newGarment,
      userId: user ? user.uid : undefined,
    };

    setGarments((prev) => [garmentWithUser, ...prev]);

    if (user) {
      try {
        setIsSyncing(true);
        await saveGarmentToFirestore(user.uid, garmentWithUser);
        setIsSyncing(false);
        showToast('Prenda guardada en tu armario de Firebase');
      } catch (error) {
        setIsSyncing(false);
        console.error('Error saving garment to Firestore:', error);
        showToast('Prenda guardada localmente (error en sincronización)');
      }
    } else {
      showToast(`Prenda "${garmentWithUser.type}" agregada al armario`);
    }
  };

  const handleUpdateGarment = async (updatedGarment: Garment) => {
    const garmentWithUser: Garment = {
      ...updatedGarment,
      userId: user ? user.uid : undefined,
    };

    setGarments((prev) =>
      prev.map((g) => (g.id === garmentWithUser.id ? garmentWithUser : g))
    );

    // Also update any outfits containing this garment
    const updatedOutfits = outfits.map((outfit) => ({
      ...outfit,
      garments: outfit.garments.map((g) =>
        g.id === garmentWithUser.id ? garmentWithUser : g
      ),
    }));
    setOutfits(updatedOutfits);
    setEditingGarment(null);

    if (user) {
      try {
        setIsSyncing(true);
        await saveGarmentToFirestore(user.uid, garmentWithUser);
        for (const o of updatedOutfits) {
          if (o.garmentIds.includes(garmentWithUser.id)) {
            await saveOutfitToFirestore(user.uid, o);
          }
        }
        setIsSyncing(false);
        showToast('Prenda actualizada en tu armario');
      } catch (error) {
        setIsSyncing(false);
        console.error('Error updating garment in Firestore:', error);
        showToast('Prenda actualizada');
      }
    } else {
      showToast(`Prenda "${garmentWithUser.type}" actualizada`);
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
    const deletedName = garmentToDelete.type;

    // 1. Optimistic local updates
    const updatedGarments = garments.filter((g) => g.id !== deletedId);
    setGarments(updatedGarments);
    setSelectedGarmentIds((prev) => prev.filter((id) => id !== deletedId));
    if (editingGarment?.id === deletedId) {
      setEditingGarment(null);
    }

    // 2. Identify and update only outfits that contained this garment
    const affectedOutfits = outfits.filter((o) => o.garmentIds.includes(deletedId));
    const updatedOutfits = outfits.map((o) => {
      if (!o.garmentIds.includes(deletedId)) return o;
      return {
        ...o,
        garmentIds: o.garmentIds.filter((id) => id !== deletedId),
        garments: o.garments.filter((g) => g.id !== deletedId),
      };
    });
    setOutfits(updatedOutfits);
    setGarmentToDelete(null);

    if (user) {
      try {
        localStorage.setItem(`armario_digital_prendas_${user.uid}`, JSON.stringify(updatedGarments));
        localStorage.setItem(`armario_digital_outfits_${user.uid}`, JSON.stringify(updatedOutfits));
      } catch (e) {
        console.warn('Error updating local cache:', e);
      }
    }

    // 3. Persist to Firestore if user is authenticated
    if (user) {
      setIsSyncing(true);
      try {
        await deleteGarmentFromFirestore(user.uid, deletedId);

        // Update affected outfits in Firestore
        for (const affected of affectedOutfits) {
          const updatedOutfit: Outfit = {
            ...affected,
            garmentIds: affected.garmentIds.filter((id) => id !== deletedId),
            garments: affected.garments.filter((g) => g.id !== deletedId),
            userId: user.uid,
          };
          try {
            await saveOutfitToFirestore(user.uid, updatedOutfit);
          } catch (err) {
            console.warn('Error updating affected outfit in Firestore:', err);
          }
        }
        setIsSyncing(false);
        showToast(`Prenda "${deletedName}" eliminada correctamente`);
      } catch (error) {
        setIsSyncing(false);
        console.error('Error deleting garment from Firestore:', error);
        showToast('Prenda eliminada localmente (error al sincronizar)');
      }
    } else {
      showToast(`Prenda "${deletedName}" eliminada del armario`);
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
        showToast('Outfit guardado en tu colección de Firestore');
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
    const targetOutfit = outfits.find((o) => o.id === outfitId);
    const outfitName = targetOutfit?.name || 'Outfit';

    // 1. Optimistic local update
    const updated = outfits.filter((o) => o.id !== outfitId);
    setOutfits(updated);

    if (user) {
      const userOutfitsKey = `armario_digital_outfits_${user.uid}`;
      try {
        localStorage.setItem(userOutfitsKey, JSON.stringify(updated));
      } catch (e) {
        console.warn('Error updating local outfit cache:', e);
      }

      setIsSyncing(true);
      try {
        await deleteOutfitFromFirestore(user.uid, outfitId);
        setIsSyncing(false);
        showToast(`"${outfitName}" eliminado de tu cuenta`);
      } catch (error) {
        setIsSyncing(false);
        console.error('Error deleting outfit from Firestore:', error);
        showToast(`"${outfitName}" eliminado localmente`);
      }
    } else {
      showToast(`"${outfitName}" eliminado`);
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
    <div className="relative min-h-screen text-stone-100 flex flex-col bg-[#150f24] selection:bg-[#d9a6ff]/30 selection:text-white">
      {/* Header with Navigation and User Auth - Only rendered on Armario and Outfits tabs, hidden on Landing */}
      {activeTab !== 'landing' && (
        <Header
          garmentCount={garments.length}
          outfitCount={outfits.length}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentScreen('wardrobe');
            if (tab === 'outfits') {
              setTimeout(() => {
                outfitsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 60);
            } else if (tab === 'armario') {
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
      )}

      {/* User Status Bar when Logged In - Only on Armario / Outfits */}
      {user && activeTab !== 'landing' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-3 w-full relative z-10">
          <div className="p-3 px-4 rounded-2xl glass-panel text-xs flex items-center justify-between gap-2 border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-2 text-stone-300">
              <Lock className="w-3.5 h-3.5 text-[#d9a6ff]" />
              <span>
                Sesión activa como <strong className="text-white font-semibold">{user.displayName || user.email}</strong>. Tus datos son privados y exclusivos de tu cuenta.
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#d9a6ff] font-medium">
              <Cloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Sincronizando...' : 'Conectado a Firestore'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Auth Error Banner if any */}
      {authError && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 w-full relative z-10">
          <div className="p-3 rounded-2xl bg-rose-950/80 backdrop-blur-md border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-2 shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
            <button
              onClick={clearAuthError}
              className="p-1 hover:bg-rose-900/60 rounded-lg cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Firebase Cloud Sync Banner for Guests (Only on Armario/Outfits tabs) */}
      {!user && !authLoading && activeTab !== 'landing' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 w-full relative z-10">
          <div
            id="banner-firebase-info"
            className="p-4 sm:p-5 rounded-2xl glass-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-white/15"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(217,166,255,0.2)]">
                <Cloud className="w-5 h-5 text-[#d9a6ff]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white font-['Outfit']">
                  Crea tu cuenta para tener tu armario privado
                </p>
                <p className="text-xs text-stone-300">
                  Cada usuario tiene su propia colección de ropa y outfits aislada en Firestore.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                id="btn-banner-registro-email"
                onClick={() => handleOpenAuthModal('signup')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] text-xs font-bold shadow-[0_0_20px_rgba(217,166,255,0.4)] transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Registrarse con correo</span>
              </button>

              <button
                type="button"
                id="btn-banner-login-email"
                onClick={() => handleOpenAuthModal('signin')}
                className="glass-pill inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-stone-200 text-xs font-semibold cursor-pointer"
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
          className="fixed top-20 right-5 z-50 px-4 py-3 rounded-2xl glass-panel !bg-[#1c152e]/95 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in border border-[#d9a6ff]/40"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === 'landing' ? (
        /* Landing Page View (with light ripple shader exclusively in its hero, without header) */
        <LandingPage
          onEnterApp={() => {
            setActiveTab('armario');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenOutfits={() => {
            setActiveTab('outfits');
            setTimeout(() => {
              outfitsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 60);
          }}
          onSignIn={() => handleOpenAuthModal('signin')}
          onSignUp={() => handleOpenAuthModal('signup')}
          onOpenOutfitCreator={() => {
            setActiveTab('armario');
            setIsSelectionMode(true);
            setTimeout(() => {
              gallerySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 60);
          }}
          totalGarments={garments.length}
          totalOutfits={outfits.length}
          userEmail={user?.email}
          userName={user?.displayName}
        />
      ) : (
        <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-12">
          {currentScreen === 'outfit-creator' ? (
            /* Pantalla: Ver prendas juntas y guardar outfit */
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

              {/* Galería de prendas en el armario */}
              <div ref={gallerySectionRef} className="scroll-mt-6">
                <GarmentGallery
                  garments={garments}
                  editingGarmentId={editingGarment?.id}
                  selectedGarmentIds={selectedGarmentIds}
                  isSelectionMode={isSelectionMode}
                  isUserLoggedIn={Boolean(user)}
                  onToggleSelectionMode={handleToggleSelectionMode}
                  onSelectGarment={handleSelectGarment}
                  onToggleSelectGarment={handleToggleSelectGarment}
                  onClearSelection={handleClearSelection}
                  onCreateOutfitClick={handleOpenOutfitCreator}
                  onGenerateAutoOutfitClick={() => setIsAutoOutfitModalOpen(true)}
                  onDeleteRequest={handleRequestDelete}
                  onLoadSampleGarments={user ? handleLoadSampleGarmentsForUser : undefined}
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
                  onGenerateAutoOutfitClick={() => setIsAutoOutfitModalOpen(true)}
                />
              </div>
            </>
          )}
        </main>
      )}

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

      {/* Auto Outfit Generator Modal based on Logical Rules */}
      <AutoOutfitModal
        isOpen={isAutoOutfitModalOpen}
        onClose={() => setIsAutoOutfitModalOpen(false)}
        garments={garments}
        onSaveOutfit={handleSaveOutfit}
        onNavigateToAddGarment={() => {
          setActiveTab('armario');
          setCurrentScreen('wardrobe');
          setTimeout(() => {
            formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 120);
        }}
      />

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-white/[0.08] py-8 text-center text-xs text-stone-400 bg-white/[0.02] backdrop-blur-md">
        <div className="flex items-center justify-center gap-1.5 mb-1.5">
          <Cloud className="w-3.5 h-3.5 text-[#d9a6ff]" />
          <span className="font-semibold text-white">Armario Digital</span>
          <span>•</span>
          <span>Colecciones privadas por usuario en Firebase</span>
        </div>
        <p className="text-stone-400">Cada usuario cuenta con su propia colección independiente de prendas y outfits</p>
      </footer>
    </div>
  );
}
