import Router, { Application } from "express";
import scheduleController from "../controllers/schedule.controller";
const scheduleRouter: Application = Router();

scheduleRouter.post("/createsession", scheduleController.createSession);

export default scheduleRouter;
