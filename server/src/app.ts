import express from "express";
import { env } from "./env";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/error-handler";
import { TDatabase } from "./db";
import { constant } from "./constant";
import { createUserRouter } from "./core/user/router";

export function createApp(db: TDatabase) {
  const app = express();

  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  app.use(constant.userRoute, createUserRouter(db));

  app.use(errorHandler);

  return app;
}

export function startApp(db: TDatabase) {
  const app = createApp(db);
  app.listen(env.PORT, () => {
    console.log("Server listening at port", env.PORT);
  });
}
