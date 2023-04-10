import express from "express"
import { taskModel } from "./models.js";

export const app = express();

//add data to the collection
app.post("/add_task", async (request, response, next) => {
  try {
    const task = new taskModel(request.body);
    await task.save();
    response.send({
      data: task,
      message: "task added successfully",
      status: 200,
      success: true,
    });
  } catch (error) {
    next(error)
  }
});

//update data
app.put("/modify_task", async (request, response, next) => {
  try {
    const task = new taskModel(request.body);
    await taskModel.findOneAndUpdate(
      { _id: request.body._id },
      {
        $set: {
          heading: request.body.heading,
          details: request.body.details,
          date: request.body.date,
        }
      }
    )
    response.send({
      data: task,
      message: "task updated",
      status: 200,
      success: true
    });
  } catch (error) {
    next(error)
  }
})

//delete data from database
app.delete("/delete_task", async (request, response, next) => {
  try {
    const task = new taskModel(request.body);
    await taskModel.findOneAndDelete({ _id: request.body._id })
    response.send({
      data: task,
      message: "task deleted",
      status: 200,
      success: true,
    });
  }
  catch (error) {
    next(error)
  }
})

//read data from the collection
app.get("/tasks", async (request, response, next) => {
  try {
    const tasks = await taskModel.find();
    response.send({
      data: tasks,
      message: "All tasks",
      status: 200,
      success: true
    });
  } catch (error) {
    next(error)
  }
});
