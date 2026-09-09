import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles, X, Tag } from 'lucide-react';
import { Garment, Outfit } from '../types';
import { GarmentVisual } from './GarmentVisual';

interface OutfitCreatorScreenProps {
  selectedGarments: Garment[];
  onSaveOutfit: (outfitData: Omit<Outfit, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  onRemoveGarment: (garmentId: string) => void;
}

const OCCASION_PRESETS = [
  'Casual',
  'Trabajo',
  'Formal',
  'Fin de semana',
  'Noche / Fiesta',
  'Verano',
  'Invierno',
];

export function OutfitCreatorScreen({
  selectedGarments,
  onSaveOutfit,
  onCancel,
  onRemoveGarment,
}: OutfitCreatorScreenProps) {
  // Generate a smart default name based on the selected garments
  const defaultName =
    selectedGarments.length > 0
      ? `Outfit con ${selectedGarments
          .slice(0, 2)
          .map((g) => g.type.toLowerCase())
          .join(' y ')}`
      : 'Mi nuevo outfit';

  const [name, setName] = useState(defaultName);
  const [occasion, setOccasion] = useState('Casual');
  const [error, setError] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor escribe un nombre para el outfit');
      return;
    }
    if (selectedGarments.length === 0) {
      setError('Debes tener al menos una prenda en el outfit');
      return;
    }

    onSaveOutfit({
      name: name.trim(),
      garmentIds: selectedGarments.map((g) => g.id),
      garments: selectedGarments,
      occasion: occasion || undefined,
    });
  };

  return (
    <div id="pantalla-crear-outfit" className="space-y-8 animate-fade-in">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800">
        <button
          type="button"
          id="btn-volver-armario"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium transition-all shadow-2xs hover:shadow-xs active:scale-[0.98] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al armario</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Nueva combinación</span>
          <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
            {selectedGarments.length} {selectedGarments.length === 1 ? 'prenda' : 'prendas'}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Visual composition of garments together ("las veo juntas en una nueva pantalla") */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm p-6 sm:p-7">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
                Prendas combinadas en este outfit
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Así lucen juntas las piezas que seleccionaste de tu armario
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {selectedGarments.map((g) => (
                <span
                  key={`dot-${g.id}`}
                  className="w-3.5 h-3.5 rounded-full border border-stone-300 dark:border-stone-700 shadow-2xs"
                  style={{ backgroundColor: g.colorHex || '#57534e' }}
                  title={`${g.type} - ${g.color}`}
                />
              ))}
            </div>
          </div>

          {selectedGarments.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
              <p className="text-sm text-stone-500 dark:text-stone-400">
                No hay prendas seleccionadas. Vuelve al armario para elegir prendas.
              </p>
            </div>
          ) : (
            <div
              id="grid-prendas-juntas"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {selectedGarments.map((garment) => (
                <div
                  key={garment.id}
                  id={`outfit-item-${garment.id}`}
                  className="group relative bg-stone-50 dark:bg-stone-950/60 rounded-xl border border-stone-200/80 dark:border-stone-800 p-3.5 flex flex-col items-center text-center shadow-2xs hover:shadow-xs transition-all"
                >
                  {/* Remove piece button */}
                  <button
                    type="button"
                    onClick={() => onRemoveGarment(garment.id)}
                    title={`Quitar ${garment.type} de este outfit`}
                    aria-label={`Quitar ${garment.type}`}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white dark:bg-stone-800 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 border border-stone-200 dark:border-stone-700 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* Garment Visual */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 my-2 flex items-center justify-center">
                    <GarmentVisual
                      imageUrl={garment.imageUrl}
                      iconKey={garment.iconKey}
                      colorHex={garment.colorHex}
                      colorName={garment.color}
                      size="md"
                      className="w-full h-full rounded-lg"
                    />
                  </div>

                  {/* Garment Details */}
                  <div className="w-full mt-2 pt-2 border-t border-stone-200/60 dark:border-stone-800/80">
                    <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 capitalize truncate">
                      {garment.type}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 mt-1 text-[11px] text-stone-500 dark:text-stone-400">
                      <span
                        className="w-2 h-2 rounded-full border border-stone-300 dark:border-stone-600"
                        style={{ backgroundColor: garment.colorHex || '#57534e' }}
                      />
                      <span className="truncate">{garment.color}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Outfit Details Form */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="pb-3 border-b border-stone-100 dark:border-stone-800">
            <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
              Detalles del outfit
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Asigna un nombre y ocasión para identificarlo fácilmente en tu armario
            </p>
          </div>

          {/* Name input */}
          <div className="space-y-1.5">
            <label
              htmlFor="input-nombre-outfit"
              className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider"
            >
              Nombre del outfit *
            </label>
            <input
              type="text"
              id="input-nombre-outfit"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ej. Outfit Casual de Viernes"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:bg-white dark:focus:bg-stone-800 transition-all"
            />
            {error && <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>}
          </div>

          {/* Occasion / Tag Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              Ocasión o estilo
            </label>
            <div className="flex flex-wrap gap-2">
              {OCCASION_PRESETS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setOccasion(tag)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    occasion === tag
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              id="btn-cancelar-outfit"
              onClick={onCancel}
              className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-sm font-medium transition-all active:scale-[0.98] cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-guardar-outfit"
              disabled={selectedGarments.length === 0}
              className="w-full sm:w-2/3 py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-white text-sm font-medium tracking-wide shadow-sm hover:shadow active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              <span>Guardar outfit en Mis outfits</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
