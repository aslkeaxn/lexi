import { describe, expect, it } from "vitest";
import { constant } from "../../constant";
import { testDb } from "../../utils/test-db";
import { createUser } from "../../utils/create-user";
import { mockLanguages } from "../../utils/mock-languages";
import { mockProject } from "../../utils/mock-project";
import { ProjectRole } from "@prisma/client";
import { req } from "../../utils/get-req";

const url = constant.projectRoute;

describe.concurrent(`[GET] ${url}`, () => {
  it(
    "Should return status 200 and the projects the user is related to",
    testDb(async (tx) => {
      const { user: user1 } = await createUser(tx, "username1", 1);
      const { user: user2, authorization } = await createUser(
        tx,
        "username2",
        2
      );
      const languages1 = await mockLanguages(tx, 1, 1);
      const languages2 = await mockLanguages(tx, 2, 2);
      const project1 = await mockProject(tx, user1.id, languages1);
      const project2 = await mockProject(tx, user1.id, languages1);
      const project3 = await mockProject(tx, user1.id, languages2);
      const project4 = await mockProject(tx, user2.id, languages2);
      await tx.roleOnProject.createMany({
        data: [
          {
            projectId: project2.id,
            userId: user2.id,
            role: ProjectRole.Editor,
          },
          {
            projectId: project3.id,
            userId: user2.id,
            role: ProjectRole.Viewer,
          },
        ],
      });

      const res = await req(tx).get(url).set("authorization", authorization);

      expect(res.status).toBe(200);
      expect(res.body.projects).not.toContain(project1);
      expect(res.body.projects).toEqual([project2, project3, project4]);
    }),
    20000
  );
});
