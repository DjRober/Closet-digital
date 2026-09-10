import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, X, Check, AlertCircle, Layers, Palette, Plus, ArrowRight } from 'lucide-react';
import { Garment, Outfit } from '../types';
import { generateAutoOutfit, GeneratedOutfitResult, getGarmentRole, getRoleLabel } from '../lib/outfitGenerator';
import { GarmentVisual } from './GarmentVisual';

interface AutoOutfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  garments: Garment[];
  onSaveOutfit: (outfitData: Omit<Outfit, 'id' | 'createdAt'>) => Promise<void> | void;
  onNavigateToAddGarment?: () => void;
}

export function AutoOutfitModal({
  isOpen,
  onClose,
  garments,
  onSaveOutfit,
  onNavigateToAddGarment,
}: AutoOutfitModalProps) {
  const [result, setResult] = useState<GeneratedOutfitResult | null>(null);
  const [outfitName, setOutfitName] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [historyCombinations, setHistoryCombinations] = useState<string[][]>([]);

  // Run generator when opened
  useEffect(() => {
    if (isOpen) {
      handleGenerateNew(true);
    } else {
      setResult(null);
      setOutfitName('');
      setError(null);
      setHistoryCombinations([]);
    }
  }, [isOpen, garments]);

  const handleGenerateNew = (isInitial = false) => {
    setIsRegenerating(true);
    setError(null);

    // Small timeout to allow visual animation of refresh
    setTimeout(() => {
      const generated = generateAutoOutfit(
        garments,
        isInitial ? [] : historyCombinations
      );

      setResult(generated);
      if (generated.success) {
        setOutfitName(generated.suggestedName);
        const currentComboIds = generated.garments.map((g) => g.id);
        setHistoryCombinations((prev) => [...prev.slice(-6), currentComboIds]);
      }
      setIsRegenerating(false);
    }, 180);
  };

  const handleSave = async () => {
    if (!result || !result.success || result.garments.length === 0) return;

    const trimmedName = outfitName.trim();
    if (!trimmedName) {
      setError('El nombre del outfit no puede estar vacío.');
      return;
    }
    if (trimmedName.length > 60) {
      setError('El nombre del outfit es demasiado largo (máximo 60 caracteres).');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onSaveOutfit({
        name: trimmedName,
        garmentIds: result.garments.map((g) => g.id),
        garments: result.garments,
        occasion: 'Generado automáticamente',
      });
      setIsSaving(false);
      onClose();
    } catch (e) {
      setIsSaving(false);
      setError('Ocurrió un error al guardar el outfit. Inténtalo de nuevo.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-auto-outfit"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#1c152e] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-stone-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#d9a6ff]/30 to-[#ff8fd8]/20 border border-[#d9a6ff]/40 flex items-center justify-center text-[#d9a6ff] shadow-[0_0_20px_rgba(217,166,255,0.3)] shrink-0">
              <Sparkles className="w-5 h-5 drop-shadow-[0_0_8px_rgba(217,166,255,0.8)]" />
            </div>
            <div>
              <h2 id="modal-auto-outfit-title" className="text-lg sm:text-xl font-bold text-white tracking-tight font-['Outfit']">
                Generar outfit automático
              </h2>
              <p className="text-xs text-stone-300">
                Selección basada en reglas lógicas de compatibilidad y armonía
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-cerrar-modal-auto-outfit"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Case 1: Insufficient garments */}
          {result && !result.success && (
            <div id="insufficient-garments-state" className="text-center py-6 px-4 space-y-5">
              <div className="mx-auto w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                  Prendas insuficientes para combinar
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Para armar un outfit por reglas lógicas de compatibilidad, necesitas al menos:
                </p>
              </div>

              {/* Missing requirements list */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-white/[0.05] border border-white/10 text-left space-y-2 text-xs">
                <div className="text-[11px] font-bold tracking-wider text-amber-300 uppercase">
                  Requisitos mínimos faltantes:
                </div>
                {result.missingRequirements?.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-stone-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>

              {/* Current inventory status */}
              <div className="max-w-md mx-auto p-3 rounded-2xl bg-white/[0.02] border border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-white/[0.03]">
                  <span className="block text-stone-400 text-[10px]">Superiores</span>
                  <span className="font-bold text-white text-sm">{result.countsByRole.tops}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03]">
                  <span className="block text-stone-400 text-[10px]">Inferiores</span>
                  <span className="font-bold text-white text-sm">{result.countsByRole.bottoms}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03]">
                  <span className="block text-stone-400 text-[10px]">Vestidos</span>
                  <span className="font-bold text-white text-sm">{result.countsByRole.fullBodies}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {onNavigateToAddGarment && (
                  <button
                    type="button"
                    id="btn-agregar-prenda-desde-auto"
                    onClick={() => {
                      onClose();
                      onNavigateToAddGarment();
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] text-xs font-bold shadow-[0_0_20px_rgba(217,166,255,0.4)] transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Registrar prenda en mi armario</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-stone-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </div>
          )}

          {/* Case 2: Generated outfit success */}
          {result && result.success && (
            <div className="space-y-6">
              {/* Error banner if any */}
              {error && (
                <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 shadow-md">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Name input & Re-generate bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="input-nombre-outfit-auto" className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                    Nombre del outfit sugerido
                  </label>
                  <span className="text-[11px] text-stone-400">
                    {outfitName.length}/60
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    id="input-nombre-outfit-auto"
                    maxLength={60}
                    value={outfitName}
                    onChange={(e) => {
                      setOutfitName(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Ej. Look Casual Armónico"
                    className="flex-1 px-4 py-2.5 text-sm rounded-2xl bg-white/[0.06] border border-white/15 text-white placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#d9a6ff]/50 transition-all"
                  />

                  <button
                    type="button"
                    id="btn-regenerar-outfit"
                    onClick={() => handleGenerateNew(false)}
                    disabled={isRegenerating || isSaving}
                    title="Generar otra combinación lógica de mi armario"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-[#d9a6ff] hover:text-white text-xs font-semibold transition-all cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Otra combinación</span>
                  </button>
                </div>
              </div>

              {/* Selected Garments Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="font-semibold uppercase tracking-wider text-[11px] text-stone-300">
                    Prendas seleccionadas ({result.garments.length})
                  </span>
                  <span>Selección automática</span>
                </div>

                <div
                  id="contenedor-prendas-auto-outfit"
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                >
                  {result.garments.map((garment, idx) => {
                    const role = getGarmentRole(garment);
                    const roleLabel = getRoleLabel(role);

                    return (
                      <div
                        key={garment.id}
                        className="group relative rounded-2xl bg-white/[0.05] border border-white/10 p-3 flex flex-col items-center text-center hover:border-[#d9a6ff]/40 transition-all shadow-sm"
                      >
                        {/* Role tag */}
                        <div className="w-full mb-2">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-tight bg-white/[0.08] text-[#d9a6ff] border border-white/10 truncate max-w-full">
                            {roleLabel}
                          </span>
                        </div>

                        {/* Visual asset */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 mb-2 rounded-xl overflow-hidden flex items-center justify-center">
                          <GarmentVisual
                            imageUrl={garment.imageUrl}
                            iconKey={garment.iconKey}
                            colorHex={garment.colorHex}
                            colorName={garment.color}
                            size="md"
                            className="w-full h-full shadow-inner"
                          />
                        </div>

                        {/* Garment details */}
                        <div className="w-full">
                          <h4 className="text-xs font-bold text-white truncate" title={garment.type}>
                            {garment.type}
                          </h4>
                          <div className="flex items-center justify-center gap-1.5 mt-1 text-[11px] text-stone-300">
                            {garment.colorHex && (
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
                                style={{ backgroundColor: garment.colorHex }}
                              />
                            )}
                            <span className="truncate">{garment.color}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Predefined Rules Explanation Panel */}
              <div
                id="panel-reglas-aplicadas"
                className="p-4 rounded-2xl bg-white/[0.04] border border-white/12 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#d9a6ff] uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-[#d9a6ff]" />
                  <span>Reglas lógicas aplicadas</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Structural formula */}
                  <div className="flex items-start gap-2.5 text-stone-200">
                    <span className="w-5 h-5 rounded-lg bg-[#d9a6ff]/20 text-[#d9a6ff] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-white block font-medium">Compatibilidad de tipos:</strong>
                      <span className="text-stone-300 text-[11px]">{result.explanation.structureRule}</span>
                    </div>
                  </div>

                  {/* Color harmony */}
                  <div className="flex items-start gap-2.5 text-stone-200">
                    <span className="w-5 h-5 rounded-lg bg-[#d9a6ff]/20 text-[#d9a6ff] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-white block font-medium">Armonía cromática:</strong>
                      <span className="text-stone-300 text-[11px]">{result.explanation.colorRule}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 text-[11px] text-stone-400 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#d9a6ff]" />
                  <span>Conjunto armónico listo para usar o guardar en tu colección.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {result && result.success && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => handleGenerateNew(false)}
              disabled={isRegenerating || isSaving}
              className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-stone-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>Probar otra combinación</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="w-1/2 sm:w-auto px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-stone-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Cerrar
              </button>

              <button
                type="button"
                id="btn-guardar-auto-outfit"
                onClick={handleSave}
                disabled={isSaving || isRegenerating}
                className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d9a6ff] to-[#ff8fd8] hover:from-[#eccbff] hover:to-[#ffa6e2] text-[#150f24] text-xs font-bold shadow-[0_0_25px_rgba(217,166,255,0.4)] transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Guardar en mis outfits</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
