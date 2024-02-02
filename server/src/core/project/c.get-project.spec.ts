import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { clearDatabase } from "../../utils/clear-database";
import { App } from "../../app";
import supertest from "supertest";
import { createUser } from "../../utils/create-user";
import { db } from "../../db";

describe("[GET] /api/projects/:projectId", () => {
  beforeAll(clearDatabase);
  afterEach(clearDatabase);

  const url = "/api/projects";
  const app = App.create();
  const req = supertest(app);

  it("Should return status 200 along with the user's project", async () => {
    const { user, idToken } = await createUser("username", 1);
    const project = await db.project.create({
      data: { userId: user.id, name: "project" },
    });

    const res = await req
      .get(`${url}/${project.id}`)
      .set("authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(200);
    expect(res.body.project).toEqual(project);
  });

  it("Should return null if the user doesn't own the project", async () => {
    const { user } = await createUser("username", 1);
    const { idToken } = await createUser("username2", 2);
    const project = await db.project.create({
      data: { userId: user.id, name: "project" },
    });

    const res = await req
      .get(`${url}/${project.id}`)
      .set("authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(200);
    expect(res.body.project).toBeNull();
  });
});
