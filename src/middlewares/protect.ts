import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/appError";
import verifyToken from "../utils/verifyToken";

const prisma = new PrismaClient();

const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.authToken;

    if (!token) {
      if (process.env.NODE_ENV === "production") return res.redirect("/");
      else return next(new AppError("Invalid token!", 401));
    }

    const decoded = await verifyToken(token);

    const currentUser = await prisma.user.findFirst({
      where: { email: decoded.email },
    });

    if (!currentUser)
      return next(
        new AppError("The user belonging with this token doesn't exist", 401)
      );

    req.user = currentUser;
    next();
  }
);

export default protect;
