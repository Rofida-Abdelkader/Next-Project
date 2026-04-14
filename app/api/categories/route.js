import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
export async function GET(){
    try{
        await connectDB()
        const categories=await Category.find().sort({createdAt:-1})
        return NextResponse.json({categories}, {status:200})
    }
    catch(error){
        return NextResponse.json({error:error.message}, {status:500})
    }
}
export async function POST(request){
    try{
        await connectDB()
        const body=await request.json()
        const category= await Category.create(body)
        return NextResponse.json({category}, {status:201})
    }
    catch(error){
        return NextResponse.json({error:error.message}, {status:500})
    }
}