import { motion } from 'motion/react';
import { Garment } from '../types';
import { GarmentVisual } from './GarmentVisual';

interface GarmentCardProps {
  key?: string;
  garment: Garment;
  index: number;
}

export function GarmentCard({ garment, index }: GarmentCardProps) {
  return (
    <motion.article
      id={`garment-card-${garment.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      className="group bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Visual Area (Photo or Icon) */}
      <div className="relative aspect-4/3 w-full bg-stone-100/70 overflow-hidden flex items-center justify-center p-3 border-b border-stone-100">
        <GarmentVisual
          imageUrl={garment.imageUrl}
          iconKey={garment.iconKey}
          colorHex={garment.colorHex}
          colorName={garment.color}
          size="lg"
          className="w-full h-full rounded-xl"
        />

        {/* Color badge over visual */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200/70 shadow-xs text-xs text-stone-700">
          <span
            className="w-2.5 h-2.5 rounded-full border border-stone-300 shadow-2xs shrink-0"
            style={{ backgroundColor: garment.colorHex || '#57534e' }}
          />
          <span className="font-medium truncate max-w-[90px]">{garment.color}</span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-stone-900 tracking-tight capitalize">
            {garment.type}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Color: <span className="text-stone-700 font-medium">{garment.color}</span>
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>
            En armario
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
