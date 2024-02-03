import { Language, ProjectRole } from "@prisma/client";
import { TDatabase } from "../db";

export async function mockProject(
  db: TDatabase,
  userId: string,
  languages: Language[],
  name: string = "project"
) {
  const project = await db.project.create({ data: { userId, name } });
  await db.projectAndLanguage.createMany({
    data: languages.map((l) => ({ projectId: project.id, languageId: l.id })),
  });
  await db.roleOnProject.create({
    data: { projectId: project.id, userId, role: ProjectRole.Owner },
  });
  return project;
}
