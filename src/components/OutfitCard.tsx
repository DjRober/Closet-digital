import { useState } from 'react';
import { Trash2, Calendar, Sparkles } from 'lucide-react';
import { Outfit } from '../types';
import { GarmentVisual } from './GarmentVisual';

interface OutfitCardProps {
  key?: string;
  outfit: Outfit;
  onDelete: (outfitId: string) => void;
}

export function OutfitCard({ outfit, onDelete }: OutfitCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  return (
    <article
      id={`outfit-card-${outfit.id}`}
      className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-xs hover:shadow-md hover:border-stone-300 dark:hover:border-stone-700 transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Visual Collage of Combined Garments */}
      <div className="relative p-3 bg-stone-100/60 dark:bg-stone-950/60 border-b border-stone-100 dark:border-stone-800">
        <div className="grid grid-cols-3 gap-2 aspect-16/9 w-full">
          {outfit.garments.slice(0, 3).map((garment, idx) => (
            <div
              key={`${garment.id}-${idx}`}
              className="relative rounded-xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex items-center justify-center p-2 shadow-2xs"
            >
              <GarmentVisual
                imageUrl={garment.imageUrl}
                iconKey={garment.iconKey}
                colorHex={garment.colorHex}
                colorName={garment.color}
                size="sm"
                className="w-full h-full rounded-lg"
              />
              {/* Color swatch dot */}
              <span
                className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full border border-white dark:border-stone-800 shadow-xs shrink-0"
                style={{ backgroundColor: garment.colorHex || '#57534e' }}
                title={garment.color}
              />
            </div>
          ))}
          {/* If there are more than 3 garments, show badge on the last one */}
          {outfit.garments.length > 3 && (
            <div className="absolute bottom-4 right-4 px-2 py-0.5 rounded-md bg-stone-900/80 text-white text-[10px] font-semibold backdrop-blur-xs">
              +{outfit.garments.length - 3} más
            </div>
          )}
        </div>

        {/* Delete Outfit Button */}
        <button
          type="button"
          id={`btn-eliminar-outfit-${outfit.id}`}
          onClick={() => setShowConfirmDelete(true)}
          title="Eliminar este outfit"
          aria-label="Eliminar outfit"
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/95 dark:bg-stone-800/95 backdrop-blur-xs border border-stone-200/80 dark:border-stone-700 text-stone-400 dark:text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/70 hover:border-rose-300 dark:hover:border-rose-800 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Occasion badge */}
        {outfit.occasion && (
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-stone-900/80 dark:bg-stone-100/90 text-white dark:text-stone-900 text-[11px] font-medium backdrop-blur-xs shadow-xs">
            {outfit.occasion}
          </div>
        )}
      </div>

      {/* Outfit Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
              {outfit.name}
            </h3>
          </div>

          {/* Garments Summary List */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {outfit.garments.map((g, idx) => (
              <span
                key={`${g.id}-${idx}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 text-[11px] border border-stone-200/60 dark:border-stone-700/60"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: g.colorHex || '#78716c' }}
                />
                <span className="capitalize">{g.type}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-stone-400 dark:text-stone-500" />
            <span>{outfit.garments.length} prendas combinadas</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(outfit.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        </div>
      </div>

      {/* Delete Confirmation Banner inside Card */}
      {showConfirmDelete && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/80 border-t border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-2 animate-fade-in">
          <p className="text-xs text-rose-800 dark:text-rose-200 font-medium">
            ¿Eliminar este outfit?
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(false)}
              className="px-2.5 py-1 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              No
            </button>
            <button
              type="button"
              id={`btn-confirmar-eliminar-outfit-${outfit.id}`}
              onClick={() => onDelete(outfit.id)}
              className="px-2.5 py-1 text-xs rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors cursor-pointer"
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
