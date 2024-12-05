import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/appError";

const verifyToken = async (token: string): Promise<any> => {
  if (typeof token !== "string") {
    throw new AppError("Invalid token format", 400);
  }

  try {
    return jwt.verify(token, process.env.SECRET_KEY as string);
  } catch (error) {
    throw new AppError("Invalid or expired token", 401);
  }
};

export default verifyToken;
