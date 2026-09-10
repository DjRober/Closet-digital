export type GarmentIconKey = 'shirt' | 'pants' | 'jacket' | 'dress' | 'shoes' | 'accessory' | 'hanger';

export interface Garment {
  id: string;
  userId?: string;
  type: string;
  color: string;
  colorHex?: string;
  imageUrl?: string;
  iconKey: GarmentIconKey;
  createdAt: number;
  /** Marcada como favorita por la persona usuaria */
  favorite?: boolean;
  /** Número de veces que se registró como usada */
  wearCount?: number;
}

export interface GarmentTypePreset {
  label: string;
  defaultIcon: GarmentIconKey;
}

export interface ColorPreset {
  name: string;
  hex: string;
  border?: boolean;
}

export interface Outfit {
  id: string;
  userId?: string;
  name: string;
  garmentIds: string[];
  garments: Garment[];
  createdAt: number;
  occasion?: string;
}

/** Una foto colocada en el visualizador de looks (accesorio o peinado) */
export interface LookImage {
  id: string;
  imageUrl: string;
}


