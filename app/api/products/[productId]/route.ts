import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/db/models/product.model";

export async function GET(_req: NextRequest, { params }: any) {
  try {
    await connectDB();
    const { productId } = await params;
    const product = await Product.findById(productId).populate("category").lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: any) {
  try {
    await connectDB();
    const { productId } = await params;
    const body = await request.json();
    const product = await Product.findByIdAndUpdate(productId, body, { new: true })
      .populate("category")
      .lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: any) {
  try {
    await connectDB();
    const { productId } = await params;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
