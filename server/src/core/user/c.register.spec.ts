import { beforeAll, describe, expect, it, afterEach } from "vitest";
import { clearDatabase } from "../../utils/clear-database";
import supertest from "supertest";
import { App } from "../../app";
import { getTestUser } from "../../utils/get-test-user";
import { db } from "../../db";

describe("[POST] /api/users", () => {
  beforeAll(clearDatabase);
  afterEach(clearDatabase);

  const url = "/api/users";
  const app = App.create();
  const req = supertest(app);

  it("Should return status 201 and create a new user", async () => {
    const { firebaseUser, idToken } = await getTestUser();
    const dto = { username: "username" };

    const res = await req
      .post(url)
      .set("authorization", `Bearer ${idToken}`)
      .send(dto);

    const user = await db.user.findFirst({
      where: { firebaseId: firebaseUser.uid },
    });

    expect(res.status).toBe(201);
    expect(user).not.toBeNull();
    expect(user?.username).toBe(dto.username);
  });

  it("Should return status 403 if the username is taken", async () => {
    const { idToken } = await getTestUser();
    const dto = { username: "username" };
    await db.user.create({ data: { firebaseId: "firebaseId", ...dto } });

    const res = await req
      .post(url)
      .set("authorization", `Bearer ${idToken}`)
      .send(dto);

    expect(res.status).toBe(403);
  });
});
