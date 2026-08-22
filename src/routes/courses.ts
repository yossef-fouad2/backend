import { Router, type Request, type Response } from "express";
import { listCourses } from "../services/courses.service.js";
import { listCoursesQuerySchema } from "../validation/schemas.js";

const coursesRouter = Router();
export default coursesRouter;

coursesRouter.get("/", async (req: Request, res: Response) => {
  const parsed = listCoursesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_root";
      (fieldErrors[key] ??= []).push(issue.message);
    }

    return res.status(400).json({
      error: "Validation failed",
      details: fieldErrors,
    });
  }

  const result = await listCourses(parsed.data);
  return res.status(200).json(result);
});
