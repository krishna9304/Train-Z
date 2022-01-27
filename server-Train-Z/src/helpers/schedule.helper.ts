import scheduleModel, {
  DaysInterface,
  ScheduleInterface,
  SessionInterface,
} from "../database/models/schedule.model";
import validator from "validator";
import { ObjectId } from "mongoose";

export const addSession = ({
  session,
  userId,
  userType,
  day,
}: {
  session: SessionInterface;
  userId: ObjectId;
  userType: "MENTOR" | "STUDENT";
  day: string;
}): Promise<ScheduleInterface> => {
  const errs: string[] = [];
  if (!session.name || !(typeof session.name === "string"))
    errs.push("Invalid Name");
  if (!(typeof session.desc === "string")) errs.push("Invalid Description");
  if (
    !session.start ||
    !(typeof session.start === "number") ||
    session.start > 19 ||
    session.start < 8
  )
    errs.push("Invalid Start");
  if (
    !session.end ||
    !(typeof session.end === "number") ||
    session.end > 20 ||
    session.end < 9
  )
    errs.push("Invalid End");
  if (!session.link || !validator.isURL(session.link + ""))
    errs.push("Invalid Meeting Link");

  return new Promise((resolve, reject) => {
    scheduleModel
      .findOne({
        userId,
        userType,
      })
      .then((schedule: ScheduleInterface) => {
        const days: DaysInterface = schedule.days;
        if (
          isBusyAt(
            { start: session.start, end: session.end },
            getDayByName(schedule.days, day)
          )
        )
          errs.push("Already busy at the given time");
        else {
          switch (day) {
            case "monday":
              days.monday.push(session);
              break;
            case "tuesday":
              days.tuesday.push(session);
              break;
            case "wednesday":
              days.wednesday.push(session);
              break;
            case "thursday":
              days.thursday.push(session);
              break;
            case "friday":
              days.friday.push(session);
              break;
            case "saturday":
              days.saturday.push(session);
              break;
            case "sunday":
              days.sunday.push(session);
              break;
            default:
              reject("Invalid day");
          }
          scheduleModel
            .updateOne({ userId }, { days })
            .then((val) => {
              scheduleModel.findById(schedule._id).then((s) => {
                resolve(s);
              });
            })
            .catch(reject);
        }
        if (errs.length) reject(errs);
      })
      .catch(reject);
  });
};

const isBusyAt = (
  { start, end }: { start: number; end: number },
  day: Array<SessionInterface>
) => {
  const busyTimes = getBusyTimes(day);
  return busyTimes.includes(start) || busyTimes.includes(end);
};

const getBusyTimes = (day: Array<SessionInterface>): number[] => {
  const busyTimes: number[] = [];
  for (const session of day) {
    let { start: busytime, end } = session;
    while (busytime < end) {
      if (!busyTimes.includes(busytime)) busyTimes.push(busytime);
      busytime++;
    }
  }
  return busyTimes;
};

const getDayByName = (days: DaysInterface, day: string): SessionInterface[] => {
  switch (day) {
    case "monday":
      return days.monday;
    case "tuesday":
      return days.tuesday;
    case "wednesday":
      return days.wednesday;
    case "thursday":
      return days.thursday;
    case "friday":
      return days.friday;
    case "saturday":
      return days.saturday;
    case "sunday":
      return days.sunday;
    default:
      return [];
  }
};
