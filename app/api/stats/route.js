import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
export async function GET(){
    try{
        await connectDB()
        const[totalProducts,totalCategories,OutOfStock,lowStock]=await Promise.all([
            Product.countDocuments(),
            Category.countDocuments(),
            Product.countDocuments({stock:0}),
            Product.countDocuments({stock:{$lte:10}})

        ])
        return NextResponse.json({totalProducts,totalCategories,OutOfStock,lowStock})
    }catch(error){
        console.log(error)
        return NextResponse.json({error:"Failed to fetch state"}, {status:500})
    }
}