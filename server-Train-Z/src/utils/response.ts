import { Response } from "express";

const response = (
  res: Response,
  code: number,
  message: string,
  data: Object
) => {
  res.status(code);
  if (code === 200) {
    res.json({
      status: code,
      message: "Success",
      result: {
        message,
        data,
      },
    });
  } else if (code >= 400 && code < 500) {
    res.json({
      status: code,
      message: "Validation Failed",
      result: {
        message,
        data,
      },
    });
  } else {
    res.json({
      status: code,
      message: "Failed",
      result: {
        message,
        data: null,
      },
    });
  }
};

export default response;
