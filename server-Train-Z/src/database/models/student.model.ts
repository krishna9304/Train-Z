import { model, Schema } from "mongoose";

const Student = new Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  phone: String,
  interest: [String],
  dpURL: String,
  createdAt: Date,
  updatedAt: Date,
});

export default model("student", Student);
