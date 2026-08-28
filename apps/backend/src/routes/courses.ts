import { Router, type Request, type Response } from "express";
import { listCourses } from "../services/courses.service.js";
import { listCoursesQuerySchema, type ListCoursesQueryInput } from "../validation/schemas.js";
import { validate } from "../middleware/validate.js";

const coursesRouter = Router();
export default coursesRouter;

coursesRouter.get("/",
    validate(listCoursesQuerySchema, "query"),
    async (req: Request, res: Response) => {
        const result = await listCourses(req.validated as ListCoursesQueryInput);
        return res.status(200).json(result);
});

//Fix the validation middleware to handle errors and send appropriate responses Good night