import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { clearDatabase } from "../../utils/clear-database";
import { App } from "../../app";
import supertest from "supertest";
import { db } from "../../db";
import { createUser } from "../../utils/create-user";

describe("[POST] /api/projects", () => {
  beforeAll(clearDatabase);
  afterEach(clearDatabase);

  const url = "/api/projects";
  const app = App.create();
  const req = supertest(app);

  it("Should return status 201", async () => {
    await db.language.createMany({
      data: [
        { name: "name1", code: "code1" },
        { name: "name2", code: "code2" },
      ],
    });
    const languages = await db.language.findMany();
    const { idToken } = await createUser("username", 1);
    const dto = { name: "project", languageIds: languages.map((l) => l.id) };

    const res = await req
      .post(url)
      .set("authorization", `Bearer ${idToken}`)
      .send(dto);

    expect(res.status).toBe(201);
  }, 20000);

  it("Should return status 403 if a languageId is invalid", async () => {
    await db.language.createMany({
      data: [
        { name: "name1", code: "code1" },
        { name: "name2", code: "code2" },
      ],
    });
    const languages = await db.language.findMany();
    await db.language.delete({ where: { id: languages[0].id } });
    const { idToken } = await createUser("username", 1);
    const dto = { name: "project", languageIds: languages.map((l) => l.id) };

    const res = await req
      .post(url)
      .set("authorization", `Bearer ${idToken}`)
      .send(dto);

    expect(res.status).toBe(403);
  }, 20000);
});
