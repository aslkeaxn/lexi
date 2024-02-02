import { Request, Response } from "express";
import { TDatabase } from "../../db";
import { userSchema } from "./schema";
import { ForbiddenError } from "../../errors";

export function register(db: TDatabase) {
  return async function (req: Request, res: Response) {
    const firebaseId = res.locals.firebaseId as string;
    const dto = userSchema.register.parse(req.body);

    const user = await db.user.findFirst({ where: { username: dto.username } });

    if (user) {
      throw new ForbiddenError("Username taken");
    }

    await db.user.create({ data: { firebaseId, ...dto } });

    res.status(201).json({});
  };
}
