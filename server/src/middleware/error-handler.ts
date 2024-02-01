import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors";
import { ZodError } from "zod";

export async function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("\n", error, "\n");

  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: error.message });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({ error: "Validation error" });
  }

  res.status(500).json({ error: "Internal server error" });
}
