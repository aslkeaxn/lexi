import { Router } from "express";
import { TDatabase } from "../../db";
import { asyncHandlerDb } from "../../lib/async-handler";
import { isAuth } from "../../middleware/is-auth";
import { register } from "./register";

export function createUserRouter(db: TDatabase) {
  const router = Router();

  router.post("/", asyncHandlerDb(db, isAuth, register));

  return router;
}
