import { AnimatePresence } from 'motion/react';
import { Garment } from '../types';
import { GarmentCard } from './GarmentCard';
import { Sparkles, Layers, CheckSquare, X, ArrowRight, Wand2 } from 'lucide-react';

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
  onGenerateAutoOutfitClick?: () => void;
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
  onGenerateAutoOutfitClick,
  onDeleteRequest,
  onLoadSampleGarments,
}: GarmentGalleryProps) {
  const selectedCount = selectedGarmentIds.length;

  return (
    <section id="armario-galeria" className="mt-10 scroll-mt-20">
      {/* Gallery Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/12 flex items-center justify-center text-[#d9a6ff] shadow-[0_0_15px_rgba(217,166,255,0.2)]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight font-['Outfit']">
              Prendas en el armario
            </h2>
            <p className="text-xs text-stone-400">
              {isSelectionMode
                ? 'Toca las prendas para seleccionarlas y combinarlas en un outfit'
                : 'Colección actual de prendas registradas'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Garment count badge */}
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/[0.08] text-stone-300 border border-white/12 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]">
            {garments.length} {garments.length === 1 ? 'prenda' : 'prendas'}
          </span>

          {/* Quick Generate Auto Outfit Button */}
          {onGenerateAutoOutfitClick && (
            <button
              type="button"
              id="btn-galeria-generar-auto-outfit"
              onClick={onGenerateAutoOutfitClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#d9a6ff] to-[#ff8fd8] hover:from-[#eccbff] hover:to-[#ffa6e2] text-[#150f24] text-xs font-bold shadow-[0_0_15px_rgba(217,166,255,0.4)] transition-all active:scale-[0.98] cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Generar outfit</span>
            </button>
          )}

          {/* Toggle Selection / Combinar mode button */}
          <button
            type="button"
            id="btn-modo-combinar-outfit"
            onClick={onToggleSelectionMode}
            className={`glass-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium cursor-pointer ${
              isSelectionMode
                ? '!bg-[#d9a6ff] !text-[#150f24] !font-bold shadow-[0_0_15px_rgba(217,166,255,0.5)]'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{isSelectionMode ? 'Modo selección activo' : 'Seleccionar prendas'}</span>
          </button>

          {/* Primary "Crear outfit" button in header */}
          <button
            type="button"
            id="btn-crear-outfit"
            onClick={onCreateOutfitClick}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-[0.98] cursor-pointer ${
              selectedCount > 0
                ? 'bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] shadow-[0_0_20px_rgba(217,166,255,0.5)]'
                : 'bg-white/[0.1] hover:bg-white/[0.16] text-white border border-white/15'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
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
          className="mb-6 p-4 rounded-2xl glass-panel border border-[#d9a6ff]/30 shadow-[0_0_20px_rgba(217,166,255,0.15)] flex items-center justify-between gap-3 text-xs text-stone-200 animate-fade-in"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d9a6ff] animate-pulse shadow-[0_0_8px_#d9a6ff]" />
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
              className="text-[#d9a6ff] hover:underline text-xs font-medium cursor-pointer"
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
          className="glass-panel p-10 sm:p-14 text-center border-dashed border-white/20"
        >
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-[#d9a6ff] mb-4 shadow-[0_0_20px_rgba(217,166,255,0.25)]">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-white font-['Outfit']">
            {isUserLoggedIn ? 'Tu armario personal está listo' : 'Aún no hay prendas en el armario'}
          </h3>
          <p className="text-xs text-stone-400 mt-1.5 max-w-md mx-auto leading-relaxed">
            {isUserLoggedIn
              ? 'Registrá tus prendas usando el formulario de arriba para armar tu vestidor en la nube.'
              : 'Completá los datos arriba (foto o ícono, tipo y color) y presioná "Guardar prenda" para registrar tu primera pieza.'}
          </p>

          {isUserLoggedIn && onLoadSampleGarments && (
            <div className="mt-5">
              <button
                type="button"
                id="btn-cargar-prendas-muestra"
                onClick={onLoadSampleGarments}
                className="glass-pill inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white hover:text-[#d9a6ff] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#d9a6ff]" />
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
          className="fixed bottom-6 inset-x-4 max-w-lg mx-auto z-40 glass-panel !bg-[#1c152e]/95 backdrop-blur-2xl border border-white/20 p-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 shadow-[0_20px_60px_rgba(0,0,0,0.7),0_1px_0_0_rgba(255,255,255,0.2)_inset] animate-fade-in"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#d9a6ff] text-[#150f24] flex items-center justify-center text-xs font-extrabold shadow-[0_0_10px_rgba(217,166,255,0.5)]">
              {selectedCount}
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {selectedCount === 1 ? '1 prenda seleccionada' : `${selectedCount} prendas seleccionadas`}
              </p>
              <p className="text-[11px] text-stone-300">Listas para armar tu combinación</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-cancelar-seleccion-flotante"
              onClick={onClearSelection}
              className="p-2 rounded-full text-stone-400 hover:text-white transition-colors cursor-pointer"
              title="Cancelar selección"
              aria-label="Cancelar selección"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="btn-crear-outfit-flotante"
              onClick={onCreateOutfitClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] text-xs font-bold shadow-[0_0_20px_rgba(217,166,255,0.4)] transition-all active:scale-[0.98] cursor-pointer"
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
