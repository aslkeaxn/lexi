import { NextFunction, Request, Response } from "express";

export async function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("\n", error, "\n");

  res.status(500).json({ error: "Internal server error" });
}
