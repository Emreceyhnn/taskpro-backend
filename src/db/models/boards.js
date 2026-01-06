import mongoose from "mongoose";

const { Schema, model } = mongoose;

const BoardSchema = new Schema(
  {
    title: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: {
      type: String,
      default: "none",
    },
    background: {
      type: String,
      default: "none",
    },
  },
  { timestamps: true }
);

export const Board = model("Board", BoardSchema);
