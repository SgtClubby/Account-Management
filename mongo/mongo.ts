import mongoose, { Schema } from "mongoose";

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((e) => console.log(e));

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  twoFactorAuth: { type: Boolean, default: false },
  twoFactorAuthSecret: { type: String, default: null },
});

const accountSchema = new Schema({
  owner: String,
  name: String,
  username: String,
  password: String,
  usedFor: String || null,
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Account =
  mongoose.models.Account || mongoose.model("Account", accountSchema);
