import { Request, Response } from "express";
import { UserSchemas } from "./schemas";
import { db } from "../../db";
import { ForbiddenError } from "../../errors";

export async function updateUsername(req: Request, res: Response) {
  const userId = res.locals.userId as string;
  const dto = UserSchemas.updateUsername.parse(req.body);

  const user = await db.user.findFirst({ where: { username: dto.username } });

  if (user) {
    throw new ForbiddenError("Username taken");
  }

  await db.user.update({ data: { ...dto }, where: { id: userId } });

  return res.status(200).json({});
}
