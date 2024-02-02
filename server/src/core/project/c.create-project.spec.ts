import { describe, expect, it } from "vitest";
import { constant } from "../../constant";
import { testDb } from "../../utils/test-db";
import { createUser } from "../../utils/create-user";
import { req } from "../../utils/get-req";
import { mockLanguages } from "../../utils/mock-languages";

const url = constant.projectRoute;

describe.concurrent(`[POST] ${url}`, () => {
  it(
    "Should return status 201 and create the project",
    testDb(async (tx) => {
      const { user, authorization } = await createUser(tx, "username", 1);
      const languages = await mockLanguages(tx, 3);
      const dto = {
        name: "project",
        languageIds: [languages[0].id],
      };

      const res = await req(tx)
        .post(url)
        .set("authorization", authorization)
        .send(dto);
      const project = await tx.project.findFirst({
        where: { userId: user.id },
        include: { languages: true },
      });

      expect(res.status).toBe(201);
      expect(project?.name).toBe(dto.name);
      expect(project?.languages.map((l) => l.languageId)).toEqual(
        dto.languageIds
      );
    }),
    20000
  );

  it(
    "Should return status 403 if some languages are invalid",
    testDb(async (tx) => {
      const { user, authorization } = await createUser(tx, "username", 1);
      const dto = { name: "project", languageIds: [user.id] };

      const res = await req(tx)
        .post(url)
        .set("authorization", authorization)
        .send(dto);

      expect(res.status).toBe(403);
    }),
    20000
  );
});
