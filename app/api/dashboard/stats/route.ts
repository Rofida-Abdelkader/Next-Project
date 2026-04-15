import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/db/models/product.model";
import { Category } from "@/db/models/category.model";

export async function GET() {
  try {
    await connectDB();

    const totalProducts = await Product.countDocuments();
    const outOfStock = await Product.countDocuments({ stock: 0 });
    const totalCategories = await Category.countDocuments();

    // Products per category for chart
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          name: { $ifNull: ["$category.name", "Uncategorized"] },
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Brand distribution
    const brandDistribution = await Product.aggregate([
      { $match: { brand: { $ne: "" } } },
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Average rating
    const ratingStats = await Product.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" }, totalReviews: { $sum: "$numReviews" } } }
    ]);

    const avgRating = ratingStats.length > 0 ? Number(ratingStats[0].avgRating.toFixed(1)) : 0;
    const totalReviews = ratingStats.length > 0 ? ratingStats[0].totalReviews : 0;

    return NextResponse.json({
      totalProducts,
      outOfStock,
      totalCategories,
      productsByCategory,
      brandDistribution,
      avgRating,
      totalReviews
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
