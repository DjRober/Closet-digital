import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, X, Wand2, ImagePlus, Trash2, RotateCcw, Shirt, Upload } from 'lucide-react';
import { Garment, LookImage } from '../types';
import { getGarmentRole, GarmentRole } from '../lib/outfitGenerator';

interface LookBuilderProps {
  userId?: string;
  garments?: Garment[];
}

type MainSlot = 'hair' | 'top' | 'bottom' | 'shoes';

interface LookState {
  hair: string | null;
  top: string | null;
  bottom: string | null;
  shoes: string | null;
  accessories: LookImage[];
  hairstyles: LookImage[];
}

const EMPTY_LOOK: LookState = {
  hair: null,
  top: null,
  bottom: null,
  shoes: null,
  accessories: [],
  hairstyles: [],
};

function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Archivo no válido'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Error al leer la imagen'));
    reader.readAsDataURL(file);
  });
}

/** Slot individual que permite subir/quitar una foto */
interface ImageSlotProps {
  imageUrl: string | null;
  placeholder: string;
  shape?: 'circle' | 'rounded';
  onPick: (dataUrl: string) => void;
  onClear?: () => void;
  onRequestPick?: () => void;
  className?: string;
}

function ImageSlot({
  imageUrl,
  placeholder,
  shape = 'rounded',
  onPick,
  onClear,
  onRequestPick,
  className = '',
}: ImageSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const radius = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      onPick(await readImageFile(file));
    } catch {
      alert('Selecciona un archivo de imagen válido.');
    }
    e.target.value = '';
  };

  return (
    <div className={`relative group ${className}`}>
      <button
        type="button"
        onClick={() => (onRequestPick ? onRequestPick() : inputRef.current?.click())}
        title={imageUrl ? 'Cambiar foto' : placeholder}
        className={`w-full h-full ${radius} overflow-hidden flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
          imageUrl
            ? 'border border-white/15'
            : 'border-2 border-dashed border-white/15 bg-white/[0.03] hover:bg-white/[0.07] hover:border-[#d9a6ff]/50'
        }`}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={placeholder} className="w-full h-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-1 px-1 text-stone-400">
            <ImagePlus className="w-4 h-4 text-[#d9a6ff]" />
            <span className="text-[9px] leading-tight">{placeholder}</span>
          </span>
        )}
      </button>
      {imageUrl && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Quitar foto"
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#150f24] border border-white/25 flex items-center justify-center text-stone-300 hover:text-rose-400 hover:border-rose-500/50 cursor-pointer z-10"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

const SLOT_ROLE: Record<Exclude<MainSlot, 'hair'>, GarmentRole> = {
  top: 'top',
  bottom: 'bottom',
  shoes: 'shoes',
};

export function LookBuilder({ userId, garments = [] }: LookBuilderProps) {
  const storageKey = `ropero_look_${userId || 'guest'}`;
  const [look, setLook] = useState<LookState>(EMPTY_LOOK);
  const [loaded, setLoaded] = useState(false);
  const [picker, setPicker] = useState<Exclude<MainSlot, 'hair'> | null>(null);
  const pickerUploadRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  // Prendas del clóset con foto, agrupadas por rol para el selector
  const wardrobeByRole = useMemo(() => {
    const map: Record<string, Garment[]> = { top: [], bottom: [], shoes: [] };
    for (const g of garments) {
      if (!g.imageUrl) continue;
      const role = getGarmentRole(g);
      if (role === 'top' || role === 'bottom' || role === 'shoes') map[role].push(g);
    }
    return map;
  }, [garments]);

  // Cargar look guardado al cambiar de usuario
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as LookState;
        setLook({ ...EMPTY_LOOK, ...parsed });
        const maxId = Math.max(
          0,
          ...(parsed.accessories || []).map((a) => Number(a.id) || 0),
          ...(parsed.hairstyles || []).map((h) => Number(h.id) || 0)
        );
        nextId.current = maxId + 1;
      } else {
        setLook(EMPTY_LOOK);
      }
    } catch {
      setLook(EMPTY_LOOK);
    }
    setLoaded(true);
  }, [storageKey]);

  // Persistir
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(look));
    } catch (e) {
      console.warn('No se pudo guardar el look', e);
    }
  }, [look, loaded, storageKey]);

  const setSlot = (slot: 'hair' | 'top' | 'bottom' | 'shoes', value: string | null) =>
    setLook((prev) => ({ ...prev, [slot]: value }));

  const addAccessory = () =>
    setLook((prev) => ({ ...prev, accessories: [...prev.accessories, { id: String(nextId.current++), imageUrl: '' }] }));
  const setAccessory = (id: string, imageUrl: string) =>
    setLook((prev) => ({ ...prev, accessories: prev.accessories.map((a) => (a.id === id ? { ...a, imageUrl } : a)) }));
  const removeAccessory = (id: string) =>
    setLook((prev) => ({ ...prev, accessories: prev.accessories.filter((a) => a.id !== id) }));

  const addHairstyle = () =>
    setLook((prev) => ({ ...prev, hairstyles: [...prev.hairstyles, { id: String(nextId.current++), imageUrl: '' }] }));
  const setHairstyle = (id: string, imageUrl: string) =>
    setLook((prev) => ({ ...prev, hairstyles: prev.hairstyles.map((h) => (h.id === id ? { ...h, imageUrl } : h)) }));
  const removeHairstyle = (id: string) =>
    setLook((prev) => ({ ...prev, hairstyles: prev.hairstyles.filter((h) => h.id !== id) }));

  const resetLook = () => setLook(EMPTY_LOOK);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/12 flex items-center justify-center text-[#d9a6ff] shadow-[0_0_15px_rgba(217,166,255,0.2)]">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight font-['Outfit']">Arma tu look</h2>
            <p className="text-xs text-stone-400">Sube las fotos de tus prendas y prueba cómo se ven juntas.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={resetLook}
          className="glass-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-stone-300 hover:text-white cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Vaciar look</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Lienzo del look */}
        <div className="lg:col-span-3 glass-panel p-6">
          <div className="text-sm font-semibold text-white font-['Outfit'] mb-4">Tu look de hoy</div>
          <div className="flex flex-col items-center gap-3">
            <ImageSlot
              imageUrl={look.hair}
              placeholder="peinado"
              shape="circle"
              onPick={(u) => setSlot('hair', u)}
              onClear={() => setSlot('hair', null)}
              className="w-16 h-16"
            />
            <ImageSlot
              imageUrl={look.top}
              placeholder="foto de tu top"
              onPick={(u) => setSlot('top', u)}
              onClear={() => setSlot('top', null)}
              onRequestPick={wardrobeByRole.top.length ? () => setPicker('top') : undefined}
              className="w-32 h-40"
            />
            <ImageSlot
              imageUrl={look.bottom}
              placeholder="foto de tu pantalón"
              onPick={(u) => setSlot('bottom', u)}
              onClear={() => setSlot('bottom', null)}
              onRequestPick={wardrobeByRole.bottom.length ? () => setPicker('bottom') : undefined}
              className="w-28 h-36"
            />
            <ImageSlot
              imageUrl={look.shoes}
              placeholder="foto de tu calzado"
              onPick={(u) => setSlot('shoes', u)}
              onClear={() => setSlot('shoes', null)}
              onRequestPick={wardrobeByRole.shoes.length ? () => setPicker('shoes') : undefined}
              className="w-24 h-14"
            />
          </div>
        </div>

        {/* Accesorios y peinados */}
        <div className="lg:col-span-2 space-y-6">
          {/* Accesorios */}
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-white font-['Outfit']">Accesorios</div>
              <button
                type="button"
                onClick={addAccessory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] text-xs font-bold shadow-[0_0_12px_rgba(217,166,255,0.4)] transition-all active:scale-[0.98] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar
              </button>
            </div>
            {look.accessories.length === 0 ? (
              <p className="text-[11px] text-stone-400">Suma aros, bolsos, gorras y compara opciones.</p>
            ) : (
              <div className="grid grid-cols-4 gap-2.5">
                {look.accessories.map((acc) => (
                  <div key={acc.id} className="aspect-square w-full">
                    <ImageSlot
                      imageUrl={acc.imageUrl || null}
                      placeholder="accesorio"
                      shape="circle"
                      onPick={(u) => setAccessory(acc.id, u)}
                      onClear={() => removeAccessory(acc.id)}
                      className="w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Peinados para probar */}
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-white font-['Outfit']">Peinados para probar</div>
              <button
                type="button"
                onClick={addHairstyle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] text-xs font-bold shadow-[0_0_12px_rgba(217,166,255,0.4)] transition-all active:scale-[0.98] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar
              </button>
            </div>
            {look.hairstyles.length === 0 ? (
              <p className="text-[11px] text-stone-400">Agrega fotos de peinados y elige antes de salir.</p>
            ) : (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {look.hairstyles.map((h) => (
                  <div key={h.id} className="w-14 h-14 shrink-0">
                    <ImageSlot
                      imageUrl={h.imageUrl || null}
                      placeholder="peinado"
                      shape="circle"
                      onPick={(u) => setHairstyle(h.id, u)}
                      onClear={() => removeHairstyle(h.id)}
                      className="w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-start gap-2 text-[11px] text-stone-400 px-1">
            <Trash2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-stone-500" />
            <span>Toca la ✕ de cada foto para quitarla. Tu look se guarda automáticamente en este dispositivo.</span>
          </div>
        </div>
      </div>

      {/* Selector de prendas del clóset */}
      {picker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPicker(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl bg-[#1c152e] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-stone-100 overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/12 flex items-center justify-center text-[#d9a6ff]">
                  <Shirt className="w-4 h-4" />
                </div>
                <h3 className="font-['Outfit'] text-base font-bold text-white">Elegir del clóset</h3>
              </div>
              <button
                type="button"
                onClick={() => setPicker(null)}
                aria-label="Cerrar"
                className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {wardrobeByRole[SLOT_ROLE[picker]].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setSlot(picker, g.imageUrl!);
                      setPicker(null);
                    }}
                    title={`${g.type} · ${g.color}`}
                    className="group rounded-2xl overflow-hidden border border-white/10 hover:border-[#d9a6ff]/60 transition-all cursor-pointer aspect-square"
                  >
                    <img src={g.imageUrl} alt={g.type} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => pickerUploadRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-stone-200 text-xs font-semibold transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Subir una foto nueva</span>
              </button>
              <button
                type="button"
                onClick={() => setPicker(null)}
                className="glass-pill px-4 py-2 text-stone-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={pickerUploadRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file || !picker) return;
          try {
            setSlot(picker, await readImageFile(file));
            setPicker(null);
          } catch {
            alert('Selecciona un archivo de imagen válido.');
          }
          e.target.value = '';
        }}
      />
    </div>
  );
}
