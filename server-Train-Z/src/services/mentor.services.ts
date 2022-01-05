import mentorModel, { MentorInterface } from "../database/models/mentor.model";
import isValidMentor, {
  isValidMentorInterface,
} from "../helpers/validate.helper";
import { hashPassword } from "../helpers/password.helper";
import { ObjectId } from "mongoose";
import mail, { emailVerificationBody } from "../helpers/mailer.helper";
import response from "../utils/response";
import { Response } from "express";
import e from "connect-timeout";

export const createMentor = (
  data: MentorInterface
): Promise<MentorInterface> => {
  return new Promise((resolve, reject) => {
    const {
      isValid,
      errs,
      data: finalData,
    }: isValidMentorInterface = isValidMentor(data);

    if (isValid) {
      mentorExists(data.username)
        .then((exists) => {
          if (exists) {
            reject("User already exists");
          } else {
            hashPassword(finalData.password + "")
              .then((hash) => {
                finalData.password = hash + "";
                const mentor = new mentorModel(finalData);
                resolve(mentor);
              })
              .catch(reject);
          }
        })
        .catch(reject);
    } else {
      reject(errs);
    }
  });
};

export const mentorExists = (username: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    mentorModel
      .exists({ username })
      .then((exists) => {
        resolve(exists);
      })
      .catch(reject);
  });
};

export const sendEmailVerification = (
  _id: ObjectId | string,
  username: string,
  userType: "MENTOR" | "STUDENT"
): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (userType === "MENTOR") {
      mentorModel
        .findById(_id)
        .then((mentor: MentorInterface) => {
          if (mentor.emailVerified) {
            reject({
              code: 400,
              message: "Already Verified",
              data: {
                _id,
              },
            });
          } else {
            mail(mentor.email, emailVerificationBody(username, _id, userType))
              .then((_) => {
                resolve({
                  code: 200,
                  message: "Email verification started",
                  data: {
                    email: mentor.email,
                    _id,
                  },
                });
              })
              .catch(reject);
          }
        })
        .catch(reject);
    }
  });
};

export const insensitiveMentor = (mentor: MentorInterface): any => {
  return {
    _id: mentor._id,
    name: mentor.name,
    username: mentor.username,
    email: mentor.email,
    phone: mentor.phone,
    dpURL: mentor.dpURL,
    expertise: mentor.expertise,
    availability: mentor.availability,
    createdAt: mentor.createdAt,
    updatedAt: mentor.updatedAt,
    emailVerified: mentor.emailVerified,
    phoneVerified: mentor.phoneVerified,
  };
};
