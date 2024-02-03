import { Request, Response } from "express";
import { TDatabase } from "../../db";

export function getProject(db: TDatabase) {
  return async function (req: Request, res: Response) {
    const userId = res.locals.userId as string;
    const projectId = req.params.projectId;

    const project = await db.project.findFirst({
      where: {
        id: projectId,
        OR: [{ userId }, { userRoles: { some: { projectId, userId } } }],
      },
    });

    res.json({ project });
  };
}
