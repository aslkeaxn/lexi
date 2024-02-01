import { Firebase } from "../firebase";
import { getIdToken } from "./get-id-token";

export async function createFirebaseUser() {
  const firebaseUser = await Firebase.auth.createUser({});
  const token = await Firebase.auth.createCustomToken(firebaseUser.uid);
  const idToken = await getIdToken(token);

  return { firebaseUser, idToken };
}
