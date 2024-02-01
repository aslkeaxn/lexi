import { Env } from "../env";

export async function getIdToken(token: string) {
  const apiKey = Env.FIREBASE_API_KEY;
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ token, returnSecureToken: true }),
  });
  const json = await res.json();

  if (typeof json !== "object" || !Object.keys(json).includes("idToken")) {
    throw new Error("Couldn't fetch idToken");
  }

  const idToken = json.idToken as string;

  return idToken;
}
