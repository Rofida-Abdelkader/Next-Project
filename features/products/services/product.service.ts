import { Product, ProductFormData } from "../types/product.types";

export const productService = {
  getProducts: async () : Promise<Product[]> => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      return data.products || [];
    } catch (error) {
      console.error("getProducts error:", error);
      return [];
    }
  },

  createProduct: async (product: ProductFormData): Promise<Product | null> => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to create product");
      const data = await res.json();
      return data.product;
    } catch (error) {
      console.error("createProduct error:", error);
      return null;
    }
  },

  updateProduct: async (id: string, product: ProductFormData): Promise<Product | null> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to update product");
      const data = await res.json();
      return data.product;
    } catch (error) {
      console.error("updateProduct error:", error);
      return null;
    }
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  },

  getCategories: async (): Promise<any[]> => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      return data.categories || [];
    } catch (error) {
      console.error("getCategories error:", error);
      return [];
    }
  },
};
