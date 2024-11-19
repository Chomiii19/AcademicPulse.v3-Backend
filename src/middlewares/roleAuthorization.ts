import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/appError";

const prisma = new PrismaClient();

const roleAuthorization = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const roles = ["admin", "owner"];

    const user = await prisma.user.findFirst({
      where: { email: req.user.email },
    });

    if (!user) return next(new AppError("User account does not exist!", 404));

    if (!roles.includes(user.role))
      return next(
        new AppError("You are not authorized to access this feature", 403)
      );

    next();
  }
);
