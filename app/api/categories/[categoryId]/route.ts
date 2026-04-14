import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Category } from "@/db/models/category.model";
import { Product } from "@/db/models/product.model";

export async function PUT(request: NextRequest, { params }: any) {
  try {
    await connectDB();
    const { categoryId } = await params;
    const body = await request.json();
    const category = await Category.findByIdAndUpdate(categoryId, body, { new: true }).lean();
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ category });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Category name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: any) {
  try {
    await connectDB();
    const { categoryId } = await params;

    // Check if any products use this category
    const productCount = await Product.countDocuments({ category: categoryId });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${productCount} product(s) use this category` },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
