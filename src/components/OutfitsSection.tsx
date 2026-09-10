import { Outfit } from '../types';
import { OutfitCard } from './OutfitCard';
import { Sparkles, Plus, Shirt, Wand2 } from 'lucide-react';

interface OutfitsSectionProps {
  outfits: Outfit[];
  onDeleteOutfit: (outfitId: string) => void;
  onCreateOutfitClick: () => void;
  onGenerateAutoOutfitClick: () => void;
}

export function OutfitsSection({
  outfits,
  onDeleteOutfit,
  onCreateOutfitClick,
  onGenerateAutoOutfitClick,
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

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/[0.08] text-stone-300 border border-white/12 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]">
            {outfits.length} {outfits.length === 1 ? 'outfit' : 'outfits'}
          </span>
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
            Genera automáticamente combinaciones con las prendas de tu armario basadas en reglas de estilo o selecciona tus prendas manualmente.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              id="btn-generar-primer-outfit-auto"
              onClick={onGenerateAutoOutfitClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d9a6ff] to-[#ff8fd8] hover:from-[#eccbff] hover:to-[#ffa6e2] text-[#150f24] text-xs font-bold shadow-[0_0_25px_rgba(217,166,255,0.4)] transition-all active:scale-[0.98] cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>Generar outfit automático</span>
            </button>

            <button
              type="button"
              id="btn-empezar-combinar"
              onClick={onCreateOutfitClick}
              className="glass-pill inline-flex items-center gap-2 px-4 py-2.5 text-stone-200 text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Creación manual</span>
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
