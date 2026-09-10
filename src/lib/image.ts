/**
 * Redimensiona una imagen (data URL o blob) a un lado máximo y la devuelve como
 * data URL. Sirve para mantener las imágenes chicas antes de guardarlas en
 * Firestore (límite de 1 MB por documento).
 */
export async function resizeToDataUrl(
  source: string | Blob,
  maxDim = 768,
  mime: 'image/png' | 'image/jpeg' = 'image/png',
  quality = 0.9
): Promise<string> {
  const url = typeof source === 'string' ? source : URL.createObjectURL(source);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo procesar la imagen');
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL(mime, quality);
  } finally {
    if (typeof source !== 'string') URL.revokeObjectURL(url);
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
    img.src = url;
  });
}

/** Separa un data URL en su mime y la parte base64 (para APIs como Gemini). */
export function splitDataUrl(dataUrl: string): { mimeType: string; base64: string } {
  const match = /^data:([^;]+);base64,(.*)$/.exec(dataUrl);
  if (!match) throw new Error('Formato de imagen no válido');
  return { mimeType: match[1], base64: match[2] };
}
