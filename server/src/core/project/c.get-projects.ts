import { Request, Response } from "express";
import { db } from "../../db";

export async function getProjects(req: Request, res: Response) {
  const userId = res.locals.userId as string;

  const projects = await db.project.findMany({ where: { userId } });

  res.json({ projects });
}
