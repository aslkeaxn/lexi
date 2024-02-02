import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { clearDatabase } from "../../utils/clear-database";
import { createUser } from "../../utils/create-user";
import { App } from "../../app";
import supertest from "supertest";
import { db } from "../../db";

describe("[GET] /api/projects", () => {
  beforeAll(clearDatabase);
  afterEach(clearDatabase);

  const url = "/api/projects";
  const app = App.create();
  const req = supertest(app);

  it("Should return status 200 along with the user's projects", async () => {
    const { user, idToken } = await createUser("username", 1);
    await db.project.createMany({
      data: [
        { userId: user.id, name: "project1" },
        { userId: user.id, name: "project2" },
      ],
    });
    const projects = await db.project.findMany();

    const res = await req.get(url).set("authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(200);
    expect(res.body.projects).toEqual(projects);
  }, 20000);
});
