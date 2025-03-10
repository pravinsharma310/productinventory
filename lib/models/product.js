import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  stock: { type: Number, required: true },
  price: { type: Number, required: true } // Added price field
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
