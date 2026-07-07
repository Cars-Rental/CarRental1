import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    car :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "carRent",
        required : true
    },
    user:{
         type : mongoose.Schema.Types.ObjectId,
          ref : "user",
          required : true
    },
      owner:{
        type : mongoose.Schema.Types.ObjectId,
          ref : "user",
          required : true
      },
      startDate:{
        type: Date,
        required:true
      },
      endDate:{
        type : Date,
        required: true
      },
      totalDays:{
        type : Number,
        required: true
      },
      priceperDay:{
        type:Number,
        required:true
      },
      totalPrice:{
        type:Number,
        required:true
      },
      status:{
        type:String,
        enum: [ "pending", "accepted","rejected","completed", "cancelled"],
        default:"pending"
      },
      notes:{
        type:String
      },
      rejectionReason: {
         type: String 
        },
        cancellationReason: {
           type: String 
          },
},
{timestamps:true}
);

orderSchema.index({ car: 1, startDate: 1, endDate: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ owner: 1 });

export const orderModel = mongoose.model("order",orderSchema)