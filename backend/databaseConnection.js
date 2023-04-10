import mongoose from "mongoose";
import { credential } from "./config.js";

mongoose.connect(
  `mongodb+srv://${credential.username}:${credential.password}@${credential.cluster}.mongodb.net/${credential.databaseName}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

export const database = mongoose.connection;

database.on("error", error => {
  console.log('Error in MongoDb connection: ' + error)
});

database.once("open", function () {
  console.log("Connected successfully");
});