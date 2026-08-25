import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

/**
 * Express middleware that validates req.body against a Zod schema.
 * On success: replaces req.body with the parsed (coerced + defaulted) data and calls next().
 * On failure: returns 400 with structured field-level errors.
 */
export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Build field-level error map from issues
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".") || "_root";
        (fieldErrors[key] ??= []).push(issue.message);
      }

      res.status(400).json({
        error: "Validation failed",
        details: fieldErrors,
      });
      return;
    }

    req.body = result.data;
    next();
  };
}
