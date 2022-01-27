import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import mentorModel, { MentorInterface } from "../database/models/mentor.model";
import studentModel, {
  StudentInterface,
} from "../database/models/student.model";
import { tokenDecoder, tokenGenerator } from "../helpers/jwt.helper";
import { comparePassword, hashPassword } from "../helpers/password.helper";
import {
  createMentor,
  mentorExists,
  sendEmailVerification,
  insensitiveMentor,
  sendPasswordReset,
  insensitiveStudent,
} from "../services/mentor.services";
import { createStudent, studentExists } from "../services/student.services";
import { createSchedule } from "./schedule.controller";

const authController = {
  signUp(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    console.log(data);

    const { userType } = data;
    // @param data.userType is required to differentiate between mentor and user
    if (userType == "MENTOR") {
      createMentor(data)
        .then((mentor) => {
          const token = tokenGenerator(mentor?._id, "MENTOR");
          mentor
            .save()
            .then((_) => {
              sendEmailVerification(mentor._id, userType)
                .then((insensitivementor) => {
                  createSchedule({ userId: mentor._id, userType })
                    .then(() => {
                      res.json({
                        res: true,
                        token,
                        userinfo: {
                          user: insensitivementor,
                          userType: "MENTOR",
                        },
                      });
                    })
                    .catch(next);
                })
                .catch(next);
            })
            .catch(next);
        })
        .catch(next);
    } else if (userType == "STUDENT") {
      createStudent(data)
        .then((student) => {
          const token = tokenGenerator(student?._id, "STUDENT");
          student
            .save()
            .then((_) => {
              sendEmailVerification(student._id, userType)
                .then((insensitivestudent) => {
                  res.json({
                    res: true,
                    token,
                    userinfo: { user: insensitivestudent, userType: "STUDENT" },
                  });
                })
                .catch(next);
            })
            .catch(next);
        })
        .catch(next);
    } else {
      res.json({
        res: false,
        errs: ["User type is missing."],
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
            res.json({
              res: false,
              errs: ["User not found"],
              data: {
                username: username,
              },
            });
          } else {
            mentorModel
              .findOne({ username: username })
              .then((mentor: MentorInterface) => {
                comparePassword(mentor.password, password)
                  .then((same) => {
                    if (same) {
                      const token = tokenGenerator(mentor?._id, "MENTOR");
                      const insensitivementor = insensitiveMentor(mentor);
                      res.json({
                        message: "Authenticated successfully",
                        res: true,
                        token,
                        userinfo: {
                          userType: "MENTOR",
                          user: insensitivementor,
                        },
                      });
                    } else {
                      res.json({
                        res: false,
                        errs: ["Wrong password"],
                        data: {
                          username,
                        },
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
      studentExists({ username })
        .then((exists) => {
          if (!exists) {
            res.json({
              res: false,
              errs: ["User not found"],
              data: {
                username: username,
              },
            });
          } else {
            studentModel
              .findOne({ username: username })
              .then((student: StudentInterface) => {
                comparePassword(student.password, password)
                  .then((same) => {
                    if (same) {
                      const token = tokenGenerator(student?._id, "STUDENT");
                      const insensitivestudent = insensitiveStudent(student);
                      res.json({
                        message: "Authenticated successfully",
                        res: true,
                        token,
                        userinfo: {
                          userType: "STUDENT",
                          user: insensitivestudent,
                        },
                      });
                    } else {
                      res.json({
                        res: false,
                        errs: ["Wrong password"],
                        data: {
                          username,
                        },
                      });
                    }
                  })
                  .catch(next);
              })
              .catch(next);
          }
        })
        .catch(next);
    } else {
      res.json({
        res: false,
        errs: ["User type is missing."],
      });
    }
  },
  exists(req: Request, res: Response, next: NextFunction) {
    // @param data.userType is required to differentiate between mentor and user
    const data = req.body;
    const { userType } = data;
    if (userType === "MENTOR") {
      mentorExists({ username: data.username })
        .then((exists) => {
          if (exists) {
            res.json({
              res: true,
              message: "User exists",
            });
          } else {
            res.json({
              res: false,
              message: "User does not exists",
            });
          }
        })
        .catch(next);
    } else if (userType === "STUDENT") {
      studentExists({ username: data.username })
        .then((exists) => {
          if (exists) {
            res.json({
              res: true,
              message: "User exists",
            });
          } else {
            res.json({
              res: false,
              message: "User does not exists",
            });
          }
        })
        .catch(next);
    } else {
      res.json({
        res: false,
        errs: ["User type is missing."],
      });
    }
  },
  verifyEmail(req: Request, res: Response, next: NextFunction) {
    // @param data.userType is required to differentiate between mentor and user
    const { verificationtoken } = req.params;

    tokenDecoder(verificationtoken)
      .then((decoded) => {
        console.log(decoded);
        if (decoded.str2 === "MENTOR_EMAIL_VERIFICATION") {
          mentorModel
            .findById(decoded._id)
            .then((mentor: MentorInterface) => {
              if (mentor.emailVerified) {
                res.json({
                  res: false,
                  errs: ["Email already verified"],
                });
              } else {
                mentor.emailVerified = true;
                const insensitivementor = insensitiveMentor(mentor);
                mentor
                  .save()
                  .then(() => {
                    res.json({
                      res: true,
                      userinfo: {
                        user: insensitivementor,
                        userType: "STUDENT",
                      },
                    });
                  })
                  .catch(next);
              }
            })
            .catch(next);
        } else if (decoded.str2 === "STUDENT_EMAIL_VERIFICATION") {
          studentModel
            .findById(decoded._id)
            .then((student: StudentInterface) => {
              if (student.emailVerified) {
                res.json({
                  res: false,
                  errs: ["Email already verified"],
                });
              } else {
                student.emailVerified = true;
                const insensitivestudent = insensitiveStudent(student);
                student
                  .save()
                  .then(() => {
                    res.json({
                      res: true,
                      userinfo: {
                        user: insensitivestudent,
                        userType: "STUDENT",
                      },
                    });
                  })
                  .catch(next);
              }
            })
            .catch(next);
        } else {
          res.json({
            res: false,
            errs: ["Invalid token"],
          });
        }
      })
      .catch(next);
  },
  verifyJWT(req: Request, res: Response, next: NextFunction) {
    // @param data.userType is required to differentiate between mentor and user
    const data = req.body;
    const { token } = data;
    if (!token) {
      res.json({
        res: false,
        errs: ["Token is required"],
      });
    }
    tokenDecoder(token)
      .then((decoded) => {
        console.log(decoded);
        if (decoded.str2 === "MENTOR") {
          mentorExists({ _id: decoded._id })
            .then((exists) => {
              if (!exists) {
                res.json({
                  res: false,
                  errs: ["User not found"],
                });
              } else {
                mentorModel
                  .findOne({ _id: decoded._id })
                  .then((mentor: MentorInterface) => {
                    const newToken = tokenGenerator(mentor?._id, "MENTOR");
                    const insensitivementor = insensitiveMentor(mentor);
                    res.json({
                      res: true,
                      token: newToken,
                      message: "Authenticated successfully",
                      userinfo: {
                        userType: "MENTOR",
                        user: insensitivementor,
                      },
                    });
                  })
                  .catch(next);
              }
            })
            .catch(next);
        } else if (decoded.str2 === "STUDENT") {
          studentExists({ _id: decoded._id })
            .then((exists) => {
              if (!exists) {
                res.json({
                  res: false,
                  errs: ["User not found"],
                });
              } else {
                studentModel
                  .findOne({ _id: decoded._id })
                  .then((student: StudentInterface) => {
                    const newToken = tokenGenerator(student?._id, "STUDENT");
                    const insensitivestudent = insensitiveStudent(student);
                    res.json({
                      res: true,
                      token: newToken,
                      message: "Authenticated successfully",
                      userinfo: {
                        userType: "STUDENT",
                        user: insensitivestudent,
                      },
                    });
                  })
                  .catch(next);
              }
            })
            .catch(next);
        } else {
          res.json({
            res: false,
            errs: ["User type is missing."],
          });
        }
      })
      .catch(next);
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
      res.json({
        res: false,
        errs,
      });
    } else {
      sendEmailVerification(_id, userType)
        .then((insensitivementor) => {
          res.json({
            res: true,
            userinfo: {
              userType: "MENTOR",
              user: insensitivementor,
            },
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
      res.json({
        res: false,
        errs,
      });
    } else {
      sendPasswordReset(_id, userType)
        .then((insensitivementor) => {
          res.json({
            res: true,
            message: "Email sent",
            userinfo: {
              userType: "MENTOR",
              user: insensitivementor,
            },
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

    if (errs.length)
      res.json({
        res: false,
        errs,
      });
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
                        res.json({
                          res: true,
                          message: "Password changed",
                        });
                      })
                      .catch();
                  })
                  .catch(next);
              })
              .catch(next);
          } else if (decoded.str2 === "STUDENT_RESET_PASSWORD") {
            // TODO:student reset password
          } else {
            res.json({
              res: false,
              errs: ["Invalid token"],
              verificationtoken,
            });
          }
        })
        .catch(next);
    }
  },
};
export default authController;
