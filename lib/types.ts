export interface Category {
  _id: string;
  name: string;
}


export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  stock: number;
  category: Category | null;
  brand?: string;
  rating?: number;
  numReviews?: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discount?: number;
  stock: number;
  category: string;
  brand: string;
  rating: number;
  numReviews: number;
}