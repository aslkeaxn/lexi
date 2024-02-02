import { TDatabase, db } from "../db";
import { TestTransactionError } from "../errors";

export function testDb(fn: (tx: TDatabase) => Promise<unknown>) {
  return async function () {
    try {
      await db.$transaction(async (tx) => {
        await fn(tx);
        throw new TestTransactionError();
      });
    } catch (error) {
      if (!(error instanceof TestTransactionError)) {
        throw error;
      }
    }
  };
}
