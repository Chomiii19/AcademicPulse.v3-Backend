import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { compareSync, hashSync } from "bcryptjs";
import AppError from "../errors/appError";
import IUser from "../@types/userInterface";
import signToken from "../utils/signToken";
import verifyToken from "../utils/verifyToken";

const prisma = new PrismaClient();

class AuthService {
  createSendToken = (user: IUser, statusCode: number, res: Response): void => {
    const token = signToken({ id: user.id, email: user.email });
    const cookieExpiry = Number(process.env.JWT_COOKIE_EXPIRES_IN);

    const cookieOptions = {
      expires: new Date(Date.now() + cookieExpiry * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
      path: "/",
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("authToken", token, cookieOptions);
    res.status(statusCode).json({ status: "Success", data: { user } });
  };

  async createUser(req: Request): Promise<IUser> {
    const {
      surname,
      firstname,
      middlename,
      extension,
      email,
      phoneNumber,
      password,
    } = req.body;

    const user = await prisma.user.create({
      data: {
        surname,
        firstname,
        middlename,
        extension,
        email,
        phoneNumber,
        password: hashSync(password, 10),
      },
    });

    return user;
  }

  async findUserByEmail(email: string): Promise<void> {
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (user) throw new AppError("A user with this email already exists.", 400);
  }

  async findUserByEmailPassword(
    email: string,
    password: string
  ): Promise<IUser> {
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user || !compareSync(password, user.password))
      throw new AppError("Incorrect email or password", 400);

    return user;
  }

  async verifyUser(token: string): Promise<void> {
    const decoded = await verifyToken(token);
    console.log(decoded);
    await prisma.user.update({
      where: { email: decoded.email },
      data: { isVerified: true },
    });
  }
}

export default new AuthService();
