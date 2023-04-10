import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  heading: {
    type: String,
    require: true,

  },
  details: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    require: true,
  },
});

export const taskModel = mongoose.model("task", taskSchema);
