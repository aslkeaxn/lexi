import { db } from "../db";

export async function clearDatabase() {
  await db.item.deleteMany();
  await db.namespace.deleteMany();
  await db.projectLanguage.deleteMany();
  await db.project.deleteMany();
  await db.language.deleteMany();
  await db.user.deleteMany();
}
