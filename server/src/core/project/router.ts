import { Router } from "express";
import { TDatabase } from "../../db";
import { asyncHandlerDb } from "../../lib/async-handler";
import { isAuth } from "../../middleware/is-auth";
import { createProject } from "./c.create-project";
import { getProject } from "./c.get-project";
import { getProjects } from "./c.get-projects";

export function createProjectRouter(db: TDatabase) {
  const router = Router();

  router.post("/", asyncHandlerDb(db, isAuth, createProject));

  router.get("/", asyncHandlerDb(db, isAuth, getProjects));

  router.get("/:projectId", asyncHandlerDb(db, isAuth, getProject));

  return router;
}
