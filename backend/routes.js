import express from "express";
import { noteModel } from "./models.js";

export const app = express();

//add data to the collection
app.post("/add_note", async (request, response, next) => {
  try {
    if (request.body.heading === "" || request.body.heading === null) {
      next(new Error("Heading is missing!"));
    } else if (request.body.details === "" && request.body.details === null) {
      next(new Error("Details is missing!"));
    } else {
      const note = new noteModel({
        heading: request.body.heading,
        details: request.body.details,
        date: new Date().toLocaleString(),
      });
      const res = await note.save();
      if (res?._id) {
        response.send({
          data: note,
          message: "Note added successfully",
          status: 200,
          success: true,
        });
      } else {
        next(new Error("Failed to add note"));
      }
    }
  } catch (error) {
    next(error);
  }
});

//update data
app.put("/modify_note", async (request, response, next) => {
  try {
    if (request.body.heading === "" || request.body.heading === null) {
      next(new Error("Heading is missing!"));
    } else if (request.body.details === "" && request.body.details === null) {
      next(new Error("Details is missing!"));
    } else {
      const note = new noteModel({
        heading: request.body.heading,
        details: request.body.details,
        date: new Date().toLocaleString(),
      });
      const res = await noteModel.findOneAndUpdate(
        { _id: request.body._id },
        {
          $set: {
            heading: request.body.heading,
            details: request.body.details,
            date: new Date().toLocaleString(),
          },
        }
      );
      if (res?._id) {
        response.send({
          data: note,
          message: "Note updated",
          status: 200,
          success: true,
        });
      } else {
        next(new Error("Failed to update note"));
      }
    }
  } catch (error) {
    next(error);
  }
});

//delete data from database
app.delete("/delete_note", async (request, response, next) => {
  try {
    const note = new noteModel(request.body);
    const res = await noteModel.findOneAndDelete({ _id: request.body._id });
    if (res?._id) {
      response.send({
        data: note,
        message: "Note deleted",
        status: 200,
        success: true,
      });
    } else {
      next(new Error("Failed to delete note"));
    }
  } catch (error) {
    next(error);
  }
});

//read data from the collection
app.get("/notes", async (request, response, next) => {
  try {
    const note = await noteModel.find();
    response.send({
      data: note,
      message: "All Notes",
      status: 200,
      success: true,
    });
  } catch (error) {
    next(error);
  }
});
