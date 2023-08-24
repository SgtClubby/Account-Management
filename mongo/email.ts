import mongoose, { Schema } from "mongoose";

const database =
  process.env.MONGODB_URI! + process.env.DB! + "?authSource=admin";

mongoose.connect(database).catch((e) => console.log(e));

const emailCheckSchema = new Schema({
  id: String,
  token: String,
  createdAt: {
    type: Date,
    default: new Date(),
    expires: 3600,
  },
});

export const EmailCheck =
  mongoose.models.EmailCheck || mongoose.model("EmailCheck", emailCheckSchema);
