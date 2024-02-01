import dotenv from "dotenv";
import { readEnv } from "./lib/read-env";

dotenv.config();

const NODE_ENV = readEnv("NODE_ENV", ["prod", "dev", "test"]);

const PORT = readEnv("PORT");

const DATABASE_URL =
  NODE_ENV === "prod"
    ? readEnv("DATABASE_URL")
    : NODE_ENV === "dev"
    ? readEnv("DATABASE_URL_DEV")
    : readEnv("DATABASE_URL_TEST");

const FIREBASE_CLIENT_EMAIL = readEnv("FIREBASE_CLIENT_EMAIL");
const FIREBASE_PRIVATE_KEY = readEnv("FIREBASE_PRIVATE_KEY");
const FIREBASE_PROJECT_ID = readEnv("FIREBASE_PROJECT_ID");
const FIREBASE_API_KEY = readEnv("FIREBASE_API_KEY");

export const Env = {
  PORT,

  DATABASE_URL,

  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_PROJECT_ID,
  FIREBASE_API_KEY,
};
