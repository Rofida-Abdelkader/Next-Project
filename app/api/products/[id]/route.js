import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
export async function GET(request,{params}){
    try{
        await connectDB()
        const {id}= await params
        const product=await Product.findById(id)
        if(!product){
            return NextResponse.json({message:"Product Not Found"},{status:404})
        }return NextResponse.json({product},{status:200})
    }
    catch(error){
        return NextResponse.json({error:error.message},{status:500})
    }
}
export async function PUT(request,{params}){
    try{
        await connectDB()
        const body=await request.json()
        const {id}=await params
        const product= await Product.findByIdAndUpdate(id,body,{
            new:true,
            runValidators:true
        })
        if(!product){
             return NextResponse.json({message:"Product Not Found"},{status:404})
        }return NextResponse.json({product},{status:200})
    }
    catch(error){
        return NextResponse.json({error:error.message},{status:500})
    }
}
export async function DELETE(request,{params}){
    try{
        await connectDB()
        const {id}=await params
        const product=await Product.findByIdAndDelete(id)
        if(!product){
            return NextResponse.json({message:"Product Not Found"},{status:404})
        }return NextResponse.json({message:"Deleted successfully",deleted:product},{status:200})
    }
    catch(error){
        return NextResponse.json({error:error.message},{status:500})
    }
}
