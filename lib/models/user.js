import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ["superadmin", "admin", "cashier", "supplier"], default: "admin" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
