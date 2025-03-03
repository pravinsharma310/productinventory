import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/lib/models/User"; // Ensure the User model is set up correctly
import bcrypt from "bcrypt";

const MONGO_URI = process.env.MONGO_URI;

export async function POST(req) {
  try {
    // ✅ Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "Users", // Adjust if needed
      });
      console.log("✅ MongoDB Connected");
    }

    // ✅ Parse request body
    const { email, password , firstName, phone, role } = await req.json();
    console.log(email, password, "user-running");

    if (!email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // 🔍 Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    // 🔐 Compare hashed passwords
    console.log(user,"password")
    const isValidPassword = password === user.password;
    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "Login successful", user: { user } }, { status: 200 });
  } catch (error) {
    console.error("🔴 Login Error:", error);
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
