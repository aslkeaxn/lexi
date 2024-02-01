import { Request, Response } from "express";
import { UserSchemas } from "./schemas";
import { db } from "../../db";
import { ForbiddenError } from "../../errors";

export async function register(req: Request, res: Response) {
  const dto = UserSchemas.register.parse(req.body);
  const firebaseId = res.locals.firebaseId as string;

  const user = await db.user.findFirst({ where: { username: dto.username } });

  if (user) {
    throw new ForbiddenError("Username taken");
  }

  await db.user.create({ data: { firebaseId, username: dto.username } });

  res.status(201).json({});
}
