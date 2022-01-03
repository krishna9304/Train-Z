import { ObjectId } from "mongoose";

const jwt = require("jsonwebtoken");

const tokenGenerator = (_id:ObjectId, name:string):string => {
  let token = jwt.sign(
    {
      _id,
      name,
    },
    process.env.JWT_SECRET, //! requires JWT_SECRET in .env
    {
      expiresIn: "100h",
    }
  );
  return token;
};

interface Decoded{
    _id:ObjectId,
    name:string
}

interface DecoderCallback{
    (err:any,
    finalDecoded:Decoded|undefined):any
}

const tokenDecoder = (token:string, cb:DecoderCallback) => {
  jwt.verify(token, process.env.JWT_SECRET, (err:any, decoded:Decoded) => {
    let finalDecoded;
    try {
      finalDecoded = {
        _id: decoded._id,
        name: decoded.name,
      };
      cb(err, finalDecoded);
    } catch (error) {
      cb(err, finalDecoded);
    }
  });
};
module.exports.tokenGenerator = tokenGenerator;
module.exports.tokenDecoder = tokenDecoder;