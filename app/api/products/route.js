import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/lib/models/Product"; // Ensure the Product model is set up correctly

const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "StoreDB", // Adjust if needed
    });
    console.log("✅ MongoDB Connected");
  }
}

// 🟢 POST → Add a New Product
export async function POST(req) {
  try {
    await connectDB();

    const { name, image, stock } = await req.json();

    if (!name || !image || typeof stock !== "number") {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const newProduct = await Product.create({ name, image, stock });

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    }, { status: 201 });
  } catch (error) {
    console.error("🔴 Product Creation Error:", error);
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}

// 🟠 GET → Fetch All Products
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("🔴 Fetch Products Error:", error);
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}

// 🟡 PUT → Update a Product
export async function PUT(req) {
  try {
    await connectDB();

    const { id, name, image, stock } = await req.json();

    if (!id || !name || !image || typeof stock !== "number") {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, image, stock },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    }, { status: 200 });
  } catch (error) {
    console.error("🔴 Product Update Error:", error);
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}

// 🔴 DELETE → Delete a Product
export async function DELETE(req) {
  try {
    await connectDB();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct,
    }, { status: 200 });
  } catch (error) {
    console.error("🔴 Product Deletion Error:", error);
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
