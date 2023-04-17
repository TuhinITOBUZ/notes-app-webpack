import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

export const noteModel = mongoose.model("task", taskSchema);
