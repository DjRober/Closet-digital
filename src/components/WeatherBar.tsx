import { useEffect, useState } from 'react';
import { CloudSun, MapPin, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { Garment } from '../types';
import { fetchCurrentWeather, suggestOutfit, WeatherInfo, OutfitSuggestion } from '../lib/weather';

interface WeatherBarProps {
  garments: Garment[];
}

type Status = 'idle' | 'loading' | 'ready' | 'error';

export function WeatherBar({ garments }: WeatherBarProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [suggestion, setSuggestion] = useState<OutfitSuggestion | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const load = async () => {
    setStatus('loading');
    setErrorMsg('');
    try {
      const w = await fetchCurrentWeather();
      setWeather(w);
      setStatus('ready');
    } catch (e) {
      const err = e as GeolocationPositionError | Error;
      const denied = 'code' in err && err.code === 1;
      setErrorMsg(
        denied
          ? 'Activa el permiso de ubicación para ver el clima de hoy.'
          : 'No pudimos obtener el clima ahora mismo.'
      );
      setStatus('error');
    }
  };

  useEffect(() => {
    if (weather) setSuggestion(suggestOutfit(weather, garments));
  }, [weather, garments]);

  return (
    <div className="glass-panel overflow-hidden">
      <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5">
        {/* sparkles decorativos */}
        <span className="hidden sm:block absolute top-[18%] right-[8%] w-1 h-1 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.9)] animate-twinkle" />
        <span className="hidden sm:block absolute top-[70%] left-[10%] w-[3px] h-[3px] rounded-full bg-white shadow-[0_0_8px_2px_rgba(230,190,255,0.9)] animate-twinkle" style={{ animationDelay: '1s' }} />

        {status === 'ready' && weather ? (
          <>
            <div className="flex items-center gap-4 shrink-0">
              <div className="font-['Outfit'] font-extrabold text-4xl sm:text-5xl leading-none text-white">{weather.temperature}°</div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{weather.place ? `${weather.description} en ${weather.place}` : weather.description}</span>
                </div>
                {suggestion && <div className="text-sm font-medium mt-0.5 text-stone-200">{suggestion.headline}</div>}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {suggestion && suggestion.garments.length > 0 ? (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#d9a6ff]" /> Sugerencia de hoy
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.garments.map((g) => (
                      <span key={g.id} className="glass-pill inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-200">
                        <span className="w-2.5 h-2.5 rounded-full border border-white/25" style={{ backgroundColor: g.colorHex || '#57534e' }} />
                        <span className="capitalize">{g.type}</span>
                        <span className="text-stone-400">· {g.color}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-400">Agrega prendas a tu armario para recibir una sugerencia de look.</p>
              )}
            </div>

            <button type="button" onClick={load} className="glass-pill p-2 self-start text-stone-300 hover:text-white cursor-pointer" title="Actualizar clima" aria-label="Actualizar clima">
              <RefreshCw className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/12 flex items-center justify-center text-[#d9a6ff] shrink-0 shadow-[0_0_15px_rgba(217,166,255,0.2)]">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <div className="font-['Outfit'] text-base font-bold text-white">Sugerencia por clima</div>
                <p className="text-xs text-stone-400">
                  {status === 'error' ? errorMsg : 'Mira qué ponerte según la temperatura de hoy.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={load}
              disabled={status === 'loading'}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#d9a6ff] hover:bg-[#eccbff] text-[#150f24] text-xs font-bold shadow-[0_0_15px_rgba(217,166,255,0.4)] transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60 shrink-0"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Cargando…</span>
                </>
              ) : (
                <>
                  <CloudSun className="w-4 h-4" />
                  <span>{status === 'error' ? 'Reintentar' : 'Ver el clima'}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
