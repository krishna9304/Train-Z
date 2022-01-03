import Router, { Application } from "express";
import mentorRouter from "./mentor.routes";
const mainRouter: Application = Router();

mainRouter.use("/mentor", mentorRouter);

export default mainRouter;
