import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      type: String,
      enum: ["light", "dark", "system"],
      default: "dark",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = mongoose.model("User", userSchema);
