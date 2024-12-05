import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/appError";

//@ts-expect-error
const verifyToken = async (token: string): any => {
  if (typeof token !== "string")
    throw new AppError("Invalid token format", 400);

  return await jwt.verify(token, process.env.SECRET_KEY as string);
};

export default verifyToken;
