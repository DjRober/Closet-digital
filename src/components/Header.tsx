import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  garmentCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Header({ garmentCount, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="border-b border-stone-200/80 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 sticky top-0 z-10 backdrop-blur-xs transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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

        <div className="flex items-center space-x-3">
          {/* Garment Counter */}
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
            <span>{garmentCount} {garmentCount === 1 ? 'prenda' : 'prendas'}</span>
          </div>

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

