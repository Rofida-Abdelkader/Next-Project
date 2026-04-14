import mongoose from "mongoose";
const ProductSchema=new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Product Name is required"],
    trim:true
  },
  description:{
    type:String,
    required:[true,"Product Description is required"],
    trim:true
  },
  price:{
    type:Number,
    required:[true,"Product Price is required"],
    trim:true
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category",
    required:[true,"Product Category is required"],
  },
  stock:{
    type:Number,
    required:[true,"Product Stock is required"],
    trim:true
  },
  rating:{
    type:Number,
    required:[true,"Product Rating is required"],
    trim:true
  },
  numReviews:{
    type:Number,
    required:[true,"Product NumReviews is required"],
    trim:true
  },
  brand:{
    type:String,
    required:[true,"Product Brand is required"],
    trim:true
  },
  
}, {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        const options = {
          timeZone: "Africa/Cairo",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        };
        ret.createdAt = new Date(ret.createdAt).toLocaleString("en-EG", options);
        ret.updatedAt = new Date(ret.updatedAt).toLocaleString("en-EG", options);
        return ret;
      },
    },
  })
const Product=mongoose.models.Product|| mongoose.model("Product",ProductSchema)
export default Product