import { NextFunction, Request, Response } from "express";
import { TDatabase } from "../db";

type THandler = (req: Request, res: Response) => Promise<unknown>;

type TMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export function asyncHandler(...fns: (THandler | TMiddleware)[]) {
  return fns.map((fn) => {
    return async function (req: Request, res: Response, next: NextFunction) {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  });
}

type TDBHM = (db: TDatabase) => THandler | TMiddleware;

export function asyncHandlerDb(db: TDatabase, ...fns: TDBHM[]) {
  return asyncHandler(...fns.map((fn) => fn(db)));
}
