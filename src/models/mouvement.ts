export interface Mouvement {
  id: number;
  productId: number;
  quantity: number;
  type: 'IN' | 'OUT';
  createdAt: Date;
}

export interface MouvementCreation {
  productId: number;
  quantity: number;
  type: 'IN' | 'OUT';
}
