import { Request, Response } from "express";
import { db } from "../../db";

export async function getProject(req: Request, res: Response) {
  const userId = res.locals.userId as string;
  const projectId = req.params.projectId;

  const project = await db.project.findFirst({
    where: { id: projectId, userId },
  });

  res.json({ project });
}
