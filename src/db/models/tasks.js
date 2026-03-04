import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TaskSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    columnId: {
      type: Schema.Types.ObjectId,
      ref: "Column",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "none"],
      default: "low",
    },

    deadline: { type: Date },
    order: { type: Number },
  },
  { timestamps: true },
);

export const Task = model("Task", TaskSchema);
