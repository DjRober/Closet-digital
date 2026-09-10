import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X } from 'lucide-react';
import { Garment } from '../types';
import { GarmentVisual } from './GarmentVisual';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  garment: Garment | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  isOpen,
  garment,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !garment) return null;

  return (
    <AnimatePresence>
      <div
        id="modal-eliminar-prenda-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-eliminar-titulo"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
        onClick={onCancel}
      >
        <motion.div
          id="modal-eliminar-prenda-content"
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-3xl bg-[#1c152e] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-stone-100 p-6 overflow-hidden"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onCancel}
            id="btn-cerrar-modal-eliminar"
            aria-label="Cerrar diálogo"
            className="absolute top-4 right-4 p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon and Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-300 border border-rose-500/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="pt-0.5 pr-6">
              <h3 id="dialog-eliminar-titulo" className="text-lg font-bold text-white tracking-tight font-['Outfit']">
                ¿Eliminar esta prenda?
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                Esta prenda dejará de estar disponible en tu armario. Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          {/* Garment Preview Box */}
          <div className="my-4 p-3 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/[0.04] border border-white/10 shrink-0 flex items-center justify-center p-1">
              <GarmentVisual
                imageUrl={garment.imageUrl}
                iconKey={garment.iconKey}
                colorHex={garment.colorHex}
                colorName={garment.color}
                size="sm"
                className="w-full h-full rounded"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-white capitalize truncate">{garment.type}</h4>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-stone-300">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white/25 shrink-0"
                  style={{ backgroundColor: garment.colorHex || '#57534e' }}
                />
                <span className="truncate">Color {garment.color}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse sm:flex-row items-center gap-2.5">
            <button
              type="button"
              id="btn-cancelar-eliminar"
              onClick={onCancel}
              className="glass-pill w-full sm:w-1/2 py-2.5 px-4 text-white text-sm font-semibold cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="button"
              id="btn-confirmar-eliminar"
              onClick={onConfirm}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-full bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white text-sm font-semibold transition-all shadow-[0_0_20px_rgba(244,63,94,0.35)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
