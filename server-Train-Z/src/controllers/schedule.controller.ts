import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";
import scheduleModel, {
  ScheduleInterface,
  SessionInterface,
} from "../database/models/schedule.model";
import { addSession } from "../helpers/schedule.helper";

export const createSchedule = ({
  userId,
  userType,
}: {
  userId: ObjectId;
  userType: "MENTOR" | "STUDENT";
}): Promise<ScheduleInterface> => {
  return new Promise((resolve, reject) => {
    const schedule: ScheduleInterface = new scheduleModel({
      userId,
      userType,
    });
    schedule.save().then(resolve).catch(reject);
  });
};

const scheduleController = {
  createSession(req: Request, res: Response, next: NextFunction) {
    const {
      session,
      userId,
      userType,
      day,
    }: {
      session: SessionInterface;
      userId: ObjectId;
      userType: "MENTOR" | "STUDENT";
      day: string;
    } = req.body;
    addSession({ session, userId, userType, day })
      .then((schedule) => {
        res.json({
          res: true,
          schedule,
        });
      })
      .catch(next);
  },
};
export default scheduleController;
