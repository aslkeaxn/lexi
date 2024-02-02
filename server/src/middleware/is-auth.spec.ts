import { describe, expect, it, vi } from "vitest";
import { createUser } from "../utils/create-user";
import { Request, Response } from "express";
import { isAuth } from "./is-auth";
import { getTestUser } from "../utils/get-test-user";
import { testDb } from "../utils/test-db";
import { UnauthorizedError } from "../errors";

describe.concurrent("isAuth middleware", () => {
  it(
    "Should call next if requireAccount is true and the user has an account",
    testDb(async (tx) => {
      const { user, authorization } = await createUser(tx, "username", 1);
      const req = { headers: { authorization } } as Request;
      const res = { locals: {} } as Response;
      const next = vi.fn();

      await isAuth(tx)(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.locals.user).toEqual(user);
      expect(res.locals.userId).toBe(user.id);
    }),
    20000
  );

  it(
    "Should call next if requireAccount is false and the user doesn't have an account",
    testDb(async (tx) => {
      const { idToken } = await getTestUser(1);
      const authorization = `Bearer ${idToken}`;
      const req = { headers: { authorization } } as Request;
      const res = { locals: {} } as Response;
      const next = vi.fn();

      await isAuth(tx, false)(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.locals.user).toBeUndefined();
      expect(res.locals.userId).toBeUndefined();
    }),
    20000
  );

  it.each([true, false])(
    "Should throw an UnauthorizedError if the authorization header is invalid",
    async (requireAccount) => {
      await testDb(async (tx) => {
        const authorization = "this could be made better, i guess";
        const req = { headers: { authorization } } as Request;
        const res = { locals: {} } as Response;
        const next = vi.fn();

        await expect(() =>
          isAuth(tx, requireAccount)(req, res, next)
        ).rejects.toThrow(UnauthorizedError);

        expect(next).toHaveBeenCalledTimes(0);
        expect(res.locals.user).toBeUndefined();
        expect(res.locals.userId).toBeUndefined();
      })();
    },
    20000
  );

  it(
    "Should throw an UnauthorizedError if requireAccount is true and the user doesn't have an account",
    testDb(async (tx) => {
      const { idToken } = await getTestUser(1);
      const authorization = `Bearer ${idToken}`;
      const req = { headers: { authorization } } as Request;
      const res = { locals: {} } as Response;
      const next = vi.fn();

      await expect(() => isAuth(tx)(req, res, next)).rejects.toThrow(
        UnauthorizedError
      );

      expect(next).toHaveBeenCalledTimes(0);
      expect(res.locals.user).toBeUndefined();
      expect(res.locals.userId).toBeUndefined();
    }),
    20000
  );

  it(
    "Should throw an UnauthorizedError if requireAccount is false and the user has an account",
    testDb(async (tx) => {
      const { authorization } = await createUser(tx, "username", 1);
      const req = { headers: { authorization } } as Request;
      const res = { locals: {} } as Response;
      const next = vi.fn();

      await expect(() => isAuth(tx, false)(req, res, next)).rejects.toThrow(
        UnauthorizedError
      );

      expect(next).toHaveBeenCalledTimes(0);
      expect(res.locals.user).toBeUndefined();
      expect(res.locals.userId).toBeUndefined();
    }),
    20000
  );
});
