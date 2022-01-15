import { Document, model, ObjectId, Schema } from "mongoose";

export interface StudentInterface extends Document {
  _id: ObjectId;
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  dpURL: string;
  interest: [string];
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
}

const Student = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: false },
  dpURL: { type: String, default: "path to some default dp for mentor" },
  interest: [String],
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
});

export default model("student", Student);
