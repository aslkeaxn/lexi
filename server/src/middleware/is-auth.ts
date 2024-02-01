import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors";
import { Firebase } from "../firebase";
import { db } from "../db";

export function isAuth(requireAccount: boolean = true) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.includes("Bearer ")) {
      throw new UnauthorizedError();
    }

    try {
      const idToken = authorization.split("Bearer ")[1];
      const decodedToken = await Firebase.auth.verifyIdToken(idToken);
      const user = await db.user.findFirst({
        where: { firebaseId: decodedToken.uid },
      });

      if (requireAccount) {
        if (!user) {
          throw new UnauthorizedError();
        }

        res.locals.user = user;
        res.locals.userId = user.id;
      } else {
        if (user) {
          throw new ForbiddenError();
        }
      }

      res.locals.firebaseId = decodedToken.uid;
      next();
    } catch (error) {
      if (
        error instanceof UnauthorizedError ||
        error instanceof ForbiddenError
      ) {
        throw error;
      }

      console.error("\n", error, "\n");
      throw new UnauthorizedError();
    }
  };
}
