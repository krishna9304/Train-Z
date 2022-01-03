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

interface DecoderCallback {
  (err: VerifyErrors | null, finalDecoded: JwtPayload | undefined): any;
}

export const tokenDecoder = (token: string, cb: DecoderCallback) => {
  jwt.verify(token, process.env.JWT_SECRET + "", function (err, decoded) {
    cb(err, decoded);
  });
};
