import { ObjectId } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

export const tokenGenerator = (
  _id: ObjectId | string,
  str2: String
): string => {
  try {
    const token: string = jwt.sign(
      {
        _id,
        str2,
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

export const tokenDecoder = (
  token: string
): Promise<{ _id: ObjectId; str2: string }> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET + "", function (err, decoded) {
      if (err) {
        reject(err);
      } else {
        const finalDecoded: { _id: ObjectId; str2: string } = {
          _id: decoded?._id,
          str2: decoded?.str2,
        };
        resolve(finalDecoded);
      }
    });
  });
};
