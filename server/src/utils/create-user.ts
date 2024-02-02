import { TDatabase } from "../db";
import { createFirebaseUser } from "./create-firebase-user";
import { getTestUser } from "./get-test-user";

export async function createUser(db: TDatabase, username: string, i?: 1 | 2) {
  const { firebaseUser, idToken } = i
    ? await getTestUser(i)
    : await createFirebaseUser();
  const user = await db.user.create({
    data: { firebaseId: firebaseUser.uid, username },
  });
  const authorization = `Bearer ${idToken}`;

  return { user, firebaseUser, idToken, authorization };
}
