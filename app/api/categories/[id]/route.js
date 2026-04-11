import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
//Here we find the categroy By ID and update it or delete it
//first we make a get function(request,{params}){
    //connect to db
    //find the category by id (findById(params.id))
    //return the category
//}
export async function GET(request,{params}){
    try{
        await connectDB()
        const category=await Category.findById(params.id)
        if(!category){
            return NextResponse.json({error:"Category not found"}, {status:404})
        }
        return NextResponse.json({category}, {status:200})
    }
    catch(error){
        return NextResponse.json({error:error.message}, {status:500})
    }
}
//now we make a put function(request,{params}){
    //connect to db
    //find the category by id (findById(params.id))
    //update the category (findByIdAndUpdate(params.id,body,{
    //new:true,
    //runValidators:true
    //}))
    //return the updated category
//}
export async function PUT(request,{params}){
    try{
        await connectDB()
        const{name,description}= await request.json();
        const category=await Category.findByIdAndUpdate(params.id,{name,description},{ //if the body is empty we dont update it
            new:true,
            runValidators:true
        })
        if(!category){
            return NextResponse.json({error:"Category not found"},{status:404})
        }
        return NextResponse.json({category},{status:200})
    }
    catch(error){
        if(error.name==="ValidationError"){
            return NextResponse.json({error:error.message},{status:400})
        }
        return NextResponse.json({error:error.message},{status:500})
    }
}
//now we make a delete function(request,{params}){
    //connect to db
    //find the category by id (findById(params.id))
    //delete the category (findByIdAndDelete(params.id))
    //return the deleted category
//}
export async function DELETE(request,{params}){
    try{
        await connectDB()
        
        const category=await Category.findByIdAndDelete(params.id)
        if(!category){
            return NextResponse.json({error:"Category not found"},{status:404})
        }
        return NextResponse.json({message:"Deleted successfully",deleted:category},{status:200})
    }
    catch(error){
        return NextResponse.json({error:error.message},{status:500})
    }
}