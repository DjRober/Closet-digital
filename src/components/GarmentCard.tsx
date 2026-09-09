import { motion } from 'motion/react';
import { Trash2, Edit3, Check } from 'lucide-react';
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
}: GarmentCardProps) {
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
      className={`group relative bg-white dark:bg-stone-900 rounded-2xl border shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer ${
        isSelected
          ? 'border-stone-900 dark:border-stone-100 ring-2 ring-stone-900 dark:ring-stone-100 shadow-md bg-stone-50/60 dark:bg-stone-800/40'
          : isEditing
          ? 'border-amber-500 ring-2 ring-amber-500/80 shadow-md'
          : 'border-stone-200/90 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 hover:-translate-y-0.5'
      }`}
    >
      {/* Visual Area (Photo or Icon) */}
      <div className="relative aspect-4/3 w-full bg-stone-100/70 dark:bg-stone-950/60 overflow-hidden flex items-center justify-center p-3 border-b border-stone-100 dark:border-stone-800">
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
          className="absolute top-2.5 left-2.5 p-2 rounded-full bg-white/95 dark:bg-stone-800/95 backdrop-blur-xs border border-stone-200/80 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/70 hover:border-rose-300 dark:hover:border-rose-800 shadow-xs hover:shadow hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Color badge over visual (top-right) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 dark:bg-stone-800/95 backdrop-blur-xs border border-stone-200/70 dark:border-stone-700 shadow-xs text-xs text-stone-700 dark:text-stone-200">
          <span
            className="w-2.5 h-2.5 rounded-full border border-stone-300 dark:border-stone-600 shadow-2xs shrink-0"
            style={{ backgroundColor: garment.colorHex || '#57534e' }}
          />
          <span className="font-medium truncate max-w-[85px]">{garment.color}</span>
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
          className={`absolute bottom-2.5 right-2.5 p-1.5 rounded-full border shadow-xs transition-all cursor-pointer z-10 flex items-center justify-center ${
            isSelected
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 dark:border-stone-100 scale-105'
              : 'bg-white/90 dark:bg-stone-800/90 text-stone-400 dark:text-stone-500 border-stone-200/80 dark:border-stone-700 hover:text-stone-700 dark:hover:text-stone-200 hover:scale-105'
          }`}
        >
          <Check className={`w-3.5 h-3.5 ${isSelected ? 'stroke-[2.5]' : 'opacity-40 hover:opacity-100'}`} />
        </button>

        {/* Visual status hint banner on hover / selected / editing */}
        {isSelected ? (
          <div className="absolute bottom-2 left-2 py-1 px-2.5 rounded-lg bg-stone-900/95 dark:bg-stone-100/95 text-white dark:text-stone-900 text-[11px] font-semibold flex items-center gap-1.5 shadow-xs z-10">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>Seleccionada</span>
          </div>
        ) : isEditing ? (
          <div className="absolute bottom-2 left-2 py-1 px-2.5 rounded-lg bg-amber-500 text-white text-[11px] font-medium flex items-center gap-1.5 shadow-xs z-10">
            <Edit3 className="w-3 h-3" />
            <span>Editando</span>
          </div>
        ) : isSelectionMode ? (
          <div className="absolute bottom-2 left-2 py-1 px-2.5 rounded-lg bg-stone-900/80 dark:bg-stone-800/90 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-xs z-10">
            <span>Toca para elegir</span>
          </div>
        ) : (
          <div className="absolute bottom-2 left-2 py-1 px-2.5 rounded-lg bg-white/90 dark:bg-stone-800/90 backdrop-blur-xs text-stone-700 dark:text-stone-300 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-xs border border-stone-200/60 dark:border-stone-700/60 z-10">
            <Edit3 className="w-3 h-3 text-stone-500 dark:text-stone-400" />
            <span>Toca para editar</span>
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 tracking-tight capitalize">
            {garment.type}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Color: <span className="text-stone-700 dark:text-stone-200 font-medium">{garment.color}</span>
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500">
          <span className="flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSelected
                  ? 'bg-stone-900 dark:bg-stone-100'
                  : isEditing
                  ? 'bg-amber-500'
                  : 'bg-stone-300 dark:bg-stone-600'
              }`}
            ></span>
            {isSelected ? 'Elegida para outfit' : isEditing ? 'Editando' : 'En armario'}
          </span>
          <span>
            {new Date(garment.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
