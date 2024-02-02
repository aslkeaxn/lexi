import { Router } from "express";
import { TDatabase } from "../../db";
import { asyncHandlerDb } from "../../lib/async-handler";
import { isAuth } from "../../middleware/is-auth";
import { createProject } from "./c.create-project";

export function createProjectRouter(db: TDatabase) {
  const router = Router();

  router.post("/", asyncHandlerDb(db, isAuth, createProject));

  return router;
}
