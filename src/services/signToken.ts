import jwt from "jsonwebtoken";

const signToken = (payload: any) => {
  return jwt.sign(payload, process.env.SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export default signToken;
