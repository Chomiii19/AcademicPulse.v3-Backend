import jwt, { JwtPayload } from "jsonwebtoken";

const verifyToken = async (token: string): Promise<any> => {
  return jwt.verify(token, process.env.SECRET_KEY as string);
};

export default verifyToken;
