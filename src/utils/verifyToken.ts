import jwt, { JwtPayload } from "jsonwebtoken";

//@ts-expect-error
const verifyToken = async (token: string): any => {
  return await jwt.verify(token, process.env.SECRET_KEY as string);
};

export default verifyToken;
