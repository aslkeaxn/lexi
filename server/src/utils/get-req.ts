import supertest from "supertest";
import { createApp } from "../app";
import { TDatabase } from "../db";

export function req(db: TDatabase) {
  const app = createApp(db);
  const req = supertest(app);
  return req;
}
