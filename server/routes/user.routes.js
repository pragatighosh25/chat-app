import express from "express";
import { signup, login, updateProfile, isAuthenticated } from "../controllers/user.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", authMiddleware, updateProfile);
userRouter.get("/check", authMiddleware, isAuthenticated);

export default userRouter;