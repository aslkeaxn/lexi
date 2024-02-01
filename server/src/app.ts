import express from "express";
import { Env } from "./env";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/error-handler";
import { userRouter } from "./core/user/router";
import { projectRouter } from "./core/project/router";

function create() {
  const app = express();

  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  app.use("/api/users", userRouter);
  app.use("/api/projects", projectRouter);

  app.use(errorHandler);

  return app;
}

function start() {
  const app = create();
  app.listen(Env.PORT, () => {
    console.log("Server listening at port", Env.PORT);
  });
}

export const App = { create, start };
