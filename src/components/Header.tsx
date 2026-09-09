import { Sun, Moon, Layers, Sparkles } from 'lucide-react';

interface HeaderProps {
  garmentCount: number;
  outfitCount?: number;
  activeTab?: 'armario' | 'outfits';
  onTabChange?: (tab: 'armario' | 'outfits') => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Header({
  garmentCount,
  outfitCount = 0,
  activeTab = 'armario',
  onTabChange,
  theme,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="border-b border-stone-200/80 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 sticky top-0 z-30 backdrop-blur-xs transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-stone-100 dark:bg-stone-800 dark:border dark:border-stone-700 flex items-center justify-center shadow-xs">
            {/* Minimalist hanger brand mark */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-stone-200"
            >
              <path d="M12 4a2 2 0 0 1 2 2c0 1.5-1.5 2-2 3l-8 6a1 1 0 0 0 .6 1.7h18.8a1 1 0 0 0 .6-1.7L14 9" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              Armario Digital
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
              Organizador personal de prendas y vestuario
            </p>
          </div>
        </div>

        {/* Navigation Tabs and Theme */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {onTabChange && (
            <nav
              id="nav-secciones-header"
              className="p-1 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 flex items-center gap-1"
            >
              <button
                type="button"
                id="nav-tab-armario"
                onClick={() => onTabChange('armario')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'armario'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Armario</span>
                <span className="ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold">
                  {garmentCount}
                </span>
              </button>

              <button
                type="button"
                id="nav-tab-outfits"
                onClick={() => onTabChange('outfits')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'outfits'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Mis outfits</span>
                <span className="ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold">
                  {outfitCount}
                </span>
              </button>
            </nav>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            id="btn-toggle-tema"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all cursor-pointer flex items-center justify-center shadow-xs"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
