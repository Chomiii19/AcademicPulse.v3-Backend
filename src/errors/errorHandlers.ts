import AppError from "./appError";

const jwtErrorHandler = () =>
  new AppError("Invalid token. Please login again.", 401);

const tokenExpiredHandler = () =>
  new AppError("Your token has expired. Please login again.", 401);

export { jwtErrorHandler, tokenExpiredHandler };
