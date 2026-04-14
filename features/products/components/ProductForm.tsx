"use client";

import { useState, useEffect } from "react";
import { Product, ProductFormData } from "../types/product.types";
import { productService } from "../services/product.service";

interface Category {
  _id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const emptyForm: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  discount: 0,
  stock: 0,
  category: "",
  brand: "",
  rating: 0,
  numReviews: 0,
  status: "active",
};

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(
  initialData
    ? {
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        price: initialData.price ?? 0,
        discount: initialData.discount ?? 0,
        stock: initialData.stock ?? 0,
        category: initialData.category ? initialData.category._id : "",
        brand: initialData.brand ?? "",
        rating: initialData.rating ?? 0,
        numReviews: initialData.numReviews ?? 0,
        status: initialData.status ?? "active",
      }
    : emptyForm
);

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    productService.getCategories().then((data) => setCategories(data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "discount" || name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product Name"
        required
        className="border p-2 rounded"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
        className="border p-2 rounded"
      />
      <input
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        required
        className="border p-2 rounded"
      />
      <input
        name="discount"
        type="number"
        value={formData.discount}
        onChange={handleChange}
        placeholder="Discount"
        className="border p-2 rounded"
      />
      <input
        name="stock"
        type="number"
        value={formData.stock}
        onChange={handleChange}
        placeholder="Stock"
        required
        className="border p-2 rounded"
      />
      <input
      name="brand"
      value={formData.brand}
      onChange={handleChange}
      placeholder="Brand"
      required
      className="border p-2 rounded"
    />
    <input
      name="rating"
      type="number"
      value={formData.rating}
      onChange={handleChange}
      placeholder="Rating"
      required
      className="border p-2 rounded"
    />
    <input
      name="numReviews"
      type="number"
      value={formData.numReviews}
      onChange={handleChange}
      placeholder="Number of Reviews"
      required
      className="border p-2 rounded"
    />
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : initialData ? "Save Changes" : "Add Product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
