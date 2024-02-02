import { Request, Response } from "express";
import { ProjectSchemas } from "./schemas";
import { db } from "../../db";

export async function updateProject(req: Request, res: Response) {
  const userId = res.locals.userId as string;
  const projectId = req.params.projectId;

  const dto = ProjectSchemas.updateProject.parse(req.body);

  await db.$transaction(async (tx) => {
    const project = await tx.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return;
    }

    await tx.project.update({
      data: { name: dto.name },
      where: { id: projectId },
    });

    await tx.projectLanguage.deleteMany({
      where: {
        projectId,
        languageId: { in: dto.languagesToRemoveIds },
      },
    });

    await tx.projectLanguage.createMany({
      data: dto.languagesToAddIds.map((languageId) => ({
        projectId,
        languageId,
      })),
    });
  });

  res.json({});
}
