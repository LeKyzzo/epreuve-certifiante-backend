export interface Produit {
  id: number;
  name: string;
  reference: string;
  quantity: number;
  warehouseId: number;
}

export interface ProduitCreation {
  name: string;
  reference: string;
  quantity: number;
  warehouseId: number;
}

export type ProduitMiseAJour = ProduitCreation;
