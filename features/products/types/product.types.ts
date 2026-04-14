export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: {
    _id: string;
    name: string;
  };
  discount?: number;
  brand?: string;
  rating?: number;
  numReviews?: number;
  status: "active" | "draft" | "archived";
  createdAt: string;
}

export type ProductFormData = Omit<Product, "_id" | "createdAt" | "category"> & {
  category?: string;
};

export type CreateProductInput = ProductFormData;
export type UpdateProductInput = Partial<CreateProductInput>;
