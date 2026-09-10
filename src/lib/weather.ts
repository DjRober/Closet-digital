import { Garment } from '../types';
import { getGarmentRole } from './outfitGenerator';

export interface WeatherInfo {
  temperature: number;
  code: number;
  description: string;
  isDay: boolean;
  place?: string;
}

/** Descripción en español a partir del código WMO de Open-Meteo */
function describeWeather(code: number): string {
  if (code === 0) return 'Despejado';
  if (code === 1 || code === 2) return 'Parcialmente nublado';
  if (code === 3) return 'Nublado';
  if (code === 45 || code === 48) return 'Con niebla';
  if (code >= 51 && code <= 57) return 'Llovizna';
  if (code >= 61 && code <= 67) return 'Lluvioso';
  if (code >= 71 && code <= 77) return 'Nevando';
  if (code >= 80 && code <= 82) return 'Chubascos';
  if (code >= 95) return 'Tormenta';
  return 'Templado';
}

/** Obtiene la ubicación aproximada del navegador */
function getPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocalización no disponible'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 30 * 60 * 1000,
    });
  });
}

/** Nombre aproximado de la ciudad mediante geocodificación inversa de Open-Meteo */
async function reverseGeocode(lat: number, lon: number): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1&language=es&format=json`
    );
    if (!res.ok) return undefined;
    const data = await res.json();
    return data?.results?.[0]?.name;
  } catch {
    return undefined;
  }
}

/**
 * Obtiene el clima actual usando Open-Meteo (gratuito, sin API key).
 * Requiere permiso de geolocalización; si se rechaza lanza un error.
 */
export async function fetchCurrentWeather(): Promise<WeatherInfo> {
  const pos = await getPosition();
  const { latitude, longitude } = pos.coords;

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day`
  );
  if (!res.ok) throw new Error('No se pudo obtener el clima');
  const data = await res.json();

  const current = data.current;
  const place = await reverseGeocode(latitude, longitude);

  return {
    temperature: Math.round(current.temperature_2m),
    code: current.weather_code,
    description: describeWeather(current.weather_code),
    isDay: current.is_day === 1,
    place,
  };
}

export interface OutfitSuggestion {
  garments: Garment[];
  headline: string;
}

/**
 * Sugiere un look a partir del clima y las prendas disponibles.
 * Prioriza favoritas y elige piezas según la temperatura, reutilizando la
 * clasificación de roles del generador de outfits.
 */
export function suggestOutfit(weather: WeatherInfo, garments: Garment[]): OutfitSuggestion {
  const cold = weather.temperature <= 14;
  const warm = weather.temperature >= 24;

  const byRole = (role: string) =>
    garments
      .filter((g) => getGarmentRole(g) === role)
      .sort((a, b) => Number(b.favorite ?? false) - Number(a.favorite ?? false));

  const picks: Garment[] = [];
  const fullBodies = byRole('fullBody');
  const tops = byRole('top');
  const bottoms = byRole('bottom');
  const outerwear = byRole('outerwear');
  const shoes = byRole('shoes');

  // En clima cálido, un vestido/mono es una opción directa
  if (warm && fullBodies.length > 0 && Math.random() > 0.5) {
    picks.push(fullBodies[0]);
  } else {
    if (tops[0]) picks.push(tops[0]);
    if (bottoms[0]) picks.push(bottoms[0]);
  }
  if (cold && outerwear[0]) picks.push(outerwear[0]);
  if (shoes[0]) picks.push(shoes[0]);

  let headline: string;
  if (cold) headline = 'Hace fresco: suma una capa de abrigo.';
  else if (warm) headline = 'Día cálido: algo ligero y fresco.';
  else headline = 'Clima templado: ideal para tu look de siempre.';

  return { garments: picks, headline };
}
