import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { clearDatabase } from "../../utils/clear-database";
import { App } from "../../app";
import supertest from "supertest";
import { getTestUser } from "../../utils/get-test-user";
import { db } from "../../db";

describe("[POST] /api/users/username", () => {
  beforeAll(clearDatabase);
  afterEach(clearDatabase);

  const url = "/api/users/username";
  const app = App.create();
  const req = supertest(app);

  it("Should return status 200 and update the user's username", async () => {
    const { firebaseUser, idToken } = await getTestUser();
    await db.user.create({
      data: { firebaseId: firebaseUser.uid, username: "username" },
    });
    const dto = { username: "new_username" };

    const res = await req
      .post(url)
      .set("authorization", `Bearer ${idToken}`)
      .send(dto);

    const user = await db.user.findFirst({
      where: { firebaseId: firebaseUser.uid },
    });

    expect(res.status).toBe(200);
    expect(user?.username).toBe(dto.username);
  });

  it("Should return status 403 if the username is already taken", async () => {
    const { firebaseUser, idToken } = await getTestUser();
    await db.user.create({
      data: { firebaseId: firebaseUser.uid, username: "username1" },
    });
    await db.user.create({
      data: { firebaseId: "firebaseId", username: "username2" },
    });
    const dto = { username: "username2" };

    const res = await req
      .post(url)
      .set("authorization", `Bearer ${idToken}`)
      .send(dto);

    expect(res.status).toBe(403);
  });
});
