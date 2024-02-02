import { describe, expect, it } from "vitest";
import { constant } from "../../constant";
import { testDb } from "../../utils/test-db";
import { getTestUser } from "../../utils/get-test-user";
import { req } from "../../utils/get-req";
import { createUser } from "../../utils/create-user";

const url = constant.userRoute;

describe.concurrent(`[POST] ${url}`, () => {
  it(
    "Should return status 201 and register the user",
    testDb(async (tx) => {
      const { firebaseUser, idToken } = await getTestUser(1);
      const dto = { username: "username" };

      const res = await req(tx)
        .post(url)
        .set("authorization", `Bearer ${idToken}`)
        .send(dto);
      const user = await tx.user.findFirst({
        where: { firebaseId: firebaseUser.uid },
      });

      expect(res.status).toBe(201);
      expect(user?.firebaseId).toBe(firebaseUser.uid);
    }),
    20000
  );

  it(
    "Should return status 403 if the username is taken",
    testDb(async (tx) => {
      const {} = await createUser(tx, "username", 1);
      const { firebaseUser, idToken } = await getTestUser(2);
      const dto = { username: "username" };

      const res = await req(tx)
        .post(url)
        .set("authorization", `Bearer ${idToken}`)
        .send(dto);
      const user = await tx.user.findFirst({
        where: { firebaseId: firebaseUser.uid },
      });

      expect(res.status).toBe(403);
      expect(user).toBeNull();
    }),
    20000
  );
});
