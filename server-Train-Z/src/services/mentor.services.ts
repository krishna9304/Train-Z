import mentorModel, { MentorInterface } from "../database/models/mentor.model";
import {
  isValidMentor,
  isValidMentorInterface,
} from "../helpers/validate.helper";
import { hashPassword } from "../helpers/password.helper";
import { FilterQuery, isValidObjectId, ObjectId } from "mongoose";
import mail, {
  emailVerificationBody,
  resetPasswordBody,
} from "../helpers/mailer.helper";
import studentModel, {
  StudentInterface,
} from "../database/models/student.model";
import { studentExists } from "./student.services";

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

export const sendEmailVerification = (
  _id: ObjectId | string,
  userType: "MENTOR" | "STUDENT"
): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!isValidObjectId(_id)) reject("Invalid ID");
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
                      const insensitivementor: InsensitiveMentorInterface =
                        insensitiveMentor(mentor);
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
    } else if (userType === "STUDENT") {
      studentExists({ _id })
        .then((exists: boolean) => {
          if (exists) {
            studentModel
              .findById(_id)
              .then((student: StudentInterface) => {
                if (student.emailVerified) {
                  reject({
                    code: 400,
                    message: "Already Verified",
                    data: {
                      _id,
                    },
                  });
                } else {
                  mail(
                    student.email,
                    emailVerificationBody(
                      student.username.split(" ")[0],
                      _id,
                      userType
                    )
                  )
                    .then((_) => {
                      const insensitivestudent: InsensitiveStudentInterface =
                        insensitiveStudent(student);
                      resolve(insensitivestudent);
                    })
                    .catch(reject);
                }
              })
              .catch(reject);
          } else {
            reject("student does not exists");
          }
        })
        .catch(reject);
    } else {
      reject("Invalid user type");
    }
  });
};

export const sendPasswordReset = (
  _id: ObjectId,
  userType: "MENTOR" | "STUDENT"
): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (userType === "MENTOR") {
      mentorExists({ _id })
        .then((exists) => {
          if (exists) {
            mentorModel
              .findById(_id)
              .then((mentor) => {
                mail(
                  mentor.email,
                  resetPasswordBody(mentor.name.split(" ")[0], _id, userType)
                ).then(resolve);
              })
              .catch(reject);
          } else reject("Mentor not found");
        })
        .catch(reject);
    } else if (userType === "STUDENT") {
      // TODO: student reset password
    } else {
      reject("Invalid user type");
    }
  });
};

interface InsensitiveMentorInterface {
  _id: ObjectId;
  name: string;
  username: string;
  email: string;
  phone: string;
  dpURL: string;
  expertise: [string];
  availability: number;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export const insensitiveMentor = (
  mentor: MentorInterface
): InsensitiveMentorInterface => {
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

interface InsensitiveStudentInterface {
  _id: ObjectId;
  name: string;
  username: string;
  email: string;
  phone: string;
  dpURL: string;
  interest: [string];
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export const insensitiveStudent = (
  student: StudentInterface
): InsensitiveStudentInterface => {
  return {
    _id: student._id,
    name: student.name,
    username: student.username,
    email: student.email,
    phone: student.phone,
    dpURL: student.dpURL,
    interest: student.interest,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
    emailVerified: student.emailVerified,
    phoneVerified: student.phoneVerified,
  };
};
