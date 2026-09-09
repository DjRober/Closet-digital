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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200/80 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-stone-900 dark:bg-stone-800 text-white dark:text-stone-100 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
              Mis outfits
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Conjuntos de ropa guardados y combinaciones creadas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            {outfits.length} {outfits.length === 1 ? 'outfit' : 'outfits'}
          </span>

          <button
            type="button"
            id="btn-nuevo-outfit-seccion"
            onClick={onCreateOutfitClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-white text-xs font-medium shadow-xs hover:shadow transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear outfit</span>
          </button>
        </div>
      </div>

      {/* Grid or Empty State */}
      {outfits.length === 0 ? (
        <div
          id="outfits-empty-state"
          className="rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/40 p-10 text-center"
        >
          <div className="mx-auto w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-500 mb-3 shadow-2xs">
            <Shirt className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100">
            Aún no has guardado ningún outfit
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
            Selecciona varias prendas de tu armario y combínalas para guardar tu primer conjunto de vestuario.
          </p>
          <div className="mt-5">
            <button
              type="button"
              id="btn-empezar-combinar"
              onClick={onCreateOutfitClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-white text-xs font-medium shadow-xs hover:shadow transition-all active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
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
