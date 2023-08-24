import mongoose, { Schema } from "mongoose";

const database =
  process.env.MONGODB_URI! + process.env.DB! + "?authSource=admin";

mongoose.connect(database).catch((e) => console.log(e));
mongoose.set("debug", true);
const passwordResetSchema = new Schema({
  id: String,
  token: String,
  email: String,
  createdAt: {
    type: Date,
    default: new Date(),
    expires: 3600,
  },
});

export const PasswordReset =
  mongoose.models.PasswordReset ||
  mongoose.model("PasswordReset", passwordResetSchema);
