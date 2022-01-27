import { Document, model, ObjectId, Schema } from "mongoose";

export interface SessionInterface {
  start: number;
  end: number;
  name: string;
  link: string;
  desc: string;
}

export interface DaysInterface extends Object {
  monday: Array<SessionInterface>;
  tuesday: Array<SessionInterface>;
  wednesday: Array<SessionInterface>;
  thursday: Array<SessionInterface>;
  friday: Array<SessionInterface>;
  saturday: Array<SessionInterface>;
  sunday: Array<SessionInterface>;
}

export interface ScheduleInterface extends Document {
  _id: ObjectId;
  userId: ObjectId;
  userType: "MENTOR" | "STUDENT";
  days: DaysInterface;
}

const Schedule: Schema = new Schema({
  userId: {
    required: true,
    type: Schema.Types.ObjectId,
  },
  userType: {
    required: true,
    type: String,
  },
  days: {
    type: Object,
    default: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
});

export default model("schedule", Schedule);
