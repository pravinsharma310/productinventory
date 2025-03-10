import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  type: String,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
