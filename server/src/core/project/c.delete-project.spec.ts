import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { clearDatabase } from "../../utils/clear-database";
import { App } from "../../app";
import supertest from "supertest";
import { createUser } from "../../utils/create-user";
import { db } from "../../db";

describe("[DELETE] /api/projects/:projectId", () => {
  beforeAll(clearDatabase);
  afterAll(clearDatabase);

  const url = "/api/projects";
  const app = App.create();
  const req = supertest(app);

  it("Should return status 200 and delete the user's project", async () => {
    const { user, idToken } = await createUser("username", 1);
    const project = await db.project.create({
      data: { userId: user.id, name: "project" },
    });

    const res = await req
      .delete(`${url}/${project.id}`)
      .set("authorization", `Bearer ${idToken}`);
    const dbProject = await db.project.findFirst({
      where: { id: project.id },
    });

    expect(res.status).toBe(200);
    expect(dbProject).toBeNull();
  }, 10000);

  it("Should return status 200 without deleting the project if the user doesn't own it", async () => {
    const { user } = await createUser("username", 1);
    const { idToken } = await createUser("username", 2);
    const project = await db.project.create({
      data: { userId: user.id, name: "project" },
    });

    const res = await req
      .delete(`${url}/${project.id}`)
      .set("authorization", `Bearer ${idToken}`);
    const dbProject = await db.project.findFirst({
      where: { id: project.id },
    });

    expect(res.status).toBe(200);
    expect(dbProject).toEqual(project);
  }, 10000);
});
