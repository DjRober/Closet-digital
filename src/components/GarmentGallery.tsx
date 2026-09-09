import { AnimatePresence } from 'motion/react';
import { Garment } from '../types';
import { GarmentCard } from './GarmentCard';
import { Sparkles, Layers } from 'lucide-react';

interface GarmentGalleryProps {
  garments: Garment[];
  onDeleteRequest: (garment: Garment) => void;
}

export function GarmentGallery({ garments, onDeleteRequest }: GarmentGalleryProps) {
  return (
    <section id="armario-galeria" className="mt-10">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-200/80 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
              Prendas en el armario
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Colección actual de prendas registradas
            </p>
          </div>
        </div>

        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
          {garments.length} {garments.length === 1 ? 'prenda' : 'prendas'}
        </span>
      </div>

      {garments.length === 0 ? (
        <div
          id="armario-empty-state"
          className="rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/40 p-12 text-center"
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 dark:text-stone-500 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100">
            Aún no hay prendas en el armario
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
            Completa los datos arriba (foto o ícono, tipo y color) y presiona &quot;Guardar prenda&quot; para registrar tu primera pieza.
          </p>
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
                onDeleteRequest={onDeleteRequest}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
