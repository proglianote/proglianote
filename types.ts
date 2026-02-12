
export interface Spec {
  id: string;
  label: string;
  value: string;
}

export interface Line {
  id: string;
  brandId: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  brandId: string;
  lineId: string;
  name: string;
  description: string;
  specs: Spec[];
  targetHair: string[];
  imageUrl?: string;
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
}

export type ViewMode = 'USER' | 'ADMIN';
