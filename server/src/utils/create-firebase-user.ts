import { CreateRequest } from "firebase-admin/auth";
import { firebase } from "../firebase";
import { getIdToken } from "./get-id-token";

export async function createFirebaseUser(properties: CreateRequest = {}) {
  const firebaseUser = await firebase.auth.createUser(properties);
  const token = await firebase.auth.createCustomToken(firebaseUser.uid);
  const idToken = await getIdToken(token);

  return { firebaseUser, idToken };
}
