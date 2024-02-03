import { TDatabase } from "../db";

export async function mockLanguages(db: TDatabase, n: number, k: number = 1) {
  await db.language.createMany({
    data: Array.from(Array(n)).map((_, i) => ({
      name: `language${k}${i + 1}`,
      code: `l${k}${i + 1}`,
    })),
  });
  return await db.language.findMany();
}
