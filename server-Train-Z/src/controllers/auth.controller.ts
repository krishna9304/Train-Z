import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import mentorModel, { MentorInterface } from "../database/models/mentor.model";
import { tokenDecoder, tokenGenerator } from "../helpers/jwt.helper";
import { comparePassword, hashPassword } from "../helpers/password.helper";
import {
  createMentor,
  mentorExists,
  sendEmailVerification,
  insensitiveMentor,
  sendPasswordReset,
} from "../services/mentor.services";
import { createStudent, studentExists } from "../services/student.services";
import response from "../utils/response";

const authController = {
  signUp(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const { userType } = data;
    // @param data.userType is required to differentiate between mentor and user
    if (userType === "MENTOR") {
      createMentor(data)
        .then((mentor) => {
          const token = tokenGenerator(mentor?._id, mentor?.username);
          mentor
            .save()
            .then((_) => {
              sendEmailVerification(mentor._id, userType)
                .then((insensitivementor) => {
                  response(res, 200, "User created successfully", {
                    token,
                    mentor: insensitivementor,
                  });
                })
                .catch(next);
            })
            .catch(next);
        })
        .catch(next);
    } else if (userType === "STUDENT") {
      createStudent(data)
        .then((student) => {
          const token = tokenGenerator(student?._id, student?.username);
          student
            .save()
            .then((_) => {
              sendEmailVerification(student._id, userType)
                .then((insensitivementor) => {
                  response(res, 200, "User created successfully", {
                    token,
                    student: insensitivementor,
                  });
                })
                .catch(next);
            })
            .catch(next);
        })
        .catch(next);
    } else {
      response(res, 400, "user type is missing", {
        data,
      });
    }
  },
  signIn(req: Request, res: Response, next: NextFunction) {
    // @param data.userType is required to differentiate between mentor and user
    const data = req.body;
    const { userType, username, password } = data;
    // @param data.userType is required to differentiate between mentor and user
    if (userType === "MENTOR") {
      mentorExists({ username })
        .then((exists) => {
          if (!exists) {
            response(res, 403, "User not found", {
              username: username,
              password: password,
            });
          } else {
            mentorModel
              .findOne({ username: username })
              .then((mentor: MentorInterface) => {
                comparePassword(mentor.password, password)
                  .then((same) => {
                    if (same) {
                      const token = tokenGenerator(
                        mentor?._id,
                        mentor?.username
                      );
                      const insensitivementor = insensitiveMentor(mentor);
                      response(res, 200, "User authenticated successfully", {
                        token,
                        insensitivementor,
                      });
                    } else {
                      response(res, 403, "Wrong Password", {
                        username,
                        password,
                      });
                    }
                  })
                  .catch(next);
              })
              .catch(next);
          }
        })
        .catch(next);
    } else if (userType === "STUDENT") {
      //TODO: student signin
    } else {
      response(res, 400, "user type is missing", {
        data,
      });
    }
  },
  exists(req: Request, res: Response, next: NextFunction) {
    // @param data.userType is required to differentiate between mentor and user
    const data = req.body;
    const { userType } = data;
    if (userType === "MENTOR") {
      mentorExists({ username: data.username })
        .then((exists) =>
          response(res, 200, exists ? "User exists" : "User does not exists", {
            exists,
            data,
          })
        )
        .catch(next);
    } else if (userType === "STUDENT") {
      studentExists({ username: data.username })
        .then((exists) =>
          response(res, 200, exists ? "User exists" : "User does not exists", {
            exists,
            data,
          })
        )
        .catch(next);
    } else {
      response(res, 400, "user type is missing", {
        data,
      });
    }
  },
  verifyEmail(req: Request, res: Response, next: NextFunction) {
    // @param data.userType is required to differentiate between mentor and user
    const { verificationtoken } = req.params;
    tokenDecoder(verificationtoken)
      .then((decoded) => {
        if (decoded.str2 === "MENTOR_EMAIL_VERIFICATION") {
          mentorModel
            .findById(decoded._id)
            .then((mentor: MentorInterface) => {
              if (mentor.emailVerified) {
                response(res, 200, "Email already verified", {
                  verificationtoken,
                });
              } else {
                mentor.emailVerified = true;
                const insensitivementor = insensitiveMentor(mentor);
                mentor
                  .save()
                  .then(() => {
                    response(res, 200, "Email Verified", { insensitivementor });
                  })
                  .catch(next);
              }
            })
            .catch(next);
        } else if (decoded.str2 === "STUDENT_EMAIL_VERIFICATION") {
          //TODO: student email verification
        } else {
          response(res, 400, "Invalid verification token", {
            verificationtoken,
          });
        }
      })
      .catch(next);
  },
  verifyJWT(req: Request, res: Response, next: NextFunction) {
    // @param data.userType is required to differentiate between mentor and user
    const data = req.body;
    const { userType, token } = data;
    if (!token) {
      response(res, 403, "token is required", data);
    }
    if (userType === "MENTOR") {
      tokenDecoder(token)
        .then((decoded) => {
          mentorExists({ username: decoded.str2 })
            .then((exists) => {
              if (!exists) {
                response(res, 403, "User not found", {
                  token,
                });
              } else {
                mentorModel
                  .findOne({ username: decoded.str2 })
                  .then((mentor: MentorInterface) => {
                    const newToken = tokenGenerator(
                      mentor?._id,
                      mentor?.username
                    );
                    response(res, 200, "User authenticated successfully", {
                      newToken,
                      mentor,
                    });
                  })
                  .catch(next);
              }
            })
            .catch(next);
        })
        .catch(next);
    } else if (userType === "STUDENT") {
      //TODO: student verifyJWT
    } else {
      response(res, 400, "user type is missing", {
        data,
      });
    }
  },
  resendEmailVerification(req: Request, res: Response, next: NextFunction) {
    const { _id, userType } = req.body;
    const errs: string[] = [];
    if (!_id) {
      errs.push("User id is required");
    } else if (!isValidObjectId(_id)) {
      errs.push("Invalid User id");
    }
    if (!userType) {
      errs.push("User type is required");
    } else if (userType !== "MENTOR" && userType !== "STUDENT") {
      errs.push("Invalid Mentor");
    }
    if (errs.length) {
      response(res, 400, "Invalid data", { errs });
    } else {
      sendEmailVerification(_id, userType)
        .then((insensitivementor) => {
          response(res, 200, "User created successfully", {
            mentor: insensitivementor,
          });
        })
        .catch(next);
    }
  },
  sendResetPassword(req: Request, res: Response, next: NextFunction) {
    const { _id, userType } = req.body;
    const errs: string[] = [];
    if (!_id) {
      errs.push("User id is required");
    } else if (!isValidObjectId(_id)) {
      errs.push("Invalid User id");
    }
    if (!userType) {
      errs.push("User type is required");
    } else if (userType !== "MENTOR" && userType !== "STUDENT") {
      errs.push("Invalid Mentor");
    }
    if (errs.length) {
      response(res, 400, "Invalid data", { errs });
    } else {
      sendPasswordReset(_id, userType)
        .then((insensitivementor) => {
          response(res, 200, "Email sent", {
            mentor: insensitivementor,
          });
        })
        .catch(next);
    }
  },
  resetPassword(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const errs: string[] = [];
    const { verificationtoken } = req.params;
    const { newpass }: { newpass: string } = data;
    if (!newpass) errs.push("new password is required");
    else if (typeof newpass !== "string") errs.push("Invalid password");
    else if (newpass.length < 8)
      errs.push("The password must contain at least 8 character");

    if (errs.length) response(res, 400, "Invalid data", { errs });
    else {
      tokenDecoder(verificationtoken)
        .then((decoded) => {
          if (decoded.str2 === "MENTOR_RESET_PASSWORD") {
            mentorModel
              .findById(decoded._id)
              .then((mentor) => {
                hashPassword(newpass)
                  .then((hashed) => {
                    mentor.password = hashed;
                    mentor
                      .save()
                      .then(() => {
                        response(res, 200, "Password changed", {});
                      })
                      .catch();
                  })
                  .catch(next);
              })
              .catch(next);
          } else if (decoded.str2 === "STUDENT_RESET_PASSWORD") {
            // TODO:student reset password
          } else {
            response(res, 400, "invalid token", {
              verificationtoken,
            });
          }
        })
        .catch(next);
    }
  },
};
export default authController;
