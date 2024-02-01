import { describe, expect, it, vi, beforeEach } from "vitest";
import { clearDatabase } from "../utils/clear-database";
import { Request, Response } from "express";
import { isAuth } from "./is-auth";
import { ForbiddenError, UnauthorizedError } from "../errors";
import { getTestUser } from "../utils/get-test-user";
import { db } from "../db";

describe("isAuth middleware", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("Should throw UnauthorizedError if the authorization header is invalid", async () => {
    const req = { headers: { authorization: "" } } as Request;
    const res = {} as Response;
    const next = vi.fn();

    await expect(() => isAuth()(req, res, next)).rejects.toThrowError(
      UnauthorizedError
    );
  });

  it("Should throw UnauthorizedError if requireAccount is true and the token is not associated with a user", async () => {
    const { idToken } = await getTestUser();
    const req = { headers: { authorization: `Bearer ${idToken}` } } as Request;
    const res = { locals: {} } as Response;
    const next = vi.fn();

    await expect(() => isAuth()(req, res, next)).rejects.toThrowError(
      UnauthorizedError
    );
    expect(next).toBeCalledTimes(0);
  }, 10000);

  it("Should throw ForbiddenError if requireAccount is false and the token is associated with a user", async () => {
    const { firebaseUser, idToken } = await getTestUser();
    await db.user.create({
      data: { username: "username", firebaseId: firebaseUser.uid },
    });

    const req = { headers: { authorization: `Bearer ${idToken}` } } as Request;
    const res = { locals: {} } as Response;
    const next = vi.fn();

    await expect(() => isAuth(false)(req, res, next)).rejects.toThrowError(
      ForbiddenError
    );
    expect(next).toBeCalledTimes(0);
  }, 10000);
});
