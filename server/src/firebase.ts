import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { Env } from "./env";

const app = initializeApp({
  credential: credential.cert({
    clientEmail: Env.FIREBASE_CLIENT_EMAIL,
    privateKey: Env.FIREBASE_PRIVATE_KEY,
    projectId: Env.FIREBASE_PROJECT_ID,
  }),
});

const auth = getAuth(app);

export const Firebase = {
  auth,
};
