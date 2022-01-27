import Router, { Application } from "express";
const mainRouter: Application = Router();

import authRouter from "./auth.routes";
import scheduleRouter from "./schedule.routes";

mainRouter.use("/auth", authRouter);
mainRouter.use("/schedule", scheduleRouter);

export default mainRouter;
