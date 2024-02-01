import { Request, Response } from "express";
import { ProjectSchemas } from "./schemas";
import { db } from "../../db";
import { ForbiddenError } from "../../errors";

export async function createProject(req: Request, res: Response) {
  const userId = res.locals.userId as string;
  const dto = ProjectSchemas.createProject.parse(req.body);

  await db.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: { userId, name: dto.name },
    });
    const languageCount = await tx.language.count({
      where: { id: { in: dto.languageIds } },
    });

    if (languageCount !== dto.languageIds.length) {
      throw new ForbiddenError();
    }

    await tx.projectLanguage.createMany({
      data: dto.languageIds.map((languageId) => {
        return { projectId: project.id, languageId };
      }),
    });
  });

  res.status(201).json({});
}
