import { Router } from "express";
import { TDatabase } from "../../db";
import { asyncHandlerDb } from "../../lib/async-handler";
import { isAuth } from "../../middleware/is-auth";
import { register } from "./c.register";
import { updateUsername } from "./c.update-username";

export function createUserRouter(db: TDatabase) {
  const router = Router();

  router.post(
    "/",
    asyncHandlerDb(db, (db: TDatabase) => isAuth(db, false), register)
  );

  router.post("/username", asyncHandlerDb(db, isAuth, updateUsername));

  return router;
}
