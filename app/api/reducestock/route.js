import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/lib/models/Product";

const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "StoreDB", 
    });
    console.log("✅ MongoDB Connected");
  }
}

// 🟣 POST → Reduce Stock for Products
export async function POST(req) {
  try {
    await connectDB();

    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Invalid items data" }, { status: 400 });
    }

    const updatedProducts = [];

    for (const item of items) {
      const product = await Product.findById(item._id);

      if (!product) {
        return NextResponse.json({ 
          message: `Product not found: ${item.name}` 
        }, { status: 404 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ 
          message: `Insufficient stock for ${product.name}` 
        }, { status: 400 });
      }

      product.stock -= item.quantity;
      await product.save();

      updatedProducts.push({
        _id: product._id,
        name: product.name,
        remainingStock: product.stock,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Stock updated successfully",
      updatedProducts,
    }, { status: 200 });

  } catch (error) {
    console.error("🔴 Reduce Stock Error:", error);
    return NextResponse.json({ 
      message: "Server Error", 
      error: error.message 
    }, { status: 500 });
  }
}
