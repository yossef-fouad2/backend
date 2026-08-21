import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error({ err, method: req.method, url: req.url }, "Unhandled error occurred in request pipeline");

  // In production, don't leak full error messages to client
  const message = process.env.NODE_ENV === "production"
    ? "Internal Server Error"
    : err.message || "Unknown error";

  res.status(500).json({ error: message });
}
