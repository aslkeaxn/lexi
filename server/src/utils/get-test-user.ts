import { firebase } from "../firebase";
import { getIdToken } from "./get-id-token";

export async function getTestUser(i: 1 | 2 = 1) {
  const email = `test${i}@test${i}.com`;
  const firebaseUser = await firebase.auth.getUserByEmail(email);

  if (!firebaseUser) {
    throw new Error(`Couldn't fetch user with email: ${email}`);
  }

  const token = await firebase.auth.createCustomToken(firebaseUser.uid);
  const idToken = await getIdToken(token);

  return { firebaseUser, idToken };
}
