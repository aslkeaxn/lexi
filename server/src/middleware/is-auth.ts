import { NextFunction, Request, Response } from "express";
import { TDatabase } from "../db";
import { UnauthorizedError } from "../errors";
import { firebase } from "../firebase";

export function isAuth(db: TDatabase, requireAccount: boolean = true) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.includes("Bearer ")) {
      throw new UnauthorizedError();
    }

    const idToken = authorization.split("Bearer ")[1];
    const decodedIdToken = await firebase.auth.verifyIdToken(idToken);
    const user = await db.user.findFirst({
      where: { firebaseId: decodedIdToken.uid },
    });

    if (requireAccount) {
      if (!user) {
        throw new UnauthorizedError();
      }

      res.locals.user = user;
      res.locals.userId = user.id;
    } else {
      if (user) {
        throw new UnauthorizedError();
      }
    }

    res.locals.firebaseId = decodedIdToken.uid;

    next();
  };
}
