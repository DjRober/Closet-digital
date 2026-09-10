import { useMemo } from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { Garment } from '../types';

interface StatsPanelProps {
  garments: Garment[];
}

export function StatsPanel({ garments }: StatsPanelProps) {
  const stats = useMemo(() => {
    const withWear = garments.map((g) => ({ ...g, wear: g.wearCount ?? 0 }));
    const totalWears = withWear.reduce((sum, g) => sum + g.wear, 0);
    const sorted = [...withWear].sort((a, b) => b.wear - a.wear);
    const maxWear = sorted.length ? Math.max(1, sorted[0].wear) : 1;
    const top = sorted.slice(0, 4);
    const mostUsed = sorted[0];
    const leastUsed = sorted[sorted.length - 1];
    return { top, maxWear, mostUsed, leastUsed, totalWears };
  }, [garments]);

  if (garments.length === 0) return null;

  return (
    <div className="glass-panel p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/12 flex items-center justify-center text-[#d9a6ff] shadow-[0_0_15px_rgba(217,166,255,0.2)]">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-['Outfit'] text-base font-bold text-white">Tu ranking de uso</h3>
          <p className="text-xs text-stone-400">
            {stats.totalWears > 0
              ? `${stats.totalWears} ${stats.totalWears === 1 ? 'uso registrado' : 'usos registrados'} en tu armario`
              : 'Marca "Usé hoy" en tus prendas para ver estadísticas.'}
          </p>
        </div>
      </div>

      {stats.totalWears === 0 ? (
        <p className="text-xs text-stone-400 leading-relaxed">
          Todavía no registraste usos. Cada vez que uses una prenda, tócala en la galería y presiona
          <span className="text-[#d9a6ff] font-medium"> "Usé hoy"</span> para ir construyendo tu ranking.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {stats.top.map((g) => {
              const pct = Math.round((g.wear / stats.maxWear) * 100);
              return (
                <div key={g.id} className="flex items-center gap-3">
                  <div className="w-28 shrink-0 text-xs text-stone-300 truncate flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: g.colorHex || '#57534e' }} />
                    <span className="capitalize truncate">{g.type}</span>
                  </div>
                  <div className="flex-1 h-2 bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#d9a6ff] to-[#ff8fd8] transition-[width] duration-500"
                      style={{ width: `${Math.max(pct, 6)}%` }}
                    />
                  </div>
                  <div className="w-8 text-right text-[11px] text-stone-400 tabular-nums">{g.wear}</div>
                </div>
              );
            })}
          </div>

          {stats.mostUsed && stats.leastUsed && (
            <div className="mt-4 pt-3 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-stone-400">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  Más usada: <span className="text-stone-200 font-medium capitalize">{stats.mostUsed.type}</span> ({stats.mostUsed.wear})
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-400 sm:justify-end">
                <TrendingDown className="w-3.5 h-3.5 text-[#ff8fd8] shrink-0" />
                <span>
                  Menos usada: <span className="text-stone-200 font-medium capitalize">{stats.leastUsed.type}</span> ({stats.leastUsed.wear})
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
