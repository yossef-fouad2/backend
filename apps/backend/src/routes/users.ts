import { Router } from "express";

const userRouter = Router();
export default userRouter;

userRouter.get("/me",(req, res) =>{
    res.json({ message: "User route is working" });
})