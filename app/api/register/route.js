import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req) {
  try {
    await connectDB(); // Ensure DB connection is established
    const { name:firstName, email, password, phone, type } = await req.json();
    if (!firstName || !email || !password || !phone || !type) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    // if (password !== confirmPassword) {
    //   return NextResponse.json({ success: false, message: "Passwords do not match" }, { status: 400 });
    // }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email already exists" }, { status: 400 });
    }

    const newUser = await User.create({ firstName, email, password, phone, type });
    console.log(newUser,"newUser")
    return NextResponse.json({ success: true, message: "User registered successfully", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}
