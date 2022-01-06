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
      mentorExists({ username: data.username })
        .then((exists1) => {
          if (exists1) {
            reject("username not available");
          } else {
            mentorExists({ email: data.email })
              .then((exists2) => {
                if (exists2) {
                  reject("Email already registered");
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
          }
        })
        .catch(reject);
    } else {
      reject(errs);
    }
  });
};

export const mentorExists = (filter: any): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    mentorModel
      .exists(filter)
      .then((exists) => {
        resolve(exists);
      })
      .catch(reject);
  });
};

export const sendEmailVerification = (
  _id: ObjectId | string,
  userType: "MENTOR" | "STUDENT"
): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (userType === "MENTOR") {
      mentorExists({ _id })
        .then((exists: boolean) => {
          if (exists) {
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
                  mail(
                    mentor.email,
                    emailVerificationBody(
                      mentor.username.split(" ")[0],
                      _id,
                      userType
                    )
                  )
                    .then((_) => {
                      const insensitivementor = insensitiveMentor(mentor);
                      resolve(insensitivementor);
                    })
                    .catch(reject);
                }
              })
              .catch(reject);
          } else {
            reject("Mentor does not exists");
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
