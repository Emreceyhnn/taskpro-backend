import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ColumnSchema = new Schema(
  {
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    name: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Column = model("Column", ColumnSchema);
