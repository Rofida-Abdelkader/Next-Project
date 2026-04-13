"use client";

import { useEffect, useState } from "react";
import { Product, ProductFormData } from "@/lib/types";
import { getProducts, addProduct, editProduct, deleteProduct } from "@/lib/products";
import ProductCard from "@/components/products/ProductCard";
import ProductForm from "@/components/products/ProductForm";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);



    // Get the product when the page opened
    useEffect(() => {
    const loadProducts = async () => {
    setIsLoading(true);
    const data = await getProducts();
    setProducts(data);
    setIsLoading(false);
  };

  loadProducts();
}, []);


  // Add Product
  const handleAdd = async (data: ProductFormData) => {
    setIsLoading(true);
    const newProduct = await addProduct(data);
    if (newProduct) {
      setProducts((prev) => [...prev, newProduct]);
      setShowForm(false);
    }
    setIsLoading(false);
  };

  // Edit Product
  const handleEdit = async (data: ProductFormData) => {
    if (!editingProduct) return;
    setIsLoading(true);
    const updated = await editProduct(editingProduct._id, data);
    if (updated) {
      setProducts((prev) =>
        prev.map((p) => (p._id === editingProduct._id ? updated : p))
      );
      setEditingProduct(null);
    }
    setIsLoading(false);
  };

  // Delete Product
  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const success = await deleteProduct(id);
    if (success) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Product
        </button>
      </div>

      {/* Form Adding*/}
      {showForm && (
        <div className="mb-6">
          <ProductForm
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Form Editing*/}
      {editingProduct && (
        <div className="mb-6">
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleEdit}
            onCancel={() => setEditingProduct(null)}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Products List*/}
      {isLoading && <p className="text-gray-500">Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={(p) => setEditingProduct(p)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {!isLoading && products.length === 0 && (
        <p className="text-gray-500 text-center mt-10">No products yet.</p>
      )}
    </div>
  );
}