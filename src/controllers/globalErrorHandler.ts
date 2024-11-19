import { NextFunction, Request, Response } from "express";
import AppError from "../errors/appError";
import * as errorHandlers from "../errors/errorHandlers";

const sendDevError = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendProdError = (err: AppError, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.log("ERROR: ", err);
  res.status(500).json({
    status: "Error",
    message: "Something went wrong!",
  });
};

export default (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  if (process.env.NODE_ENV === "development") sendDevError(err, res);
  if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error?.name === "TokenExpiredError")
      error = errorHandlers.tokenExpiredHandler();
    if (error?.name === "JsonWebTokenError")
      error = errorHandlers.jwtErrorHandler();

    sendProdError(error, res);
  }
};
