import { model, Number, Schema } from "mongoose";

export interface MentorInterface extends Schema {
  name: String;
  username: String;
  email: String;
  password: String;
  phone: String;
  dpURL: String;
  expertise: [String];
  availability: Number;
  createdAt: Date;
  updatedAt: Date;
}

const Mentor: MentorInterface = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: false },
  dpURL: { type: String, default: "path to some default dp for mentor" },
  expertise: [String],
  availability: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
}) as MentorInterface;

Mentor.virtual("firstName").get((doc: any): any => {
  return (doc?.name as string).split(" ")[0];
});

export default model("mentor", Mentor);
