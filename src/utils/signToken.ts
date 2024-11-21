import jwt from "jsonwebtoken";

const signToken = (payload: any, expiresIn: string): string => {
  return jwt.sign(payload, process.env.SECRET_KEY as string, {
    expiresIn,
  });
};

export default signToken;
