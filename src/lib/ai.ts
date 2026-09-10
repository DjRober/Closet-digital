import { splitDataUrl } from './image';

/**
 * ⚠️ FASE A (sin backend): la detección con Gemini corre en el cliente y usa
 * VITE_GEMINI_API_KEY, que queda EXPUESTA en el bundle público. Está bien para
 * probar, pero para producción hay que mover esta llamada a un endpoint
 * server-side (Fase B) para no filtrar la API key.
 */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

/** Indica si la detección con IA está disponible (hay API key configurada). */
export const isAiEnabled = Boolean(API_KEY);

export interface DetectedGarment {
  type: string;
  color: string;
  colorHex: string;
}

function parseJson(text: string): unknown {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();
  return JSON.parse(cleaned);
}

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

/**
 * Detecta tipo, color y color hex aproximado de una prenda a partir de su foto,
 * usando Gemini Vision. Devuelve valores listos para prellenar el formulario.
 */
export async function detectGarment(dataUrl: string): Promise<DetectedGarment> {
  if (!API_KEY) throw new Error('La detección con IA no está configurada.');

  const { GoogleGenAI } = await import('@google/genai');
  const { mimeType, base64 } = splitDataUrl(dataUrl);
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `Analiza la prenda de ropa de la imagen y responde SOLO con JSON válido (sin texto adicional) con esta forma exacta:
{"type": string, "color": string, "colorHex": string}
- "type": tipo de prenda en español, una o dos palabras con mayúscula inicial (ej: "Camiseta", "Pantalón", "Chaqueta", "Vestido", "Zapatillas").
- "color": color predominante en español (ej: "Azul marino", "Blanco", "Beige").
- "colorHex": color predominante en hexadecimal de 6 dígitos (ej: "#1e3a8a").
Si no estás seguro, da tu mejor estimación.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      { inlineData: { mimeType, data: base64 } },
      { text: prompt },
    ],
    config: { responseMimeType: 'application/json' },
  });

  const raw = (response.text ?? '').trim();
  if (!raw) throw new Error('La IA no devolvió resultados.');

  let data: { type?: unknown; color?: unknown; colorHex?: unknown };
  try {
    data = parseJson(raw) as typeof data;
  } catch {
    throw new Error('No se pudo interpretar la respuesta de la IA.');
  }

  const type = String(data.type ?? '').trim().slice(0, 50);
  const color = String(data.color ?? '').trim().slice(0, 40);
  const colorHexRaw = String(data.colorHex ?? '').trim();
  const colorHex = HEX_RE.test(colorHexRaw) ? colorHexRaw.toLowerCase() : '#d9a6ff';

  if (!type && !color) throw new Error('No se detectó ninguna prenda en la imagen.');

  return { type, color, colorHex };
}
