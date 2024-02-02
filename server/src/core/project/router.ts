import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler";
import { isAuth } from "../../middleware/is-auth";
import { createProject } from "./c.create-project";
import { getProjects } from "./c.get-projects";
import { getProject } from "./c.get-project";
import { deleteProject } from "./c.delete-project";
import { updateProject } from "./c.update-project";

export const projectRouter = Router();

projectRouter.post("/", asyncHandler(isAuth(), createProject));

projectRouter.get("/", asyncHandler(isAuth(), getProjects));

projectRouter.get("/:projectId", asyncHandler(isAuth(), getProject));

projectRouter.post("/:projectId", asyncHandler(isAuth(), updateProject));

projectRouter.delete("/:projectId", asyncHandler(isAuth(), deleteProject));
