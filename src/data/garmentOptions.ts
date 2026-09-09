import { GarmentIconKey, GarmentTypePreset, ColorPreset } from '../types';

export const GARMENT_TYPE_PRESETS: GarmentTypePreset[] = [
  { label: 'Camiseta', defaultIcon: 'shirt' },
  { label: 'Camisa', defaultIcon: 'shirt' },
  { label: 'Pantalón', defaultIcon: 'pants' },
  { label: 'Jeans', defaultIcon: 'pants' },
  { label: 'Chaqueta', defaultIcon: 'jacket' },
  { label: 'Abrigo', defaultIcon: 'jacket' },
  { label: 'Sudadera', defaultIcon: 'shirt' },
  { label: 'Vestido', defaultIcon: 'dress' },
  { label: 'Falda', defaultIcon: 'dress' },
  { label: 'Zapatos', defaultIcon: 'shoes' },
  { label: 'Zapatillas', defaultIcon: 'shoes' },
  { label: 'Accesorio', defaultIcon: 'accessory' },
];

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Negro', hex: '#1c1917' },
  { name: 'Blanco', hex: '#ffffff', border: true },
  { name: 'Gris', hex: '#6b7280' },
  { name: 'Azul Marino', hex: '#1e3a8a' },
  { name: 'Azul Denim', hex: '#3b82f6' },
  { name: 'Beige', hex: '#e7dbcd' },
  { name: 'Marrón', hex: '#78350f' },
  { name: 'Verde Oliva', hex: '#556b2f' },
  { name: 'Verde Bosque', hex: '#14532d' },
  { name: 'Rojo', hex: '#b91c1c' },
  { name: 'Borgoña', hex: '#581c2f' },
  { name: 'Rosa Pastel', hex: '#fbcfe8' },
  { name: 'Mostaza', hex: '#ca8a04' },
  { name: 'Naranja Terracota', hex: '#c2410c' },
];

export const ICON_OPTIONS: { key: GarmentIconKey; label: string }[] = [
  { key: 'shirt', label: 'Parte superior' },
  { key: 'pants', label: 'Parte inferior' },
  { key: 'jacket', label: 'Abrigo / Chaqueta' },
  { key: 'dress', label: 'Vestido / Traje' },
  { key: 'shoes', label: 'Calzado' },
  { key: 'accessory', label: 'Accesorio' },
  { key: 'hanger', label: 'General / Percha' },
];

// Initial sample garments to give the user a realistic feel immediately
export const INITIAL_GARMENTS = [
  {
    id: 'sample-1',
    type: 'Camisa',
    color: 'Azul Marino',
    colorHex: '#1e3a8a',
    iconKey: 'shirt' as GarmentIconKey,
    createdAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'sample-2',
    type: 'Pantalón',
    color: 'Beige',
    colorHex: '#e7dbcd',
    iconKey: 'pants' as GarmentIconKey,
    createdAt: Date.now() - 3600000 * 12,
  },
  {
    id: 'sample-3',
    type: 'Chaqueta',
    color: 'Negro',
    colorHex: '#1c1917',
    iconKey: 'jacket' as GarmentIconKey,
    createdAt: Date.now() - 3600000 * 4,
  },
];
