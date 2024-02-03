import { Request, Response } from "express";
import { TDatabase } from "../../db";

export function getProjects(db: TDatabase) {
  return async function (req: Request, res: Response) {
    const userId = res.locals.userId as string;

    const projects = await db.project.findMany({
      where: { userRoles: { some: { userId } } },
    });

    res.json({ projects });
  };
}
