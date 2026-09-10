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
      className="group glass-card transition-all duration-200 overflow-hidden flex flex-col hover:-translate-y-1 hover:border-white/25"
    >
      {/* Visual Collage of Combined Garments */}
      <div className="relative p-3 bg-white/[0.04] backdrop-blur-md border-b border-white/[0.08]">
        <div className="grid grid-cols-3 gap-2 aspect-16/9 w-full">
          {outfit.garments.slice(0, 3).map((garment, idx) => (
            <div
              key={`${garment.id}-${idx}`}
              className="relative rounded-xl overflow-hidden bg-white/[0.06] border border-white/12 flex items-center justify-center p-2 shadow-xs"
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
                className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full border border-white/30 shadow-xs shrink-0"
                style={{ backgroundColor: garment.colorHex || '#57534e' }}
                title={garment.color}
              />
            </div>
          ))}
          {/* If there are more than 3 garments, show badge on the last one */}
          {outfit.garments.length > 3 && (
            <div className="absolute bottom-4 right-4 px-2 py-0.5 rounded-full bg-[#150f24]/90 text-white text-[10px] font-bold backdrop-blur-md border border-white/20">
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
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-[#150f24]/80 backdrop-blur-md border border-white/15 text-stone-300 hover:text-rose-400 hover:bg-rose-950/60 hover:border-rose-500/50 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Occasion badge */}
        {outfit.occasion && (
          <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-[#150f24]/80 text-[#d9a6ff] text-[11px] font-bold backdrop-blur-md border border-white/15 shadow-sm">
            {outfit.occasion}
          </div>
        )}
      </div>

      {/* Outfit Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-white tracking-tight font-['Outfit']">
              {outfit.name}
            </h3>
          </div>

          {/* Garments Summary List */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {outfit.garments.map((g, idx) => (
              <span
                key={`${g.id}-${idx}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] text-stone-300 text-[11px] border border-white/10"
              >
                <span
                  className="w-2 h-2 rounded-full border border-white/30"
                  style={{ backgroundColor: g.colorHex || '#78716c' }}
                />
                <span className="capitalize">{g.type}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-stone-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d9a6ff]" />
            <span>{outfit.garments.length} prendas combinadas</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(outfit.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        </div>
      </div>

      {/* Delete Confirmation Banner inside Card */}
      {showConfirmDelete && (
        <div className="p-3 bg-rose-950/80 backdrop-blur-md border-t border-rose-500/40 flex items-center justify-between gap-2 animate-fade-in">
          <p className="text-xs text-rose-200 font-medium">
            ¿Eliminar este outfit?
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id={`btn-cancelar-del-${outfit.id}`}
              onClick={() => setShowConfirmDelete(false)}
              className="px-2.5 py-1 rounded-full bg-white/10 text-stone-200 text-xs hover:bg-white/20 cursor-pointer"
            >
              No
            </button>
            <button
              type="button"
              id={`btn-confirmar-del-${outfit.id}`}
              onClick={() => onDelete(outfit.id)}
              className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 shadow-sm cursor-pointer"
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
