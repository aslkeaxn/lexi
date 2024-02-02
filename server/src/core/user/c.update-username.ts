import { Request, Response } from "express";
import { TDatabase } from "../../db";
import { userSchema } from "./schema";
import { ForbiddenError } from "../../errors";

export function updateUsername(db: TDatabase) {
  return async function (req: Request, res: Response) {
    const userId = res.locals.userId as string;
    const dto = userSchema.updateUsername.parse(req.body);

    const user = await db.user.findFirst({ where: { username: dto.username } });

    if (user) {
      throw new ForbiddenError("Username taken");
    }

    await db.user.update({ data: { ...dto }, where: { id: userId } });

    res.json({});
  };
}
