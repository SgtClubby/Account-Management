import mongoose, { Schema } from "mongoose";

const database =
  process.env.MONGODB_URI! + process.env.DB! + "?authSource=admin";

mongoose.connect(database).catch((e) => console.log(e));

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  twoFactorAuth: { type: Boolean, default: false },
  twoFactorAuthSecret: { type: String, default: null },
  emailVerified: { type: Boolean, default: false },
  salt: { type: String, default: null },
});

const accountSchema = new Schema({
  owner: String,
  username: String,
  password: String,
  fields: [
    {
      id: String,
      value: String,
      name: String,
    },
  ],
  files: [
    {
      id: { type: String },
      fileName: { type: String },
      size: { type: Number },
      type: { type: String },
      data: { type: String },
    },
  ],
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Account =
  mongoose.models.Account || mongoose.model("Account", accountSchema);
