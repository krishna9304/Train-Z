import Router, { Application } from "express";
import authRouter from "./auth.routes";
const mainRouter: Application = Router();

mainRouter.use("/auth", authRouter);

export default mainRouter;
