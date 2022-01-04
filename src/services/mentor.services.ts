import mentorModel, { MentorInterface } from "../database/models/mentor.model";
import isValidMentor, {
  isValidMentorInterface,
} from "../helpers/validate.helper";
import { hashPassword } from "../helpers/password.helper";

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
                mentor.save();
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
