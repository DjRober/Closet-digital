import { useState } from 'react';
import { Sparkles, Cloud, LogIn, LogOut, User as UserIcon, Home, Layers, Sun, Moon, Wand2 } from 'lucide-react';
import { User } from 'firebase/auth';

export type AppTab = 'landing' | 'armario' | 'outfits' | 'look';

interface HeaderProps {
  garmentCount: number;
  outfitCount?: number;
  activeTab?: AppTab;
  onTabChange?: (tab: AppTab) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isSyncing?: boolean;
}

export function Header({
  garmentCount,
  outfitCount = 0,
  activeTab = 'landing',
  onTabChange,
  theme,
  onToggleTheme,
  user,
  onSignIn,
  onSignOut,
  isSyncing = false,
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/[0.06] backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <button
          type="button"
          onClick={() => onTabChange && onTabChange('landing')}
          className="flex items-center space-x-3 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/95 border border-white/30 flex items-center justify-center shadow-[0_0_16px_rgba(217,166,255,0.3)] transition-transform group-hover:scale-105 p-1 overflow-hidden">
            <img
              src="/logo.png"
              alt="Armario Digital Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-[#d9a6ff] transition-colors font-['Outfit']">
                Armario Digital
              </span>
              <span
                className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.08] text-[#d9a6ff] border border-white/12 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]"
                title="Conectado a Firebase Firestore"
              >
                <Cloud className={`w-3 h-3 ${isSyncing ? 'animate-pulse text-[#d9a6ff]' : ''}`} />
                <span>Nube</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block">
              Tu clóset organizado con estilo
            </p>
          </div>
        </button>

        {/* Navigation Tabs and User Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {onTabChange && (
            <nav
              id="nav-secciones-header"
              className="p-1 rounded-full bg-white/[0.06] border border-white/[0.12] backdrop-blur-md flex items-center gap-1 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]"
            >
              {/* Tab: Inicio (Landing) */}
              <button
                type="button"
                id="nav-tab-landing"
                onClick={() => onTabChange('landing')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'landing'
                    ? 'bg-[#d9a6ff] text-[#150f24] shadow-[0_0_12px_rgba(217,166,255,0.45)]'
                    : 'text-stone-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Inicio</span>
              </button>

              {/* Tab: Mi Armario */}
              <button
                type="button"
                id="nav-tab-armario"
                onClick={() => onTabChange('armario')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'armario'
                    ? 'bg-[#d9a6ff] text-[#150f24] shadow-[0_0_12px_rgba(217,166,255,0.45)]'
                    : 'text-stone-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Mi Armario</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'armario' ? 'bg-[#150f24]/20 text-[#150f24]' : 'bg-white/10 text-stone-300'
                }`}>
                  {garmentCount}
                </span>
              </button>

              {/* Tab: Mis Outfits */}
              <button
                type="button"
                id="nav-tab-outfits"
                onClick={() => onTabChange('outfits')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'outfits'
                    ? 'bg-[#d9a6ff] text-[#150f24] shadow-[0_0_12px_rgba(217,166,255,0.45)]'
                    : 'text-stone-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mis Outfits</span>
                <span className="sm:hidden">Outfits</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'outfits' ? 'bg-[#150f24]/20 text-[#150f24]' : 'bg-white/10 text-stone-300'
                }`}>
                  {outfitCount}
                </span>
              </button>

              {/* Tab: Armar look */}
              <button
                type="button"
                id="nav-tab-look"
                onClick={() => onTabChange('look')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'look'
                    ? 'bg-[#d9a6ff] text-[#150f24] shadow-[0_0_12px_rgba(217,166,255,0.45)]'
                    : 'text-stone-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Armar look</span>
                <span className="sm:hidden">Look</span>
              </button>
            </nav>
          )}

          {/* User Auth Controls */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                id="btn-user-profile"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="glass-pill flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 text-stone-200 hover:text-white cursor-pointer"
                title={user.email || 'Usuario'}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Usuario'}
                    className="w-6 h-6 rounded-full object-cover border border-white/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#d9a6ff]/20 text-[#d9a6ff] flex items-center justify-center font-bold text-xs">
                    {user.email ? user.email[0].toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                  </div>
                )}
                <span className="text-xs font-medium hidden md:inline max-w-[100px] truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </button>

              {showUserMenu && (
                <div
                  id="user-dropdown-menu"
                  className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#1c152e]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_1px_0_0_rgba(255,255,255,0.2)_inset] p-2 z-50 animate-fade-in text-stone-100"
                >
                  <div className="p-3 border-b border-white/10">
                    <p className="text-xs font-semibold text-white truncate">
                      {user.displayName || 'Usuario'}
                    </p>
                    <p className="text-[11px] text-stone-400 truncate">
                      {user.email}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                        <Cloud className="w-3.5 h-3.5 shrink-0" />
                        <span>Armario personal activo</span>
                      </div>
                      <p className="text-[10px] text-stone-400">
                        Prendas y outfits privados para tu cuenta
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="btn-cerrar-sesion"
                    onClick={() => {
                      setShowUserMenu(false);
                      onSignOut();
                    }}
                    className="w-full mt-1.5 flex items-center gap-2 p-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              id="btn-abrir-auth-modal"
              onClick={onSignIn}
              className="px-3.5 py-1.5 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] text-xs font-bold shadow-[0_0_15px_rgba(217,166,255,0.35)] transition-all cursor-pointer flex items-center gap-1.5"
              title="Inicia sesión o regístrate"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Acceder / Registro</span>
              <span className="sm:hidden">Acceder</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            id="btn-toggle-tema"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="glass-pill p-2 text-stone-300 hover:text-white cursor-pointer flex items-center justify-center"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-[#d9a6ff]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
