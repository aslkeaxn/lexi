import { Request, Response } from "express";
import { TDatabase } from "../../db";
import { projectSchema } from "./schema";
import { transaction } from "../../lib/transaction";
import { ForbiddenError } from "../../errors";

export function createProject(db: TDatabase) {
  return async function (req: Request, res: Response) {
    const userId = res.locals.userId as string;
    const dto = projectSchema.createProject.parse(req.body);

    await transaction(db, async (tx) => {
      const project = await tx.project.create({
        data: { userId, name: dto.name },
      });

      for (const languageId of dto.languageIds) {
        const language = await tx.language.findFirst({
          where: { id: languageId },
        });

        if (!language) {
          throw new ForbiddenError();
        }
      }

      await tx.projectAndLanguage.createMany({
        data: dto.languageIds.map((languageId) => ({
          projectId: project.id,
          languageId,
        })),
      });
    });

    res.status(201).json({});
  };
}
