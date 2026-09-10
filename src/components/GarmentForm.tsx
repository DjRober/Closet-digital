import React, { useState, useRef, useEffect } from 'react';
import { Camera, Check, Upload, Sparkles, Edit3, X, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { Garment, GarmentIconKey } from '../types';
import { GARMENT_TYPE_PRESETS, COLOR_PRESETS, ICON_OPTIONS } from '../data/garmentOptions';
import { GarmentVisual } from './GarmentVisual';

interface GarmentFormProps {
  onAddGarment: (garment: Garment) => void;
  editingGarment?: Garment | null;
  onUpdateGarment?: (garment: Garment) => void;
  onCancelEdit?: () => void;
}

export function GarmentForm({
  onAddGarment,
  editingGarment,
  onUpdateGarment,
  onCancelEdit,
}: GarmentFormProps) {
  const [visualMode, setVisualMode] = useState<'photo' | 'icon'>('icon');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [iconKey, setIconKey] = useState<GarmentIconKey>('shirt');
  const [garmentType, setGarmentType] = useState<string>('');
  const [colorName, setColorName] = useState<string>('');
  const [colorHex, setColorHex] = useState<string>('#1c1917');
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<{ type?: string; color?: string }>({});
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('¡Prenda guardada!');
  // Colapsado por defecto: el formulario no debe dominar si no se va a usar
  const [expanded, setExpanded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingGarment) {
      setExpanded(true);
      setGarmentType(editingGarment.type);
      setColorName(editingGarment.color);
      setColorHex(editingGarment.colorHex || '#1c1917');
      if (editingGarment.imageUrl) {
        setImageUrl(editingGarment.imageUrl);
        setVisualMode('photo');
      } else {
        setImageUrl('');
        setVisualMode('icon');
        setIconKey(editingGarment.iconKey || 'shirt');
      }
      setErrors({});
    }
  }, [editingGarment]);

  const handleCancel = () => {
    setGarmentType('');
    setColorName('');
    setColorHex('#1c1917');
    setImageUrl('');
    setIconKey('shirt');
    setVisualMode('icon');
    setErrors({});
    setExpanded(false);
    onCancelEdit?.();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result as string);
      setVisualMode('photo');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSelectTypePreset = (typeLabel: string, defaultIcon: GarmentIconKey) => {
    setGarmentType(typeLabel);
    if (errors.type) setErrors((prev) => ({ ...prev, type: undefined }));
    if (visualMode === 'icon') setIconKey(defaultIcon);
  };

  const handleSelectColorPreset = (name: string, hex: string) => {
    setColorName(name);
    setColorHex(hex);
    if (errors.color) setErrors((prev) => ({ ...prev, color: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { type?: string; color?: string } = {};
    const trimmedType = garmentType.trim();
    const trimmedColor = colorName.trim();

    if (!trimmedType) {
      newErrors.type = 'El tipo de prenda es obligatorio y no puede ir vacío.';
    } else if (trimmedType.length > 50) {
      newErrors.type = `El tipo de prenda es demasiado largo (máximo 50 caracteres, tiene ${trimmedType.length}).`;
    }

    if (!trimmedColor) {
      newErrors.color = 'El color de la prenda es obligatorio y no puede ir vacío.';
    } else if (trimmedColor.length > 40) {
      newErrors.color = `El color es demasiado largo (máximo 40 caracteres, tiene ${trimmedColor.length}).`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingGarment) {
      const updatedGarment: Garment = {
        ...editingGarment,
        type: trimmedType,
        color: trimmedColor,
        colorHex,
        imageUrl: visualMode === 'photo' && imageUrl ? imageUrl : undefined,
        iconKey,
      };
      onUpdateGarment?.(updatedGarment);
      setFeedbackMessage('¡Prenda actualizada con éxito!');
      setShowSavedFeedback(true);
      setGarmentType('');
      setColorName('');
      setImageUrl('');
      setErrors({});
      onCancelEdit?.();
    } else {
      const newGarment: Garment = {
        id: `garment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: trimmedType,
        color: trimmedColor,
        colorHex,
        imageUrl: visualMode === 'photo' && imageUrl ? imageUrl : undefined,
        iconKey,
        createdAt: Date.now(),
        favorite: false,
        wearCount: 0,
      };
      onAddGarment(newGarment);
      setFeedbackMessage('¡Prenda agregada al armario!');
      setShowSavedFeedback(true);
      setGarmentType('');
      setColorName('');
      setImageUrl('');
      setErrors({});
    }

    setTimeout(() => setShowSavedFeedback(false), 2800);
  };

  const fieldLabel = 'text-xs font-semibold text-stone-300 uppercase tracking-wider';
  const inputBase =
    'w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-stone-500 bg-white/[0.06] border focus:outline-hidden focus:ring-2 transition-all';
  const inputNormal = 'border-white/15 focus:border-[#d9a6ff]/50 focus:ring-[#d9a6ff]/25';
  const inputError = 'border-rose-400/60 focus:ring-rose-400/25 bg-rose-500/10';

  // Estado colapsado: tarjeta compacta que no domina la pantalla
  if (!expanded) {
    return (
      <div id="registro-prenda-container" className="glass-panel p-4 sm:p-5">
        <button
          type="button"
          id="btn-abrir-registro-prenda"
          onClick={() => setExpanded(true)}
          className="w-full flex items-center gap-4 text-left cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#d9a6ff] text-[#150f24] flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(217,166,255,0.4)] transition-transform group-hover:scale-105">
            <Plus className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-bold text-white font-['Outfit']">Registrar nueva prenda</div>
            <div className="text-xs text-stone-400">Agrega una prenda a tu clóset cuando la necesites</div>
          </div>
          <ChevronDown className="w-5 h-5 text-stone-400 group-hover:text-white transition-colors shrink-0" />
        </button>
      </div>
    );
  }

  return (
    <div
      id="registro-prenda-container"
      className={`glass-panel p-6 sm:p-8 transition-all ${
        editingGarment
          ? '!border-[#d9a6ff] ring-2 ring-[#d9a6ff]/50 shadow-[0_0_30px_rgba(217,166,255,0.25)]'
          : 'border-white/15'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          {editingGarment && (
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40">
              <Edit3 className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight font-['Outfit']">
                {editingGarment ? 'Editar prenda' : 'Registrar nueva prenda'}
              </h2>
              {editingGarment && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Modo edición
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400">
              {editingGarment
                ? 'Modifica el tipo, color o ícono y guarda los cambios'
                : 'Añade los datos de la prenda para guardarla en tu armario'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {editingGarment && (
            <button
              type="button"
              id="btn-cancelar-edicion-top"
              onClick={handleCancel}
              className="glass-pill inline-flex items-center gap-1.5 px-3 py-1.5 text-stone-300 hover:text-white text-xs font-medium cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancelar edición</span>
            </button>
          )}

          {showSavedFeedback && (
            <div
              id="guardado-feedback-badge"
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold rounded-full animate-fade-in shadow-[0_0_12px_rgba(110,231,200,0.3)]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          {!editingGarment && (
            <button
              type="button"
              id="btn-contraer-registro-prenda"
              onClick={() => setExpanded(false)}
              title="Contraer"
              aria-label="Contraer formulario"
              className="glass-pill p-1.5 text-stone-300 hover:text-white cursor-pointer"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Espacio para foto o ícono de prenda */}
          <div className="md:col-span-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <label className={fieldLabel}>Foto o ícono de prenda</label>

              {/* Selector entre modo Foto e Ícono */}
              <div className="inline-flex p-0.5 rounded-lg bg-white/[0.06] border border-white/12 text-xs">
                <button
                  type="button"
                  id="tab-modo-icono"
                  onClick={() => setVisualMode('icon')}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 cursor-pointer ${
                    visualMode === 'icon'
                      ? 'bg-[#d9a6ff] text-[#150f24] shadow-[0_0_10px_rgba(217,166,255,0.4)]'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  Ícono
                </button>
                <button
                  type="button"
                  id="tab-modo-foto"
                  onClick={() => setVisualMode('photo')}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 cursor-pointer ${
                    visualMode === 'photo'
                      ? 'bg-[#d9a6ff] text-[#150f24] shadow-[0_0_10px_rgba(217,166,255,0.4)]'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  Foto
                </button>
              </div>
            </div>

            {/* Visual Canvas / Drop Zone */}
            <div
              id="espacio-visual-prenda"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative aspect-4/3 w-full rounded-2xl border-2 transition-all flex flex-col items-center justify-center p-4 overflow-hidden ${
                isDragOver
                  ? 'border-[#d9a6ff] bg-[#d9a6ff]/10'
                  : 'border-dashed border-white/15 bg-black/20 hover:bg-white/[0.04]'
              }`}
            >
              {visualMode === 'photo' ? (
                imageUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt="Previsualización de la prenda"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                      <button
                        type="button"
                        id="btn-cambiar-foto"
                        onClick={() => fileInputRef.current?.click()}
                        className="glass-pill px-3 py-1.5 text-white text-xs font-medium cursor-pointer"
                      >
                        Cambiar foto
                      </button>
                      <button
                        type="button"
                        id="btn-quitar-foto"
                        onClick={() => setImageUrl('')}
                        className="px-3 py-1.5 bg-rose-500/90 hover:bg-rose-500 text-white text-xs font-medium rounded-full cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer text-center flex flex-col items-center justify-center h-full w-full py-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/12 flex items-center justify-center text-[#d9a6ff] mb-2 shadow-[0_0_14px_rgba(217,166,255,0.2)]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-stone-200">Subir foto de la prenda</span>
                    <span className="text-[11px] text-stone-400 mt-0.5">Haz clic o arrastra una imagen aquí</span>
                    <span className="text-[10px] text-stone-500 mt-1 max-w-[220px]">
                      Solo la prenda aislada (evita rostros o datos personales)
                    </span>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <GarmentVisual iconKey={iconKey} colorHex={colorHex} colorName={colorName} size="lg" className="w-24 h-24" />
                  <span className="text-[11px] text-stone-400 mt-2 font-medium">Vista previa de la prenda</span>
                </div>
              )}

              <input
                ref={fileInputRef}
                id="input-archivo-foto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* If icon mode, select icon option */}
            {visualMode === 'icon' && (
              <div>
                <label className="text-[11px] font-medium text-stone-400 mb-1.5 block">Elegir ícono de prenda:</label>
                <div id="selector-iconos-prenda" className="grid grid-cols-4 gap-1.5">
                  {ICON_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      id={`btn-icono-${opt.key}`}
                      onClick={() => setIconKey(opt.key)}
                      className={`px-2 py-1.5 rounded-lg text-xs flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                        iconKey === opt.key
                          ? 'border-[#d9a6ff] bg-[#d9a6ff]/15 text-white shadow-[0_0_12px_rgba(217,166,255,0.25)]'
                          : 'border-white/10 bg-white/[0.04] text-stone-300 hover:border-white/25'
                      }`}
                    >
                      <GarmentVisual
                        iconKey={opt.key}
                        colorHex={colorHex}
                        size="sm"
                        className="w-7 h-7 !bg-transparent !border-0"
                      />
                      <span className="text-[10px] truncate max-w-full leading-tight">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Campos para Tipo y Color */}
          <div className="md:col-span-7 flex flex-col space-y-5">
            {/* Campo Tipo de Prenda */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="input-tipo-prenda" className={`${fieldLabel} block`}>
                  Tipo de prenda <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-stone-400">{garmentType.length}/50</span>
              </div>
              <input
                id="input-tipo-prenda"
                type="text"
                maxLength={50}
                value={garmentType}
                onChange={(e) => {
                  setGarmentType(e.target.value);
                  if (errors.type) setErrors((prev) => ({ ...prev, type: undefined }));
                }}
                placeholder="Ej. Camiseta, Pantalón, Chaqueta, Vestido..."
                className={`${inputBase} ${errors.type ? inputError : inputNormal}`}
              />
              {errors.type && <p className="text-xs text-rose-300 mt-1 font-medium">{errors.type}</p>}

              {/* Sugerencias rápidas de tipo */}
              <div className="pt-1">
                <span className="text-[11px] text-stone-400 font-medium block mb-1.5">Sugerencias rápidas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {GARMENT_TYPE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      id={`preset-tipo-${preset.label.toLowerCase()}`}
                      onClick={() => handleSelectTypePreset(preset.label, preset.defaultIcon)}
                      className={`px-2.5 py-1 rounded-full text-xs border transition-all cursor-pointer ${
                        garmentType.toLowerCase() === preset.label.toLowerCase()
                          ? 'bg-[#d9a6ff] text-[#150f24] border-transparent font-semibold shadow-[0_0_12px_rgba(217,166,255,0.35)]'
                          : 'bg-white/[0.06] hover:bg-white/[0.12] text-stone-300 border-white/12'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Campo Color */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="input-color-prenda" className={`${fieldLabel} block`}>
                  Color <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center gap-1.5 text-xs text-stone-300">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/25" style={{ backgroundColor: colorHex }} />
                  <span className="font-medium text-stone-200">{colorName || 'Sin color seleccionado'}</span>
                  <span className="text-[11px] text-stone-400 ml-1">({colorName.length}/40)</span>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  id="input-color-prenda"
                  type="text"
                  maxLength={40}
                  value={colorName}
                  onChange={(e) => {
                    setColorName(e.target.value);
                    if (errors.color) setErrors((prev) => ({ ...prev, color: undefined }));
                  }}
                  placeholder="Ej. Azul Marino, Blanco, Beige, Negro..."
                  className={`flex-1 ${inputBase} ${errors.color ? inputError : inputNormal}`}
                />
                <input
                  id="input-color-picker"
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  title="Elegir tono personalizado"
                  className="w-11 h-11 rounded-xl border border-white/15 cursor-pointer p-0.5 bg-white/[0.06]"
                />
              </div>

              {errors.color && <p className="text-xs text-rose-300 mt-1 font-medium">{errors.color}</p>}

              {/* Paleta de colores rápidos */}
              <div className="pt-1">
                <span className="text-[11px] text-stone-400 font-medium block mb-1.5">Colores habituales:</span>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected = colorName.toLowerCase() === preset.name.toLowerCase();
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        id={`preset-color-${preset.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => handleSelectColorPreset(preset.name, preset.hex)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#d9a6ff] text-[#150f24] border-transparent font-semibold shadow-[0_0_12px_rgba(217,166,255,0.35)]'
                            : 'bg-white/[0.06] hover:bg-white/[0.12] text-stone-300 border-white/12'
                        }`}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${preset.border ? 'border border-white/30' : ''}`}
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Botón de Guardar / Actualizar */}
            <div className="pt-3">
              {editingGarment ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    id="btn-cancelar-edicion"
                    onClick={handleCancel}
                    className="glass-pill w-1/3 py-3 px-4 text-white text-xs font-semibold cursor-pointer text-center"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    id="btn-guardar-prenda"
                    className="flex-1 py-3 px-5 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] text-sm font-bold shadow-[0_0_20px_rgba(217,166,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar cambios</span>
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  id="btn-guardar-prenda"
                  className="w-full py-3.5 px-6 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] text-sm font-bold shadow-[0_4px_24px_rgba(0,0,0,0.3),0_0_25px_rgba(217,166,255,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar prenda en el armario</span>
                </button>
              )}
              <p className="text-[11px] text-stone-400 text-center mt-2.5">
                {editingGarment
                  ? 'Los cambios se actualizarán inmediatamente en la tarjeta del armario.'
                  : 'La prenda se agregará inmediatamente a la galería de tu armario aquí abajo.'}
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
