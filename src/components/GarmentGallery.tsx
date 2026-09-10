import { AnimatePresence } from 'motion/react';
import { Garment } from '../types';
import { GarmentCard } from './GarmentCard';
import { Sparkles, Layers, CheckSquare, X, ArrowRight } from 'lucide-react';

interface GarmentGalleryProps {
  garments: Garment[];
  editingGarmentId?: string | null;
  selectedGarmentIds: string[];
  isSelectionMode: boolean;
  isUserLoggedIn?: boolean;
  onToggleSelectionMode: () => void;
  onSelectGarment: (garment: Garment) => void;
  onToggleSelectGarment: (garment: Garment) => void;
  onClearSelection: () => void;
  onCreateOutfitClick: () => void;
  onDeleteRequest: (garment: Garment) => void;
  onLoadSampleGarments?: () => void;
}

export function GarmentGallery({
  garments,
  editingGarmentId,
  selectedGarmentIds,
  isSelectionMode,
  isUserLoggedIn = false,
  onToggleSelectionMode,
  onSelectGarment,
  onToggleSelectGarment,
  onClearSelection,
  onCreateOutfitClick,
  onDeleteRequest,
  onLoadSampleGarments,
}: GarmentGalleryProps) {
  const selectedCount = selectedGarmentIds.length;

  return (
    <section id="armario-galeria" className="mt-10 scroll-mt-20">
      {/* Gallery Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-stone-200/80 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
              Prendas en el armario
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {isSelectionMode
                ? 'Toca las prendas para seleccionarlas y combinarlas en un outfit'
                : 'Colección actual de prendas registradas'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Garment count */}
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            {garments.length} {garments.length === 1 ? 'prenda' : 'prendas'}
          </span>

          {/* Toggle Selection / Combinar mode button */}
          <button
            type="button"
            id="btn-modo-combinar-outfit"
            onClick={onToggleSelectionMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              isSelectionMode
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{isSelectionMode ? 'Modo selección activo' : 'Seleccionar para outfit'}</span>
          </button>

          {/* Primary "Crear outfit" button in header */}
          <button
            type="button"
            id="btn-crear-outfit"
            onClick={onCreateOutfitClick}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium shadow-xs hover:shadow transition-all active:scale-[0.98] cursor-pointer ${
              selectedCount > 0
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white ring-2 ring-stone-900/20 dark:ring-stone-100/20'
                : 'bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {selectedCount > 0 ? `Crear outfit (${selectedCount})` : 'Crear outfit'}
            </span>
          </button>
        </div>
      </div>

      {/* Selection Mode Notice Banner */}
      {isSelectionMode && (
        <div
          id="banner-modo-seleccion"
          className="mb-5 p-3 rounded-xl bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 text-xs text-stone-600 dark:text-stone-300 animate-fade-in"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              {selectedCount === 0
                ? 'Toca dos o más prendas para combinarlas en un outfit.'
                : `${selectedCount} ${selectedCount === 1 ? 'prenda elegida' : 'prendas elegidas'}. Toca "Crear outfit" para verlas juntas.`}
            </span>
          </div>
          {selectedCount > 0 && (
            <button
              type="button"
              id="btn-limpiar-seleccion-banner"
              onClick={onClearSelection}
              className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 underline text-[11px] cursor-pointer"
            >
              Desmarcar todas
            </button>
          )}
        </div>
      )}

      {/* Grid or Empty State */}
      {garments.length === 0 ? (
        <div
          id="armario-empty-state"
          className="rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/40 p-10 sm:p-12 text-center"
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-500 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100">
            {isUserLoggedIn ? 'Tu armario personal está listo y vacío' : 'Aún no hay prendas en el armario'}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
            {isUserLoggedIn
              ? 'Tus prendas y outfits se guardarán de forma exclusiva y privada para tu cuenta en la base de datos.'
              : 'Completa los datos arriba (foto o ícono, tipo y color) y presiona "Guardar prenda" para registrar tu primera pieza.'}
          </p>

          {isUserLoggedIn && onLoadSampleGarments && (
            <div className="mt-4">
              <button
                type="button"
                id="btn-cargar-prendas-muestra"
                onClick={onLoadSampleGarments}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium shadow-2xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Cargar 3 prendas de ejemplo para probar</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          id="garment-grid"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {garments.map((garment, index) => (
              <GarmentCard
                key={garment.id}
                garment={garment}
                index={index}
                isEditing={editingGarmentId === garment.id}
                isSelected={selectedGarmentIds.includes(garment.id)}
                isSelectionMode={isSelectionMode}
                onSelect={onSelectGarment}
                onToggleSelect={onToggleSelectGarment}
                onDeleteRequest={onDeleteRequest}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Sticky Bottom Action Bar when items are selected */}
      {selectedCount > 0 && (
        <div
          id="barra-seleccion-outfit"
          className="fixed bottom-5 inset-x-4 max-w-xl mx-auto z-40 bg-stone-900/95 dark:bg-stone-100/95 text-white dark:text-stone-900 rounded-2xl shadow-xl border border-stone-800 dark:border-stone-200 p-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 backdrop-blur-md animate-fade-in"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-white/20 dark:bg-stone-900/20 flex items-center justify-center text-xs font-bold">
              {selectedCount}
            </div>
            <div>
              <p className="text-xs font-semibold">
                {selectedCount === 1 ? '1 prenda seleccionada' : `${selectedCount} prendas seleccionadas`}
              </p>
              <p className="text-[10px] opacity-80">Listas para armar tu outfit</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-cancelar-seleccion-flotante"
              onClick={onClearSelection}
              className="p-2 rounded-xl text-stone-400 hover:text-white dark:hover:text-stone-900 transition-colors cursor-pointer"
              title="Cancelar selección"
              aria-label="Cancelar selección"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="btn-crear-outfit-flotante"
              onClick={onCreateOutfitClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 shadow-xs hover:shadow transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Crear outfit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
