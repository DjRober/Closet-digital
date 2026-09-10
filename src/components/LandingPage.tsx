import { useState } from 'react';
import {
  Sparkles,
  CloudSun,
  Star,
  BarChart3,
  Shirt,
  ArrowRight,
  Check,
  Glasses,
  Watch,
  Smile,
  Plus,
  Compass,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Garment } from '../types';
import { ShaderBackground } from './ShaderBackground';

interface LandingPageProps {
  onEnterApp: () => void;
  onSignUp: () => void;
  onSignIn?: () => void;
  onOpenOutfits?: () => void;
  onOpenOutfitCreator: () => void;
  totalGarments: number;
  totalOutfits: number;
  userEmail?: string | null;
  userName?: string | null;
}

interface MockItem {
  id: string;
  name: string;
  category: 'Top' | 'Pantalón' | 'Vestido' | 'Calzado' | 'Abrigo';
  wear: number;
  fav: boolean;
  colorHex: string;
  iconName: 'shirt' | 'pants' | 'dress' | 'shoes' | 'coat';
}

const SAMPLE_ITEMS: MockItem[] = [
  { id: '1', name: 'Camisa blanca', category: 'Top', wear: 12, fav: true, colorHex: '#f8fafc', iconName: 'shirt' },
  { id: '2', name: 'Suéter mostaza', category: 'Top', wear: 8, fav: false, colorHex: '#eab308', iconName: 'shirt' },
  { id: '3', name: 'Jean azul', category: 'Pantalón', wear: 22, fav: true, colorHex: '#3b82f6', iconName: 'pants' },
  { id: '4', name: 'Pantalón beige', category: 'Pantalón', wear: 15, fav: false, colorHex: '#d6c0a5', iconName: 'pants' },
  { id: '5', name: 'Vestido floral', category: 'Vestido', wear: 6, fav: true, colorHex: '#ec4899', iconName: 'dress' },
  { id: '6', name: 'Zapatillas blancas', category: 'Calzado', wear: 28, fav: true, colorHex: '#ffffff', iconName: 'shoes' },
  { id: '7', name: 'Botas marrones', category: 'Calzado', wear: 9, fav: false, colorHex: '#78350f', iconName: 'shoes' },
  { id: '8', name: 'Abrigo camel', category: 'Abrigo', wear: 4, fav: false, colorHex: '#b45309', iconName: 'coat' },
];

