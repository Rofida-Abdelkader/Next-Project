import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/db/models/product.model";
import { Category } from "@/db/models/category.model";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).populate("category").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const product = await Product.create(body);
    const populated = await Product.findById(product._id).populate("category").lean();
    return NextResponse.json({ product: populated }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
