import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
