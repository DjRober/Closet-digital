import { Outfit } from '../types';
import { OutfitCard } from './OutfitCard';
import { Sparkles, Plus, Shirt } from 'lucide-react';

interface OutfitsSectionProps {
  outfits: Outfit[];
  onDeleteOutfit: (outfitId: string) => void;
  onCreateOutfitClick: () => void;
}

export function OutfitsSection({
  outfits,
  onDeleteOutfit,
  onCreateOutfitClick,
}: OutfitsSectionProps) {
  return (
    <section id="mis-outfits" className="mt-12 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/12 flex items-center justify-center text-[#d9a6ff] shadow-[0_0_15px_rgba(217,166,255,0.2)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight font-['Outfit']">
              Mis outfits
            </h2>
            <p className="text-xs text-stone-400">
              Conjuntos de ropa guardados y combinaciones creadas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/[0.08] text-stone-300 border border-white/12 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]">
            {outfits.length} {outfits.length === 1 ? 'outfit' : 'outfits'}
          </span>

          <button
            type="button"
            id="btn-nuevo-outfit-seccion"
            onClick={onCreateOutfitClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] text-xs font-bold shadow-[0_0_20px_rgba(217,166,255,0.4)] transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear outfit</span>
          </button>
        </div>
      </div>

      {/* Grid or Empty State */}
      {outfits.length === 0 ? (
        <div
          id="outfits-empty-state"
          className="glass-panel p-10 sm:p-14 text-center border-dashed border-white/20"
        >
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-[#d9a6ff] mb-4 shadow-[0_0_20px_rgba(217,166,255,0.25)]">
            <Shirt className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-white font-['Outfit']">
            Aún no has guardado ningún outfit
          </h3>
          <p className="text-xs text-stone-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
            Selecciona varias prendas de tu armario y combínalas para guardar tu primer conjunto de vestuario.
          </p>
          <div className="mt-5">
            <button
              type="button"
              id="btn-empezar-combinar"
              onClick={onCreateOutfitClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] text-xs font-bold shadow-[0_0_20px_rgba(217,166,255,0.4)] transition-all active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Seleccionar prendas para combinar</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          id="grid-mis-outfits"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {outfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              onDelete={onDeleteOutfit}
            />
          ))}
        </div>
      )}
    </section>
  );
}
