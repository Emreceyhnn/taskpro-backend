import mongoose from "mongoose";

const { Schema, model } = mongoose;

const NeedHelpSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
});

export const NeedHelp = model("NeedHelp", NeedHelpSchema);
