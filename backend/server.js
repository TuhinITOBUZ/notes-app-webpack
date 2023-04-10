import express from "express"
import cors from "cors";
import * as routers from "./routes.js";
import { database } from "./databaseConnection.js";
import { port } from "./config.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(routers.app);

app.use((request, response, next) => {
  next(new Error("Page not found"));
});

app.use((error, request, response, next) => {
  if (error) {
    response.status(500).send({
      data: null,
      message: error.message,
      success: false,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});