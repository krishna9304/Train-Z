import { NextFunction, Request, Response } from "express";
import { tokenGenerator } from "../helpers/jwt.helper";
import { createMentor, mentorExists } from "../services/mentor.services";
import response from "../utils/response";

const authController = {
  signUp(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    if (data.userType === "Mentor") {
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
    }
    //TODO: student signup
  },
  signIn() {},
  exists(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    if (data.userType === "Mentor") {
      mentorExists(data.username).then((exists) =>
        response(res, 200, exists ? "User exists" : "User does not exists", {
          exists,
          data,
        })
      );
    }
  },
  verifyOTP() {},
  verifyEmail() {},
};
export default authController;
