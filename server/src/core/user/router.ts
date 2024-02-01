import { Router } from "express";
import { isAuth } from "../../middleware/is-auth";
import { asyncHandler } from "../../lib/async-handler";
import { register } from "./c.register";
import { updateUsername } from "./c.update-username";

export const userRouter = Router();

userRouter.post("/", asyncHandler(isAuth(false), register));

userRouter.post("/username", asyncHandler(isAuth(), updateUsername));
