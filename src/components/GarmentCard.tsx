import { motion } from 'motion/react';
import { Trash2, Edit3, Check, Heart, RotateCw, Minus } from 'lucide-react';
import { Garment } from '../types';
import { GarmentVisual } from './GarmentVisual';

interface GarmentCardProps {
  key?: string;
  garment: Garment;
  index: number;
  isEditing?: boolean;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onSelect: (garment: Garment) => void;
  onToggleSelect?: (garment: Garment) => void;
  onDeleteRequest: (garment: Garment) => void;
  onToggleFavorite?: (garment: Garment) => void;
  onMarkWorn?: (garment: Garment) => void;
  onUnmarkWorn?: (garment: Garment) => void;
}

export function GarmentCard({
  garment,
  index,
  isEditing = false,
  isSelected = false,
  isSelectionMode = false,
  onSelect,
  onToggleSelect,
  onDeleteRequest,
  onToggleFavorite,
  onMarkWorn,
  onUnmarkWorn,
}: GarmentCardProps) {
  const wearCount = garment.wearCount ?? 0;
  const isFavorite = Boolean(garment.favorite);

  const handleCardClick = () => {
    if (isSelectionMode && onToggleSelect) {
      onToggleSelect(garment);
    } else {
      onSelect(garment);
    }
  };

  return (
    <motion.article
      id={`garment-card-${garment.id}`}
      layout
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.25) }}
      onClick={handleCardClick}
      title={
        isSelectionMode
          ? isSelected
            ? 'Prenda seleccionada. Toca para deseleccionar'
            : 'Toca para seleccionar esta prenda para tu outfit'
          : 'Toca para editar esta prenda'
      }
      className={`group relative glass-card transition-all duration-200 overflow-hidden flex flex-col cursor-pointer ${
        isSelected
          ? '!border-[#d9a6ff] ring-2 ring-[#d9a6ff]/70 shadow-[0_0_25px_rgba(217,166,255,0.35)] !bg-white/[0.14]'
          : isEditing
          ? '!border-amber-400 ring-2 ring-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
          : 'border-white/10 hover:border-white/25 hover:-translate-y-1'
      }`}
    >
      {/* Visual Area (Photo or Icon) */}
      <div className="relative aspect-4/3 w-full bg-white/[0.04] backdrop-blur-md overflow-hidden flex items-center justify-center p-3 border-b border-white/[0.08]">
        <GarmentVisual
          imageUrl={garment.imageUrl}
          iconKey={garment.iconKey}
          colorHex={garment.colorHex}
          colorName={garment.color}
          size="lg"
          className="w-full h-full rounded-xl"
        />

        {/* Delete button (top-left) */}
        <button
          type="button"
          id={`btn-eliminar-${garment.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRequest(garment);
          }}
          title="Eliminar prenda"
          aria-label={`Eliminar ${garment.type}`}
          className="absolute top-2.5 left-2.5 p-2 rounded-full bg-[#150f24]/80 backdrop-blur-md border border-white/15 text-stone-300 hover:text-rose-400 hover:bg-rose-950/60 hover:border-rose-500/50 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Top-right controls: favorito + color */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {onToggleFavorite && (
            <button
              type="button"
              id={`btn-favorito-${garment.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(garment);
              }}
              title={isFavorite ? 'Quitar de favoritos' : 'Marcar como favorita'}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Marcar como favorita'}
              aria-pressed={isFavorite}
              className={`p-1.5 rounded-full border shadow-sm transition-all cursor-pointer flex items-center justify-center ${
                isFavorite
                  ? 'bg-[#d9a6ff] text-[#150f24] border-[#d9a6ff] shadow-[0_0_12px_rgba(217,166,255,0.6)]'
                  : 'bg-[#150f24]/80 backdrop-blur-md text-stone-300 border-white/15 hover:text-[#d9a6ff] hover:scale-105'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#150f24]/80 backdrop-blur-md border border-white/15 shadow-sm text-xs text-stone-200">
            <span
              className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0 shadow-xs"
              style={{ backgroundColor: garment.colorHex || '#57534e' }}
            />
            <span className="font-medium truncate max-w-[70px]">{garment.color}</span>
          </div>
        </div>

        {/* Select for Outfit check button (bottom-right of visual area) */}
        <button
          type="button"
          id={`btn-seleccionar-${garment.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect?.(garment);
          }}
          title={isSelected ? 'Deseleccionar de outfit' : 'Seleccionar para combinar en outfit'}
          aria-label={isSelected ? 'Deseleccionar' : 'Seleccionar'}
          className={`absolute bottom-2.5 right-2.5 p-1.5 rounded-full border shadow-sm transition-all cursor-pointer z-10 flex items-center justify-center ${
            isSelected
              ? 'bg-[#d9a6ff] text-[#150f24] border-[#d9a6ff] shadow-[0_0_12px_rgba(217,166,255,0.6)] scale-105 font-bold'
              : 'bg-[#150f24]/80 text-stone-400 border-white/15 hover:text-white hover:scale-105'
          }`}
        >
          <Check className={`w-3.5 h-3.5 ${isSelected ? 'stroke-[2.8]' : 'opacity-40 hover:opacity-100'}`} />
        </button>

        {/* Visual status hint banner on hover / selected / editing */}
        {isSelected ? (
          <div className="absolute bottom-2 left-2 py-1 px-2.5 rounded-full bg-[#d9a6ff] text-[#150f24] text-[11px] font-bold flex items-center gap-1.5 shadow-sm z-10">
            <Check className="w-3 h-3 stroke-[2.8]" />
            <span>Seleccionada</span>
          </div>
        ) : isEditing ? (
          <div className="absolute bottom-2 left-2 py-1 px-2.5 rounded-full bg-amber-400 text-stone-900 text-[11px] font-bold flex items-center gap-1.5 shadow-sm z-10">
            <Edit3 className="w-3 h-3" />
            <span>Editando</span>
          </div>
        ) : isSelectionMode ? (
          <div className="absolute bottom-2 left-2 py-1 px-2.5 rounded-full bg-[#150f24]/90 text-stone-200 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-sm z-10 border border-white/10">
            <span>Toca para elegir</span>
          </div>
        ) : (
          <div className="absolute bottom-2 left-2 py-1 px-2.5 rounded-full bg-[#150f24]/90 backdrop-blur-md text-stone-300 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-sm border border-white/15 z-10">
            <Edit3 className="w-3 h-3 text-[#d9a6ff]" />
            <span>Toca para editar</span>
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight capitalize font-['Outfit']">
            {garment.type}
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Color: <span className="text-stone-200 font-medium">{garment.color}</span>
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-stone-400">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSelected
                  ? 'bg-[#d9a6ff] shadow-[0_0_6px_#d9a6ff]'
                  : isEditing
                  ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
                  : 'bg-stone-500'
              }`}
            ></span>
            <span className={isSelected ? 'text-[#d9a6ff] font-medium' : ''}>
              {isSelected ? 'Elegida para outfit' : isEditing ? 'Editando' : 'En armario'}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <span className="tabular-nums flex items-center gap-1">
              {wearCount > 0 && onUnmarkWorn && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnmarkWorn(garment);
                  }}
                  title="Restar un uso"
                  aria-label="Restar un uso"
                  className="w-4 h-4 rounded-full bg-white/[0.08] border border-white/12 flex items-center justify-center text-stone-300 hover:text-white hover:bg-white/[0.16] transition-all cursor-pointer"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
              )}
              {wearCount} usos
            </span>
            {onMarkWorn && (
              <button
                type="button"
                id={`btn-usar-${garment.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkWorn(garment);
                }}
                title="Registrar un uso de esta prenda hoy"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/12 text-stone-300 hover:text-white hover:bg-white/[0.14] transition-all cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>Usé hoy</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
