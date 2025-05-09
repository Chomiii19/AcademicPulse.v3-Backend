import { Response, Request, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/appError";
import AuthService from "../services/authService";
import IUser from "../@types/userInterface";
import sendMail from "../utils/sendEmail";
import signToken from "../utils/signToken";

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.email) return next(new AppError("Invalid empty fields", 400));

    await AuthService.findUserByEmail(req.body.email);

    const user = await AuthService.createUser(req);
    const token = signToken(
      { email: user.email, id: user.id },
      process.env.JWT_VERIFY_ACC_EXPIRES_IN as string
    );

    sendMail("User Verification (AcadPulse)", user, "verifyAccount", token);

    const newUser = {
      id: user.id,
      role: user.role,
      email: user.email,
      firstname: user.firstname,
      isVerified: user.isVerified,
      schoolId: user.schoolId,
    } as IUser;

    AuthService.createSendToken(newUser, 201, res);
  }
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(
        new AppError("Email and password fields can not be blank", 400)
      );

    const user = (await AuthService.findUserByEmailPassword(
      email,
      password
    )) as IUser;

    if (!user.isVerified)
      return next(new AppError("Account not verified", 401));

    AuthService.createSendToken(user, 200, res);
  }
);

const verifyUserAccount = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await AuthService.verifyUser(String(req.params.token));

    res.redirect(`${process.env.APP_ORIGIN}/profile-picture`);
  }
);

const signout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("authToken", "", {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.status(200).json({ status: "Success" });
  }
);

export { signup, login, verifyUserAccount, signout };
