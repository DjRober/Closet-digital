import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Check, Upload, Sparkles } from 'lucide-react';
import { Garment, GarmentIconKey } from '../types';
import { GARMENT_TYPE_PRESETS, COLOR_PRESETS, ICON_OPTIONS } from '../data/garmentOptions';
import { GarmentVisual } from './GarmentVisual';

interface GarmentFormProps {
  onAddGarment: (garment: Garment) => void;
}

export function GarmentForm({ onAddGarment }: GarmentFormProps) {
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

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!garmentType.trim()) {
      newErrors.type = 'Por favor especifica el tipo de prenda (ej. Camiseta, Pantalón).';
    }
    if (!colorName.trim()) {
      newErrors.color = 'Por favor especifica o selecciona un color.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newGarment: Garment = {
      id: `garment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: garmentType.trim(),
      color: colorName.trim(),
      colorHex: colorHex,
      imageUrl: visualMode === 'photo' && imageUrl ? imageUrl : undefined,
      iconKey: iconKey,
      createdAt: Date.now(),
    };

    onAddGarment(newGarment);

    // Reset form fields
    setGarmentType('');
    setColorName('');
    setImageUrl('');
    setErrors({});
    setShowSavedFeedback(true);

    setTimeout(() => {
      setShowSavedFeedback(false);
    }, 2800);
  };

  return (
    <div
      id="registro-prenda-container"
      className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-7"
    >
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 tracking-tight">
            Registrar nueva prenda
          </h2>
          <p className="text-xs text-stone-500">
            Añade los datos de la prenda para guardarla en tu armario
          </p>
        </div>

        {showSavedFeedback && (
          <div
            id="guardado-feedback-badge"
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-full animate-fade-in"
          >
            <Check className="w-3.5 h-3.5" />
            <span>¡Prenda agregada al armario!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Espacio para foto o ícono de prenda */}
          <div className="md:col-span-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Foto o ícono de prenda
              </label>

              {/* Selector entre modo Foto e Ícono */}
              <div className="inline-flex p-0.5 rounded-lg bg-stone-100 border border-stone-200 text-xs">
                <button
                  type="button"
                  id="tab-modo-icono"
                  onClick={() => setVisualMode('icon')}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                    visualMode === 'icon'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
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
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
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
                  ? 'border-stone-900 bg-stone-100'
                  : 'border-dashed border-stone-300 bg-stone-50/80 hover:bg-stone-50'
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
                        className="px-3 py-1.5 bg-white text-stone-900 text-xs font-medium rounded-lg shadow-sm hover:bg-stone-100"
                      >
                        Cambiar foto
                      </button>
                      <button
                        type="button"
                        id="btn-quitar-foto"
                        onClick={() => setImageUrl('')}
                        className="px-3 py-1.5 bg-stone-800 text-white text-xs font-medium rounded-lg shadow-sm hover:bg-stone-700"
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
                    <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-600 mb-2">
                      <Upload className="w-5 h-5 text-stone-500" />
                    </div>
                    <span className="text-xs font-medium text-stone-800">
                      Subir foto de la prenda
                    </span>
                    <span className="text-[11px] text-stone-400 mt-0.5">
                      Haz clic o arrastra una imagen aquí
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
                  <span className="text-[11px] text-stone-500 mt-2 font-medium">
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
                <label className="text-[11px] font-medium text-stone-500 mb-1.5 block">
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
                      className={`px-2 py-1.5 rounded-lg text-xs flex flex-col items-center gap-1 border transition-all ${
                        iconKey === opt.key
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <GarmentVisual
                        iconKey={opt.key}
                        colorHex={iconKey === opt.key ? '#ffffff' : colorHex}
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
              <label
                htmlFor="input-tipo-prenda"
                className="text-xs font-semibold text-stone-700 uppercase tracking-wider block"
              >
                Tipo de prenda <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-tipo-prenda"
                type="text"
                value={garmentType}
                onChange={(e) => {
                  setGarmentType(e.target.value);
                  if (errors.type) {
                    setErrors((prev) => ({ ...prev, type: undefined }));
                  }
                }}
                placeholder="Ej. Camiseta, Pantalón, Chaqueta, Vestido..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 placeholder-stone-400 bg-white focus:outline-hidden focus:ring-2 transition-all ${
                  errors.type
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-stone-200 focus:border-stone-400 focus:ring-stone-200'
                }`}
              />
              {errors.type && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.type}</p>
              )}

              {/* Sugerencias rápidas de tipo */}
              <div className="pt-1">
                <span className="text-[11px] text-stone-400 font-medium block mb-1.5">
                  Sugerencias rápidas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {GARMENT_TYPE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      id={`preset-tipo-${preset.label.toLowerCase()}`}
                      onClick={() => handleSelectTypePreset(preset.label, preset.defaultIcon)}
                      className={`px-2.5 py-1 rounded-lg text-xs border transition-all ${
                        garmentType.toLowerCase() === preset.label.toLowerCase()
                          ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
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
                  className="text-xs font-semibold text-stone-700 uppercase tracking-wider block"
                >
                  Color <span className="text-rose-500">*</span>
                </label>

                {/* Color preview badge */}
                <div className="flex items-center gap-1.5 text-xs text-stone-600">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-2xs"
                    style={{ backgroundColor: colorHex }}
                  />
                  <span className="font-medium text-stone-800">
                    {colorName || 'Sin color seleccionado'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  id="input-color-prenda"
                  type="text"
                  value={colorName}
                  onChange={(e) => {
                    setColorName(e.target.value);
                    if (errors.color) {
                      setErrors((prev) => ({ ...prev, color: undefined }));
                    }
                  }}
                  placeholder="Ej. Azul Marino, Blanco, Beige, Negro..."
                  className={`flex-1 px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 placeholder-stone-400 bg-white focus:outline-hidden focus:ring-2 transition-all ${
                    errors.color
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-stone-200 focus:border-stone-400 focus:ring-stone-200'
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
                    className="w-10 h-10 rounded-xl border border-stone-200 cursor-pointer p-0.5 bg-white"
                  />
                </div>
              </div>

              {errors.color && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.color}</p>
              )}

              {/* Paleta de colores rápidos */}
              <div className="pt-1">
                <span className="text-[11px] text-stone-400 font-medium block mb-1.5">
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
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-all ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                            : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                        }`}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            preset.border ? 'border border-stone-300' : ''
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

            {/* Botón de Guardar */}
            <div className="pt-2">
              <button
                type="submit"
                id="btn-guardar-prenda"
                className="w-full py-3 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-sm font-medium tracking-wide shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Guardar prenda en el armario</span>
              </button>
              <p className="text-[11px] text-stone-400 text-center mt-2">
                La prenda se agregará inmediatamente a la galería de tu armario aquí abajo.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
