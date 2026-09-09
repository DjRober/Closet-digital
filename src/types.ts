export type GarmentIconKey = 'shirt' | 'pants' | 'jacket' | 'dress' | 'shoes' | 'accessory' | 'hanger';

export interface Garment {
  id: string;
  type: string;
  color: string;
  colorHex?: string;
  imageUrl?: string;
  iconKey: GarmentIconKey;
  createdAt: number;
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
  name: string;
  garmentIds: string[];
  garments: Garment[];
  createdAt: number;
  occasion?: string;
}

