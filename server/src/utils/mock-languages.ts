import { TDatabase } from "../db";

export async function mockLanguages(db: TDatabase, n: number) {
  await db.language.createMany({
    data: Array.from(Array(n)).map((_, i) => ({
      name: `language${i + 1}`,
      code: `l${i + 1}`,
    })),
  });
  return await db.language.findMany();
}
