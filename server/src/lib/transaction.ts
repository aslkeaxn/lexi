import { TDatabase, TTransaction } from "../db";

export async function transaction(
  db: TDatabase,
  fn: (tx: TTransaction) => Promise<unknown>
) {
  if (db.isTransaction) {
    return await fn(db);
  } else {
    return await db.$transaction(fn);
  }
}