export function LandingPage({
  onEnterApp,
  onSignUp,
  onSignIn,
  onOpenOutfits,
  onOpenOutfitCreator,
  totalGarments,
  totalOutfits,
  userEmail,
  userName,
}: LandingPageProps) {
  // Interactive category filter for the mockup view
  const [selectedCategory, setSelectedCategory] = useState<string>('Todo');
  const [interactiveItems, setInteractiveItems] = useState<MockItem[]>(SAMPLE_ITEMS);

  // Look visualizer state
  const [activeTop, setActiveTop] = useState<string>('Suéter mostaza');
  const [activeBottom, setActiveBottom] = useState<string>('Jean azul');
  const [activeShoes, setActiveShoes] = useState<string>('Botas marrones');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(['Lentes de sol', 'Reloj clásico']);
  const [activeHairstyle, setActiveHairstyle] = useState<string>('Ondas naturales');

  const filteredItems = interactiveItems.filter((item) => {
    if (selectedCategory === 'Todo') return true;
    if (selectedCategory === 'Tops') return item.category === 'Top';
    if (selectedCategory === 'Pantalones') return item.category === 'Pantalón';
    if (selectedCategory === 'Vestidos') return item.category === 'Vestido';
    if (selectedCategory === 'Calzado') return item.category === 'Calzado';
    if (selectedCategory === 'Abrigos') return item.category === 'Abrigo';
    return true;
  });

  const toggleFavorite = (id: string) => {
    setInteractiveItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, fav: !item.fav } : item))
    );
  };

  const addAccessoryPrompt = () => {
    const options = ['Bufanda suave', 'Cartera negra', 'Collar minimalista', 'Sombrero'];
    const next = options.find((opt) => !selectedAccessories.includes(opt));
    if (next) {
      setSelectedAccessories((prev) => [...prev, next]);
    }
  };

  const removeAccessory = (acc: string) => {
    setSelectedAccessories((prev) => prev.filter((a) => a !== acc));
  };

  // Usage stats calculation
  const maxWear = Math.max(...interactiveItems.map((i) => i.wear), 1);
  const topRanked = [...interactiveItems].sort((a, b) => b.wear - a.wear).slice(0, 4);

  return (
    <div className="w-full flex flex-col space-y-24 md:space-y-32 pb-24 text-stone-100 bg-[#150f24]">
      {/* ============ HERO SECTION ============ */}
      {/* The light ripple effect is EXCLUSIVELY housed here on the main landing screen, without the global app header */}
      <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden">
        {/* Dynamic ambient WebGL light ripple shader - exclusively in this hero */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#150f24]">
          <ShaderBackground className="absolute inset-0 w-full h-full pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#150f24]/10 via-[#150f24]/40 to-[#150f24] pointer-events-none" />
        </div>

        {/* Minimal Hero Top Bar (Without the global app header) */}
        <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d9a6ff]/20 to-[#ff8fd8]/10 border border-[#d9a6ff]/35 flex items-center justify-center shadow-[0_0_16px_rgba(217,166,255,0.25)] p-0.5 overflow-hidden">
              <img
                src="/logo.png"
                alt="Ropero"
                className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(217,166,255,0.5)]"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-['Outfit']">
              Ropero
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              id="btn-hero-ir-armario"
              onClick={onEnterApp}
              className="glass-pill px-4 py-2 text-xs font-semibold text-white/90 hover:text-white cursor-pointer"
            >
              Mi clóset
            </button>
            <button
              type="button"
              id="btn-hero-ir-outfits"
              onClick={onOpenOutfits || onOpenOutfitCreator}
              className="glass-pill hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-stone-300 hover:text-white cursor-pointer"
            >
              Mis outfits
            </button>

            {userEmail ? (
              <button
                type="button"
                onClick={onEnterApp}
                className="px-4 py-2 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] text-xs font-bold shadow-[0_0_16px_rgba(217,166,255,0.4)] transition-all cursor-pointer"
              >
                Abrir armario
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {onSignIn && (
                  <button
                    type="button"
                    onClick={onSignIn}
                    className="hidden sm:inline-flex px-3.5 py-2 text-xs font-medium text-stone-300 hover:text-white cursor-pointer"
                  >
                    Iniciar sesión
                  </button>
                )}
                <button
                  type="button"
                  onClick={onSignUp}
                  className="px-4 py-2 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] text-xs font-bold shadow-[0_0_16px_rgba(217,166,255,0.4)] transition-all cursor-pointer"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Hero Center Text and CTAs */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14 text-center flex flex-col items-center my-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset] text-xs font-semibold tracking-wider text-[#d9a6ff] uppercase mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tu clóset, siempre cerca</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.08] drop-shadow-[0_0_35px_rgba(217,166,255,0.35)]">
            Vístete sin pensarlo dos veces
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-stone-300/80 max-w-2xl font-normal leading-relaxed">
            Guarda cada prenda que tienes, arma looks en segundos y recibe sugerencias según el clima de hoy.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              id="btn-hero-empezar"
              onClick={userEmail ? onEnterApp : onSignUp}
              className="px-8 py-3.5 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] font-bold text-sm sm:text-base shadow-[0_4px_24px_rgba(0,0,0,0.3),0_0_28px_rgba(217,166,255,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer flex items-center gap-2.5"
            >
              <span>{userEmail ? 'Abrir mi armario' : 'Empezar gratis'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="btn-hero-ver-closet"
              onClick={onEnterApp}
              className="glass-pill px-7 py-3.5 text-sm sm:text-base font-medium text-white/90 hover:text-white cursor-pointer flex items-center gap-2"
            >
              <span>Ver el clóset</span>
              <ChevronRight className="w-4 h-4 text-[#d9a6ff]" />
            </button>
          </div>

          {/* Quick Highlights Pill */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-300/70">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6ee7c8] shadow-[0_0_8px_#6ee7c8]" />
              <span>{totalGarments > 0 ? `${totalGarments} prendas en tu clóset` : 'Organizador inteligente'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#d9a6ff] shadow-[0_0_8px_#d9a6ff]" />
              <span>{totalOutfits > 0 ? `${totalOutfits} combinaciones guardadas` : 'Creador visual de outfits'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff8fd8] shadow-[0_0_8px_#ff8fd8]" />
              <span>Sincronizado en la nube</span>
            </div>
          </div>
        </div>

        {/* Subtle scroll indicator / bottom cue */}
        <div className="relative z-10 pb-6 text-center">
          <span className="text-[11px] text-stone-400 font-medium tracking-wide">
            Desliza para descubrir las funciones ↓
          </span>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section className="relative px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Pensado para tu rutina diaria
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-300/70">
            Tres cosas que hace todos los días, sin que te des cuenta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Sugerencias por clima */}
          <div className="glass-card p-8 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-[#d9a6ff] shadow-[0_0_20px_rgba(217,166,255,0.25)]">
              <CloudSun className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="text-xl font-semibold text-white">Sugerencias por clima</h3>
            <p className="text-sm text-stone-300/70 leading-relaxed">
              Cada mañana te mostramos qué ponerte según la temperatura y el pronóstico del día para que nunca salgas desprevenido.
            </p>
          </div>

          {/* Card 2: Favoritos */}
          <div className="glass-card p-8 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-[#ff8fd8] shadow-[0_0_20px_rgba(255,143,216,0.25)]">
              <Star className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="text-xl font-semibold text-white">Favoritos</h3>
            <p className="text-sm text-stone-300/70 leading-relaxed">
              Marca las prendas que más te gustan para encontrarlas primero cuando armas un look o planificas tu semana.
            </p>
          </div>

          {/* Card 3: Estadísticas de uso */}
          <div className="glass-card p-8 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-[#6ee7c8] shadow-[0_0_20px_rgba(110,231,200,0.25)]">
              <BarChart3 className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h3 className="text-xl font-semibold text-white">Estadísticas de uso</h3>
            <p className="text-sm text-stone-300/70 leading-relaxed">
              Descubre qué usas todo el tiempo y qué quedó olvidado en el fondo del clóset para sacar el máximo partido a tu ropa.
            </p>
          </div>
        </div>
      </section>

      {/* ============ APP INTERACTIVE MOCKUP SECTION ("Así se ve tu clóset") ============ */}
      <section className="relative px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Así se ve tu clóset
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-300/70">
            La misma pantalla, lista para la compu y para el celular.
          </p>
        </div>

        {/* macOS / Desktop Window Frame */}
        <div className="glass-panel overflow-hidden border border-white/15 shadow-[0_24px_80px_rgba(0,0,0,0.5),0_1px_0_0_rgba(255,255,255,0.2)_inset]">
          {/* Chrome / Window Titlebar */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/[0.04] border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>

            <div className="px-6 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs text-stone-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>ropero.app/closet</span>
            </div>

            <button
              onClick={onEnterApp}
              className="text-xs text-[#d9a6ff] hover:underline font-medium cursor-pointer"
            >
              Abrir app real &rarr;
            </button>
          </div>

          {/* Window Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Top Bar: User Greeting + Weather Suggestion */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Hola, {userName || 'Mica'}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {totalGarments > 0 ? `${totalGarments} prendas en tu armario personal` : '36 prendas en tu clóset'}
                </p>
              </div>

              {/* Weather Widget Panel */}
              <div className="w-full sm:w-auto flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/12 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]">
                <div className="text-3xl font-extrabold text-white">14°</div>
                <div className="text-xs">
                  <div className="text-stone-400 flex items-center gap-1.5">
                    <CloudSun className="w-3.5 h-3.5 text-amber-300" />
                    <span>Nublado en Buenos Aires</span>
                  </div>
                  <div className="text-stone-200 font-medium mt-0.5">
                    Sugerencia de hoy: <span className="text-[#d9a6ff]">Suéter mostaza + Jean azul + Botas marrones</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {['Todo', 'Tops', 'Pantalones', 'Vestidos', 'Calzado', 'Abrigos'].map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#d9a6ff] text-[#150f24] shadow-[0_0_15px_rgba(217,166,255,0.4)]'
                        : 'bg-white/[0.07] hover:bg-white/[0.12] text-stone-300 border border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Grid of Clothes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3.5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="glass-card p-3.5 flex flex-col gap-2 rounded-xl group"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shadow-inner"
                      style={{ backgroundColor: `${item.colorHex}25`, border: `1.5px solid ${item.colorHex}` }}
                    >
                      <Shirt className="w-4 h-4 text-white" />
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(item.id)}
                      className="p-1 text-stone-400 hover:text-[#d9a6ff] transition-colors cursor-pointer"
                      title={item.fav ? 'Favorito' : 'Marcar favorito'}
                    >
                      <Star
                        className={`w-4 h-4 ${item.fav ? 'fill-[#d9a6ff] text-[#d9a6ff]' : ''}`}
                      />
                    </button>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-white truncate">{item.name}</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {item.category} · <span className="text-stone-300">{item.wear} usos</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Usage Stats Ranking Bar */}
            <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset] space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#d9a6ff]" />
                  Tu ranking de uso
                </span>
                <span className="text-stone-400 font-normal">Prendas con mayor rotación</span>
              </div>

              <div className="space-y-2">
                {topRanked.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <span className="w-28 text-stone-300 truncate">{item.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/[0.08] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#d9a6ff] to-[#ff8fd8]"
                        style={{ width: `${Math.round((item.wear / maxWear) * 100)}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-stone-400 font-mono text-[11px]">{item.wear} usos</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LOOK BUILDER VISUALIZER ("Arma tu look") ============ */}
      <section className="relative px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Arma tu look
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-300/70">
            Prueba cómo se ven juntas tus prendas, con accesorios y detalles incluidos antes de vestirte.
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-10 border border-white/15 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Visualizer Canvas (Left 7 cols) */}
            <div className="md:col-span-7 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.04] border border-white/10 relative min-h-[460px]">
              {/* Hairstyle */}
              <div className="mb-4 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-200/20 to-amber-500/30 border border-amber-300/40 flex items-center justify-center text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                  <Smile className="w-7 h-7" />
                </div>
                <span className="text-[11px] text-stone-400 mt-1">{activeHairstyle}</span>
              </div>

              {/* Top Garment */}
              <div className="w-36 h-28 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-105">
                <Shirt className="w-8 h-8 text-amber-300" />
                <span className="text-xs font-semibold text-white mt-1">{activeTop}</span>
                <span className="text-[10px] text-amber-300/80">Top</span>
              </div>

              {/* Bottom Garment */}
              <div className="w-32 h-32 rounded-2xl bg-blue-500/20 border-2 border-blue-400/50 flex flex-col items-center justify-center shadow-lg -mt-2 transition-transform hover:scale-105">
                <Shirt className="w-7 h-7 text-blue-300 rotate-180" />
                <span className="text-xs font-semibold text-white mt-1">{activeBottom}</span>
                <span className="text-[10px] text-blue-300/80">Pantalón</span>
              </div>

              {/* Shoes */}
              <div className="w-28 h-14 rounded-xl bg-stone-700/40 border-2 border-stone-500/50 flex flex-col items-center justify-center shadow-lg mt-2 transition-transform hover:scale-105">
                <span className="text-xs font-semibold text-white">{activeShoes}</span>
                <span className="text-[10px] text-stone-400">Calzado</span>
              </div>

              {/* Floating Accessories Badges */}
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                {selectedAccessories.map((acc) => (
                  <div
                    key={acc}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/20 text-xs text-stone-200 backdrop-blur-md shadow-sm"
                  >
                    {acc.includes('Lentes') ? (
                      <Glasses className="w-3.5 h-3.5 text-[#d9a6ff]" />
                    ) : (
                      <Watch className="w-3.5 h-3.5 text-[#ff8fd8]" />
                    )}
                    <span>{acc}</span>
                    <button
                      type="button"
                      onClick={() => removeAccessory(acc)}
                      className="text-stone-400 hover:text-rose-400 text-xs ml-1 cursor-pointer"
                      title="Quitar"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls & Presets (Right 5 cols) */}
            <div className="md:col-span-5 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Personalizá tu combinación</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Cambiá las piezas rápidamente para ver combinaciones de colores antes de vestirte.
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-stone-300">Prenda Superior (Top)</label>
                <div className="flex flex-wrap gap-2">
                  {['Suéter mostaza', 'Camisa blanca', 'Blusa negra'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setActiveTop(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                        activeTop === t
                          ? 'bg-[#d9a6ff] text-[#150f24] font-bold shadow-sm'
                          : 'bg-white/[0.06] hover:bg-white/[0.12] text-stone-300 border border-white/10'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-medium text-stone-300">Prenda Inferior (Bottom)</label>
                <div className="flex flex-wrap gap-2">
                  {['Jean azul', 'Pantalón beige', 'Falda midi'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setActiveBottom(b)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                        activeBottom === b
                          ? 'bg-[#d9a6ff] text-[#150f24] font-bold shadow-sm'
                          : 'bg-white/[0.06] hover:bg-white/[0.12] text-stone-300 border border-white/10'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessories Row */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-stone-300">Accesorios</label>
                  <button
                    type="button"
                    onClick={addAccessoryPrompt}
                    className="inline-flex items-center gap-1 text-xs text-[#d9a6ff] hover:underline font-medium cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Sumar accesorio</span>
                  </button>
                </div>
              </div>

              {/* Call To Action into App */}
              <div className="pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onOpenOutfitCreator}
                  className="w-full py-3 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] font-bold text-sm shadow-[0_4px_20px_rgba(217,166,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>Crear outfit con mis prendas reales</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA BANNER ============ */}
      <section className="relative px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <div className="glass-panel p-8 sm:p-12 text-center relative overflow-hidden border border-white/20 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Empieza a organizar tu ropa hoy
            </h2>
            <p className="text-sm sm:text-base text-stone-300/80 font-normal">
              Accede a tu armario desde cualquier dispositivo. Registra tus prendas con fotos o íconos y crea combinaciones sin límites.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={userEmail ? onEnterApp : onSignUp}
                className="px-8 py-3.5 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] font-bold text-base shadow-[0_0_30px_rgba(217,166,255,0.5)] transition-all cursor-pointer"
              >
                {userEmail ? 'Ir a mi armario' : 'Crear mi cuenta gratis'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
