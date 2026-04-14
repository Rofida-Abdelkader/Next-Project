"use client";

import { Product } from "../types/product.types";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow flex flex-col gap-2">
      <h2 className="text-xl font-bold">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <div className="flex gap-4 text-sm">
        <span>Price: <strong>${product.price}</strong></span>
        <span>Discount: <strong>{product.discount}%</strong></span>
        <span>Stock: <strong>{product.stock}</strong></span>
        <span>Category: <strong>{product.category ? product.category.name : "No Category"}</strong></span>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onEdit(product)}
          className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
