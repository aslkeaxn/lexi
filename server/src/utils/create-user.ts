import { db } from "../db";
import { createFirebaseUser } from "./create-firebase-user";
import { getTestUser } from "./get-test-user";

export async function createUser(username: string, i?: 1 | 2) {
  const { firebaseUser, idToken } = i
    ? await getTestUser(i)
    : await createFirebaseUser();
  const user = await db.user.create({
    data: { firebaseId: firebaseUser.uid, username },
  });

  return { user, firebaseUser, idToken };
}
