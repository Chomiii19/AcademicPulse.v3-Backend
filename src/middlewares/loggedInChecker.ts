import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import catchAsync from "../utils/catchAsync";
import verifyToken from "../utils/verifyToken";

const prisma = new PrismaClient();

const loggedInChecker = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.authToken;
    if (!token) return res.redirect("/");

    const decoded = await verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (user) return res.redirect("/app");
    else return res.redirect("/users/signout");
  }
);

export default loggedInChecker;
