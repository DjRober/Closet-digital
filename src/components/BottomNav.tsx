import { Home, Layers, Sparkles, Wand2 } from 'lucide-react';
import { AppTab } from './Header';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const ITEMS: { key: AppTab; label: string; icon: typeof Home }[] = [
  { key: 'landing', label: 'Inicio', icon: Home },
  { key: 'armario', label: 'Armario', icon: Layers },
  { key: 'outfits', label: 'Outfits', icon: Sparkles },
  { key: 'look', label: 'Look', icon: Wand2 },
];

/** Barra de navegación inferior, solo en móvil */
export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      id="bottom-nav"
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#1c152e]/95 backdrop-blur-2xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-stretch justify-around">
        {ITEMS.map(({ key, label, icon: Icon }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onTabChange(key)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors cursor-pointer ${
                active ? 'text-[#d9a6ff]' : 'text-stone-400 hover:text-white'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={`w-5 h-5 ${active ? 'drop-shadow-[0_0_8px_rgba(217,166,255,0.7)]' : ''}`} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
