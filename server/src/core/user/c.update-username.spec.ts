import { describe, expect, it } from "vitest";
import { constant } from "../../constant";
import { testDb } from "../../utils/test-db";
import { createUser } from "../../utils/create-user";
import { req } from "../../utils/get-req";

const url = constant.userRoute;

describe.concurrent(`[POST] ${url}/username`, () => {
  it(
    "Should return status 200 and change the user's username",
    testDb(async (tx) => {
      const { user, authorization } = await createUser(tx, "username", 1);
      const dto = { username: "new_username" };

      const res = await req(tx)
        .post(`${url}/username`)
        .set("authorization", authorization)
        .send(dto);
      const updatedUser = await tx.user.findFirst({ where: { id: user.id } });

      expect(res.status).toBe(200);
      expect(updatedUser?.username).toBe(dto.username);
    }),
    20000
  );

  it(
    "Should return status 403 if the username is taken",
    testDb(async (tx) => {
      const {} = await createUser(tx, "username1", 1);
      const { user, authorization } = await createUser(tx, "username2", 2);
      const dto = { username: "username1" };

      const res = await req(tx)
        .post(`${url}/username`)
        .set("authorization", authorization)
        .send(dto);
      const notUpdatedUser = await tx.user.findFirst({
        where: { id: user.id },
      });

      expect(res.status).toBe(403);
      expect(notUpdatedUser?.username).toBe(user.username);
    }),
    20000
  );
});
