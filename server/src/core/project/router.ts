import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler";
import { isAuth } from "../../middleware/is-auth";
import { createProject } from "./c.create-project";

export const projectRouter = Router();

projectRouter.post("/", asyncHandler(isAuth(), createProject));
