export interface Product {
  id: number;
  name: string;
  category: string;
  unit: string;
}

export interface FridgeItem {
  id: number;
  quantity: number;
  minQuantity: number;
  expiresAt: string | null;
  product: Product;
}

export interface ShoppingItem {
  id: number;
  quantity: number;
  checked: boolean;
  product: Product;
}

export interface FridgeInput {
  name: string;
  category: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  expiresAt: string | null;
}

export interface ShoppingInput {
  name: string;
  category: string;
  unit: string;
  quantity: number;
}
