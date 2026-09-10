import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, Check, Upload, Sparkles, Edit3, X } from 'lucide-react';
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
  // Mode: 'photo' or 'icon'
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form fields when editingGarment is provided
  useEffect(() => {
    if (editingGarment) {
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
    onCancelEdit?.();
  };

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageUrl(result);
      setVisualMode('photo');
    };
    reader.readAsDataURL(file);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Select garment type preset
  const handleSelectTypePreset = (typeLabel: string, defaultIcon: GarmentIconKey) => {
    setGarmentType(typeLabel);
    if (errors.type) {
      setErrors((prev) => ({ ...prev, type: undefined }));
    }
    // Automatically set default icon if not in photo mode
    if (visualMode === 'icon') {
      setIconKey(defaultIcon);
    }
  };

  // Select color preset
  const handleSelectColorPreset = (name: string, hex: string) => {
    setColorName(name);
    setColorHex(hex);
    if (errors.color) {
      setErrors((prev) => ({ ...prev, color: undefined }));
    }
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { type?: string; color?: string } = {};
    const trimmedType = garmentType.trim();
    const trimmedColor = colorName.trim();

    // Validar tipo de prenda
    if (!trimmedType) {
      newErrors.type = 'El tipo de prenda es obligatorio y no puede ir vacío.';
    } else if (trimmedType.length > 50) {
      newErrors.type = `El tipo de prenda es demasiado largo (máximo 50 caracteres, tiene ${trimmedType.length}).`;
    }

    // Validar color de prenda
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
        colorHex: colorHex,
        imageUrl: visualMode === 'photo' && imageUrl ? imageUrl : undefined,
        iconKey: iconKey,
      };

      onUpdateGarment?.(updatedGarment);
      setFeedbackMessage('¡Prenda actualizada con éxito!');
      setShowSavedFeedback(true);

      // Reset form fields
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
        colorHex: colorHex,
        imageUrl: visualMode === 'photo' && imageUrl ? imageUrl : undefined,
        iconKey: iconKey,
        createdAt: Date.now(),
      };

      onAddGarment(newGarment);
      setFeedbackMessage('¡Prenda agregada al armario!');
      setShowSavedFeedback(true);

      // Reset form fields
      setGarmentType('');
      setColorName('');
      setImageUrl('');
      setErrors({});
    }

    setTimeout(() => {
      setShowSavedFeedback(false);
    }, 2800);
  };

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
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Espacio para foto o ícono de prenda */}
          <div className="md:col-span-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Foto o ícono de prenda
              </label>

              {/* Selector entre modo Foto e Ícono */}
              <div className="inline-flex p-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs">
                <button
                  type="button"
                  id="tab-modo-icono"
                  onClick={() => setVisualMode('icon')}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                    visualMode === 'icon'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-2xs'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  Ícono
                </button>
                <button
                  type="button"
                  id="tab-modo-foto"
                  onClick={() => setVisualMode('photo')}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                    visualMode === 'photo'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-2xs'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
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
                  ? 'border-stone-900 dark:border-stone-100 bg-stone-100 dark:bg-stone-800'
                  : 'border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/80 dark:bg-stone-950/40 hover:bg-stone-50 dark:hover:bg-stone-900/60'
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
                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                      <button
                        type="button"
                        id="btn-cambiar-foto"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-stone-900 text-xs font-medium rounded-lg shadow-sm hover:bg-stone-100 cursor-pointer"
                      >
                        Cambiar foto
                      </button>
                      <button
                        type="button"
                        id="btn-quitar-foto"
                        onClick={() => setImageUrl('')}
                        className="px-3 py-1.5 bg-stone-800 text-white text-xs font-medium rounded-lg shadow-sm hover:bg-stone-700 cursor-pointer"
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
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-stone-800 shadow-xs border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-300 mb-2">
                      <Upload className="w-5 h-5 text-stone-500 dark:text-stone-400" />
                    </div>
                    <span className="text-xs font-medium text-stone-800 dark:text-stone-200">
                      Subir foto de la prenda
                    </span>
                    <span className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
                      Haz clic o arrastra una imagen aquí
                    </span>
                    <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-1 max-w-[220px]">
                      Solo la prenda aislada (evita rostros o datos personales)
                    </span>
                  </div>
                )
              ) : (
                /* Icon Preview Mode */
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <GarmentVisual
                    iconKey={iconKey}
                    colorHex={colorHex}
                    colorName={colorName}
                    size="lg"
                    className="w-24 h-24 shadow-2xs"
                  />
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-2 font-medium">
                    Vista previa de la prenda
                  </span>
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
                <label className="text-[11px] font-medium text-stone-500 dark:text-stone-400 mb-1.5 block">
                  Elegir ícono de prenda:
                </label>
                <div
                  id="selector-iconos-prenda"
                  className="grid grid-cols-4 gap-1.5"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      id={`btn-icono-${opt.key}`}
                      onClick={() => setIconKey(opt.key)}
                      className={`px-2 py-1.5 rounded-lg text-xs flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                        iconKey === opt.key
                          ? 'border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                          : 'border-stone-200 dark:border-stone-700/80 bg-white dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600'
                      }`}
                    >
                      <GarmentVisual
                        iconKey={opt.key}
                        colorHex={iconKey === opt.key ? (colorHex || '#ffffff') : colorHex}
                        size="sm"
                        className="w-7 h-7 bg-transparent border-0"
                      />
                      <span className="text-[10px] truncate max-w-full leading-tight">
                        {opt.label}
                      </span>
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
                <label
                  htmlFor="input-tipo-prenda"
                  className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider block"
                >
                  Tipo de prenda <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-stone-400">
                  {garmentType.length}/50
                </span>
              </div>
              <input
                id="input-tipo-prenda"
                type="text"
                maxLength={50}
                value={garmentType}
                onChange={(e) => {
                  setGarmentType(e.target.value);
                  if (errors.type) {
                    setErrors((prev) => ({ ...prev, type: undefined }));
                  }
                }}
                placeholder="Ej. Camiseta, Pantalón, Chaqueta, Vestido..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 bg-white dark:bg-stone-800/90 focus:outline-hidden focus:ring-2 transition-all ${
                  errors.type
                    ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/40 bg-rose-50/20 dark:bg-rose-950/20'
                    : 'border-stone-200 dark:border-stone-700 focus:border-stone-400 dark:focus:border-stone-500 focus:ring-stone-200 dark:focus:ring-stone-700'
                }`}
              />
              {errors.type && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">{errors.type}</p>
              )}

              {/* Sugerencias rápidas de tipo */}
              <div className="pt-1">
                <span className="text-[11px] text-stone-400 dark:text-stone-500 font-medium block mb-1.5">
                  Sugerencias rápidas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {GARMENT_TYPE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      id={`preset-tipo-${preset.label.toLowerCase()}`}
                      onClick={() => handleSelectTypePreset(preset.label, preset.defaultIcon)}
                      className={`px-2.5 py-1 rounded-lg text-xs border transition-all cursor-pointer ${
                        garmentType.toLowerCase() === preset.label.toLowerCase()
                          ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-2xs'
                          : 'bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
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
                <label
                  htmlFor="input-color-prenda"
                  className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider block"
                >
                  Color <span className="text-rose-500">*</span>
                </label>

                {/* Color preview badge */}
                <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-stone-300 dark:border-stone-600 shadow-2xs"
                    style={{ backgroundColor: colorHex }}
                  />
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {colorName || 'Sin color seleccionado'}
                  </span>
                  <span className="text-[11px] text-stone-400 ml-1">
                    ({colorName.length}/40)
                  </span>
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
                    if (errors.color) {
                      setErrors((prev) => ({ ...prev, color: undefined }));
                    }
                  }}
                  placeholder="Ej. Azul Marino, Blanco, Beige, Negro..."
                  className={`flex-1 px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 bg-white dark:bg-stone-800/90 focus:outline-hidden focus:ring-2 transition-all ${
                    errors.color
                      ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/40 bg-rose-50/20 dark:bg-rose-950/20'
                      : 'border-stone-200 dark:border-stone-700 focus:border-stone-400 dark:focus:border-stone-500 focus:ring-stone-200 dark:focus:ring-stone-700'
                  }`}
                />

                {/* Input selector de color hex nativo */}
                <div className="relative flex items-center">
                  <input
                    id="input-color-picker"
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    title="Elegir tono personalizado"
                    className="w-10 h-10 rounded-xl border border-stone-200 dark:border-stone-700 cursor-pointer p-0.5 bg-white dark:bg-stone-800"
                  />
                </div>
              </div>

              {errors.color && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">{errors.color}</p>
              )}

              {/* Paleta de colores rápidos */}
              <div className="pt-1">
                <span className="text-[11px] text-stone-400 dark:text-stone-500 font-medium block mb-1.5">
                  Colores habituales:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected = colorName.toLowerCase() === preset.name.toLowerCase();
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        id={`preset-color-${preset.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => handleSelectColorPreset(preset.name, preset.hex)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-2xs'
                            : 'bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            preset.border ? 'border border-stone-300 dark:border-stone-600' : ''
                          }`}
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
