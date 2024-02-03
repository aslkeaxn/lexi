import { describe, expect, it } from "vitest";
import { constant } from "../../constant";
import { testDb } from "../../utils/test-db";
import { createUser } from "../../utils/create-user";
import { mockLanguages } from "../../utils/mock-languages";
import { mockProject } from "../../utils/mock-project";
import { req } from "../../utils/get-req";

const url = constant.projectRoute;

describe.concurrent(`[GET] ${url}/:projectId`, () => {
  it(
    "Should return status 200 as well as the project",
    testDb(async (tx) => {
      const { user, authorization } = await createUser(tx, "username", 1);
      const languages = await mockLanguages(tx, 2);
      const project = await mockProject(tx, user.id, languages);

      const res = await req(tx)
        .get(`${url}/${project.id}`)
        .set("authorization", authorization);

      expect(res.status).toBe(200);
      expect(res.body.project).toEqual(project);
    }),
    20000
  );

  it(
    "Should return status 200 and null if the user isn't related to the project",
    testDb(async (tx) => {
      const { user } = await createUser(tx, "username1", 1);
      const { authorization } = await createUser(tx, "username1", 2);
      const languages = await mockLanguages(tx, 2);
      const project = await mockProject(tx, user.id, languages);

      const res = await req(tx)
        .get(`${url}/${project.id}`)
        .set("authorization", authorization);

      expect(res.status).toBe(200);
      expect(res.body.project).toBeNull();
    }),
    20000
  );
});
