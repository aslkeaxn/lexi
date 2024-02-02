import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { clearDatabase } from "../../utils/clear-database";
import { App } from "../../app";
import supertest from "supertest";
import { createUser } from "../../utils/create-user";
import { db } from "../../db";

describe("[POST] /api/projects/:projectId", () => {
  beforeAll(clearDatabase);
  afterEach(clearDatabase);

  const url = "/api/projects";
  const app = App.create();
  const req = supertest(app);

  it("Should update the project's name, add selected languages, and remove selected languages", async () => {
    const { user, idToken } = await createUser("username", 1);
    await db.language.createMany({
      data: [
        { name: "language1", code: "l1" },
        { name: "language2", code: "l2" },
        { name: "language3", code: "l3" },
      ],
    });
    const languages = await db.language.findMany();
    const project = await db.project.create({
      data: { userId: user.id, name: "project" },
    });
    await db.projectLanguage.createMany({
      data: [
        { projectId: project.id, languageId: languages[0].id },
        { projectId: project.id, languageId: languages[1].id },
      ],
    });
    const dto = {
      name: "new name",
      languagesToAddIds: [languages[2].id],
      languagesToRemoveIds: [languages[0].id],
    };

    const res = await req
      .post(`${url}/${project.id}`)
      .set("authorization", `Bearer ${idToken}`)
      .send(dto);
    const dbProject = await db.project.findFirst({ where: { id: project.id } });
    const projectLanguages = await db.projectLanguage.findMany({
      where: { projectId: project.id },
    });
    const projectLanguagesIds = projectLanguages.map((pl) => pl.languageId);

    expect(res.status).toBe(200);
    expect(dbProject?.name).toBe(dto.name);
    expect(projectLanguagesIds).toEqual([languages[1].id, languages[2].id]);
  }, 20000);
});
