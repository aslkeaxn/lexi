import { Request, Response } from "express";
import { db } from "../../db";

export async function deleteProject(req: Request, res: Response) {
  const userId = res.locals.userId as string;
  const projectId = req.params.projectId;

  await db.project.deleteMany({ where: { id: projectId, userId } });

  res.json({});
}
