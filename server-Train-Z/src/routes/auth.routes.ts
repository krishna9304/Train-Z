import Router, { Application } from "express";
import authController from "../controllers/auth.controller";
const authRouter: Application = Router();

authRouter.post("/signup", authController.signUp);
authRouter.post("/signin", authController.signIn);
authRouter.post("/exists", authController.exists);
// JWT verification
authRouter.post("/verify", authController.verifyJWT);
// email verification
authRouter.post(
  "/emailverification/resend",
  authController.resendEmailVerification
);
// confirm email
authRouter.get(
  "/emailverification/:verificationtoken",
  authController.verifyEmail
);
// request password reset
authRouter.post("/resetpassword", authController.sendResetPassword);
// reset password
authRouter.post(
  "/resetpassword/:verificationtoken",
  authController.resetPassword
);

export default authRouter;
