import { ObjectId } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

export const tokenGenerator = (_id: ObjectId, username: String): string => {
  try {
    const token: string = jwt.sign(
      {
        _id,
        username,
      },
      process.env.JWT_SECRET + "", //! requires JWT_SECRET in .env
      {
        expiresIn: "240h",
      }
    );
    return token;
  } catch (e) {
    throw new Error("Invalid JWT Secret");
  }
};

export const tokenDecoder = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET + "", function (err, decoded) {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
