"use client";
import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
  description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);

async function fetchCategories() {
  const res = await fetch("/api/categories");
  const data = await res.json();
  setCategories(Array.isArray(data) ? data : data.categories || []);
}

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editId) {
      await fetch(`/api/categories/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      setEditId(null);
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
    }
    setName("");
    setDescription("");
    fetchCategories();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  }

  function handleEdit(cat: Category) {
    setEditId(cat._id);
    setName(cat.name);
    setDescription(cat.description || "");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Categories</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginRight: "1rem", padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          {editId ? "Update" : "Add"} Category
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => { setEditId(null); setName(""); setDescription(""); }}
            style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}
          >
            Cancel
          </button>
        )}
      </form>

      <table border={1} cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>
                <button onClick={() => handleEdit(cat)}>Edit</button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}