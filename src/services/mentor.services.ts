import mentorModel, { MentorInterface } from "../database/models/mentor.model";
import isValidMentor, {
  isValidMentorInterface,
} from "../helpers/validate.helper";
import { hashPassword } from "../helpers/password.helper";
import { FilterQuery, ObjectId } from "mongoose";
import mail, { emailVerificationBody } from "../helpers/mailer.helper";

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
            reject("User already exists");
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

export const mentorExists = (
  filter: FilterQuery<MentorInterface>
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    mentorModel
      .exists(filter)
      .then((exists) => {
        resolve(exists);
      })
      .catch(reject);
  });
};

export const startEmailVerification = (data: {
  userType: string;
  email: string;
  username: string;
  _id: ObjectId;
}) => {
  // @param data.userType is required to differentiate between mentor and user
  const { userType, email, username, _id } = data;
  return new Promise((resolve, reject) => {
    if (userType === "MENTOR") {
      mail(email, emailVerificationBody(username, _id, userType))
        .then(resolve)
        .catch(reject);
    } else if (userType === "STUDENT") {
      //TODO: student exists
    } else {
      reject("user type is missing");
    }
  });
};
