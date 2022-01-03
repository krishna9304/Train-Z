import Router, { Application, NextFunction, Request, Response } from "express";
import authController from "../controllers/auth.controller";
const mentorRouter: Application = Router();

mentorRouter.post("/signup", authController.signUp);
mentorRouter.post("/exists", authController.exists);

export default mentorRouter;
