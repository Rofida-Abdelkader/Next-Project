import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
export async function GET(){
    try{
        await connectDB()
        const products= await Product.find()
        .sort({createdAt:-1})
        .populate("category","name")
        return NextResponse.json({products},{status:200})
    }
    catch(error){
        return NextResponse.json({error:error.message},{status:500})
    }
}
export async function POST(request){
    try{
        await connectDB()
        const body=await request.json()
        const product=await Product.create(body)
        return NextResponse.json({product},{status:201})
    }
    catch(error){
        return NextResponse.json({error:error.message},{status:500})
    }
}