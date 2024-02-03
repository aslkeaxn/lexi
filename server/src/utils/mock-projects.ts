import { TDatabase } from "../db";
import { mockLanguages } from "./mock-languages";

export async function mockProjects(
  db: TDatabase,
  userId: string,
  n: number,
  k: number = 1
) {
  await db.project.createMany({
    data: Array.from(Array(n)).map((_, i) => ({ userId, name: `project${i}` })),
  });
  const projects = await db.project.findMany({ where: { userId } });
  const languages = await mockLanguages(db, n + 1, k);
  const permutation = Array.from(Array(n + 1))
    .map((_, i) => i)
    .sort(() => Math.random() - 0.5);
}
