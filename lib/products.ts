import { Product, ProductFormData } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    return data.products;
  } catch (error) {
    console.error("getProducts error:", error);
    return [];
  }
}

export async function addProduct(data: ProductFormData): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add product");
    const result = await res.json();
    return result.product; // ← مهم
  } catch (error) {
    console.error("addProduct error:", error);
    return null;
  }
}

export async function editProduct(id: string, data: ProductFormData): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to edit product");
    const result = await res.json();
    return result.product; // ← مهم
  } catch (error) {
    console.error("editProduct error:", error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete product");
    return true;
  } catch (error) {
    console.error("deleteProduct error:", error);
    return false;
  }
}

export async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/api/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data = await res.json();
    return data.categories;
  } catch (error) {
    console.error("getCategories error:", error);
    return [];
  }
}