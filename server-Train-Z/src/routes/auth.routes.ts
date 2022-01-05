import Router, { Application, NextFunction, Request, Response } from "express";
import authController from "../controllers/auth.controller";
const mentorRouter: Application = Router();

mentorRouter.post("/signup", authController.signUp);
mentorRouter.post("/signin", authController.signIn);
mentorRouter.post("/exists", authController.exists);
mentorRouter.post("/verify", authController.verifyJWT);
mentorRouter.get(
  "/emailverification/:verificationtoken",
  authController.verifyEmail
);

export default mentorRouter;
