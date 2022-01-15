import { FilterQuery } from "mongoose";
import studentModel, {
  StudentInterface,
} from "../database/models/student.model";
import { hashPassword } from "../helpers/password.helper";
import {
  isValidStudent,
  isValidStudentInterface,
} from "../helpers/validate.helper";

export const studentExists = (
  filter: FilterQuery<StudentInterface>
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    studentModel
      .exists(filter)
      .then((exists) => {
        resolve(exists);
      })
      .catch(reject);
  });
};

// TODO: test createStudent
export const createStudent = (
  data: StudentInterface
): Promise<StudentInterface> => {
  return new Promise((resolve, reject) => {
    const {
      isValid,
      errs,
      data: finalData,
    }: isValidStudentInterface = isValidStudent(data);

    if (isValid) {
      studentExists({ username: data.username })
        .then((exists1) => {
          if (exists1) {
            reject("username not available");
          } else {
            studentExists({ email: data.email })
              .then((exists2) => {
                if (exists2) {
                  reject("Email already registered");
                } else {
                  hashPassword(finalData.password + "")
                    .then((hash) => {
                      finalData.password = hash + "";
                      const mentor = new studentModel(finalData);
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
