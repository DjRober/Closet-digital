import { resizeToDataUrl } from './image';

/**
 * Quita el fondo de una imagen en el navegador (sin servidor) usando
 * @imgly/background-removal, y devuelve un PNG con transparencia ya
 * redimensionado para guardarlo en Firestore.
 *
 * La librería descarga su modelo desde un CDN la primera vez (unos MB, luego
 * queda en caché), por eso la importamos de forma diferida.
 */
export async function removeBackground(dataUrl: string): Promise<string> {
  const { removeBackground: imglyRemoveBackground } = await import('@imgly/background-removal');
  const blob = await imglyRemoveBackground(dataUrl, {
    output: { format: 'image/png' },
  });
  // PNG para conservar la transparencia, reducido para no pasar el límite de Firestore
  return resizeToDataUrl(blob, 768, 'image/png');
}
