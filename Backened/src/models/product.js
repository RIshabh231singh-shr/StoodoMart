const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type : String,
        required : true,
        trim : true,
        minLength : 3,
        maxLength : 100,
    },
    price: {
        type : Number,
        required : true,
        min : 0,
    },
    description: {
        type : String,
        required : true,
        minLength : 10,
        maxLength : 5000,
    },
    image: {
        type : String,
        required : true,
    },
    category: {
        type : String,
        required : true,
        enum: ["Electronics","Instrument","Stationary", "Other"],
    },
    stock: {
        type : Number,
        required : true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Person",
        required: true,
    }
},{
    timestamps: true,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;