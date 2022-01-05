import isEmail from "validator/lib/isEmail";
import isURL from "validator/lib/isURL";
import { MentorInterface } from "../database/models/mentor.model";

export interface isValidMentorInterface {
  isValid: boolean;
  errs: string[];
  data: MentorInterface;
}

const isValidMentor = (data: MentorInterface): isValidMentorInterface => {
  const errs: string[] = [];
  if (!data.name) errs.push("Name is required");
  if (!data.username) errs.push("Username is required");
  if (!data.email) errs.push("Email is required");
  else if (!isEmail(data.email + "")) errs.push("Invalid Email");
  if (!data.password) errs.push("Password is required");
  else if ((data.password + "").length < 8)
    errs.push("Password must be atleast 8 characters");
  if (data.dpURL && !isURL(data.dpURL + "")) errs.push("Invalid DP");
  if (typeof data.expertise !== "object") errs.push("Invalid Expertise");
  else if (!data.expertise.length)
    errs.push("Atleast one Expertise is required");
  if (typeof data.availability !== "number" || !data.availability)
    errs.push("Invalid Availability");
  data.createdAt = new Date();

  if (errs.length)
    return {
      isValid: false,
      errs,
      data,
    };
  else
    return {
      isValid: true,
      errs,
      data,
    };
};

export default isValidMentor;
