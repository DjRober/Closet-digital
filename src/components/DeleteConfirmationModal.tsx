import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X, AlertCircle } from 'lucide-react';
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
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs"
        onClick={onCancel}
      >
        <motion.div
          id="modal-eliminar-prenda-content"
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 overflow-hidden"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onCancel}
            id="btn-cerrar-modal-eliminar"
            aria-label="Cerrar diálogo"
            className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon and Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="pt-0.5 pr-6">
              <h3
                id="dialog-eliminar-titulo"
                className="text-lg font-semibold text-stone-900 dark:text-stone-100 tracking-tight"
              >
                ¿Eliminar esta prenda?
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                Esta prenda dejará de estar disponible en tu armario. Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          {/* Garment Preview Box */}
          <div className="my-4 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shrink-0 flex items-center justify-center p-1">
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
              <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 capitalize truncate">
                {garment.type}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-stone-600 dark:text-stone-300">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-stone-300 dark:border-stone-600 shrink-0"
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
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-sm font-medium transition-all hover:shadow-xs active:scale-[0.98] cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="button"
              id="btn-confirmar-eliminar"
              onClick={onConfirm}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-medium transition-all shadow-xs hover:shadow hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
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
