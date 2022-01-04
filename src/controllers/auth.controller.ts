import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import mentorModel, { MentorInterface } from "../database/models/mentor.model";
import { tokenDecoder, tokenGenerator } from "../helpers/jwt.helper";
import { comparePassword } from "../helpers/password.helper";
import { createMentor, mentorExists } from "../services/mentor.services";
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
          response(res, 200, "User created successfully", {
            token,
            mentor,
            data,
          });
        })
        .catch(next);
    } else if (userType === "STUDENT") {
      //TODO: student signup
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
      mentorExists(username)
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
                comparePassword(mentor.password, password).then((same) => {
                  if (same) {
                    const token = tokenGenerator(mentor?._id, mentor?.username);
                    response(res, 200, "User authenticated successfully", {
                      token,
                      mentor,
                      username,
                      password,
                    });
                  } else {
                    response(res, 403, "Wrong Password", {
                      username,
                      password,
                    });
                  }
                });
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
      mentorExists(data.username)
        .then((exists) =>
          response(res, 200, exists ? "User exists" : "User does not exists", {
            exists,
            data,
          })
        )
        .catch(next);
    } else if (userType === "STUDENT") {
      //TODO: student exists
    } else {
      response(res, 400, "user type is missing", {
        data,
      });
    }
  },
  verifyOTP() {},
  verifyEmail(req: Request, res: Response, next: NextFunction) {
    // @param data.userType is required to differentiate between mentor and user
    // const data = req.body;
    // const { userType } = data;
    // if (userType === "MENTOR") {
    //   mentorExists(data.username)
    //     .then((exists) =>
    //       response(res, 200, exists ? "User exists" : "User does not exists", {
    //         exists,
    //         data,
    //       })
    //     )
    //     .catch(next);
    // } else if (userType === "STUDENT") {
    //   //TODO: student exists
    // } else {
    //   response(res, 400, "user type is missing", {
    //     data,
    //   });
    // }
  },
  verifyJWT(req: Request, res: Response, next: NextFunction) {
    // @param data.userType is required to differentiate between mentor and user
    const data = req.body;
    const { userType, token } = data;
    if (userType === "MENTOR") {
      if (!token) {
        response(res, 403, "token is required", data);
      } else {
        tokenDecoder(token)
          .then((decoded) => {
            mentorExists(decoded.username).then((exists) => {
              if (!exists) {
                response(res, 403, "User not found", {
                  token,
                });
              } else {
                mentorModel
                  .findOne({ username: decoded.username })
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
            });
          })
          .catch(next);
      }
    } else if (userType === "STUDENT") {
      //TODO: student verifyJWT
    } else {
      response(res, 400, "user type is missing", {
        data,
      });
    }
  },
};
export default authController;
