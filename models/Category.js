import mongoose from "mongoose";
const CategorySchema=new mongoose.Schema({

        name:{
            type:String,
            required:[true,"Category name is required"],
            unique:true,
            trim:true,
            maxLength:[100,"Category name cannot exceed 100 characters"],
            minLength:[3,"Category name must be at least 3 characters long"]
        },
      
        description:{
            type:String,
            required:[true,"Category description is required"],
            trim:true,
            maxLength:[1000,"Category description cannot exceed 1000 characters"],
            minLength:[10,"Category description must be at least 10 characters long"]
        }
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
        return ret ;
      },
    },
  })// auto adds createdAt and updatedAt)
const Category=mongoose.models.Category|| mongoose.model("Category",CategorySchema)
export default Category