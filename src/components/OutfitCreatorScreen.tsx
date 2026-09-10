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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <button
          type="button"
          id="btn-volver-armario"
          onClick={onCancel}
          className="glass-pill inline-flex items-center gap-2 px-4 py-2 text-stone-200 hover:text-white text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al armario</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-stone-400">
          <Sparkles className="w-3.5 h-3.5 text-[#d9a6ff]" />
          <span className="text-white">Nueva combinación</span>
          <span className="px-2.5 py-1 rounded-full bg-[#d9a6ff]/20 text-[#d9a6ff] border border-[#d9a6ff]/30 font-bold">
            {selectedGarments.length} {selectedGarments.length === 1 ? 'prenda' : 'prendas'}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Visual composition of garments together ("las veo juntas en una nueva pantalla") */}
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight font-['Outfit']">
                Prendas combinadas en este outfit
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Así lucen juntas las piezas que seleccionaste de tu armario
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {selectedGarments.map((g) => (
                <span
                  key={`dot-${g.id}`}
                  className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-xs"
                  style={{ backgroundColor: g.colorHex || '#57534e' }}
                  title={`${g.type} - ${g.color}`}
                />
              ))}
            </div>
          </div>

          {selectedGarments.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-white/20 rounded-2xl bg-white/[0.02]">
              <p className="text-sm text-stone-400">
                No hay prendas seleccionadas. Vuelve al armario para elegir prendas.
              </p>
            </div>
          ) : (
            <div
              id="grid-prendas-juntas"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
            >
              {selectedGarments.map((garment) => (
                <div
                  key={garment.id}
                  id={`outfit-item-${garment.id}`}
                  className="group relative glass-card p-4 flex flex-col items-center text-center transition-all hover:border-white/25"
                >
                  {/* Remove piece button */}
                  <button
                    type="button"
                    onClick={() => onRemoveGarment(garment.id)}
                    title={`Quitar ${garment.type} de este outfit`}
                    aria-label={`Quitar ${garment.type}`}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-[#150f24]/80 text-stone-400 hover:text-rose-400 border border-white/15 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Garment Visual */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 my-2 flex items-center justify-center">
                    <GarmentVisual
                      imageUrl={garment.imageUrl}
                      iconKey={garment.iconKey}
                      colorHex={garment.colorHex}
                      colorName={garment.color}
                      size="md"
                      className="w-full h-full rounded-xl"
                    />
                  </div>

                  {/* Garment Details */}
                  <div className="w-full mt-3 pt-3 border-t border-white/[0.08]">
                    <p className="text-xs font-semibold text-white capitalize truncate font-['Outfit']">
                      {garment.type}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 mt-1 text-[11px] text-stone-400">
                      <span
                        className="w-2 h-2 rounded-full border border-white/30"
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
        <div className="glass-panel p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-white/[0.08]">
            <h3 className="text-xl font-bold text-white tracking-tight font-['Outfit']">
              Detalles del outfit
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Asigna un nombre y ocasión para identificarlo fácilmente en tu armario
            </p>
          </div>

          {/* Name input */}
          <div className="space-y-2">
            <label
              htmlFor="input-nombre-outfit"
              className="block text-xs font-bold text-stone-300 uppercase tracking-wider"
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
              className="glass-input w-full px-4 py-2.5 text-sm placeholder-stone-400"
            />
            {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
          </div>

          {/* Occasion / Tag Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
              Ocasión o estilo
            </label>
            <div className="flex flex-wrap gap-2">
              {OCCASION_PRESETS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setOccasion(tag)}
                  className={`glass-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium cursor-pointer ${
                    occasion === tag
                      ? '!bg-[#d9a6ff] !text-[#150f24] !font-bold shadow-[0_0_12px_rgba(217,166,255,0.4)]'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 border-t border-white/[0.08]">
            <button
              type="button"
              id="btn-cancelar-outfit"
              onClick={onCancel}
              className="glass-pill w-full sm:w-1/3 py-3 px-4 text-white text-xs font-semibold cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-guardar-outfit"
              disabled={selectedGarments.length === 0}
              className="w-full sm:w-2/3 py-3 px-6 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] text-sm font-bold shadow-[0_0_25px_rgba(217,166,255,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
