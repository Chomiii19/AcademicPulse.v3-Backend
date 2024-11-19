import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import catchAsync from "../utils/catchAsync";
import AppService from "../services/appService";
import sendMail from "../utils/sendEmail";
import signToken from "../services/signToken";
import AppError from "../errors/appError";

const prisma = new PrismaClient();

const createSchool = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const school = await AppService.createSchool(req);

    res.status(201).json({
      status: "Success",
      data: {
        school,
      },
    });
  }
);

const validateId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const student = await AppService.validateId(req);

    res.status(200).json({
      status: "Success",
      message: `Student ${student.studentId} is successfully validated`,
    });
  }
);

const addCollaborators = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { collaborator, role } = await AppService.addCollaborators(req);

    const school = await prisma.school.findFirst({
      where: { schoolId: req.user.schoolId },
    });

    if (!school)
      return next(new AppError("You are not an owner of any school", 400));

    const token = signToken({
      email: collaborator.email,
      role,
      schoolId: school?.schoolId,
    });

    await sendMail(
      `${req.user.name} has invited you as collaborator at ${school?.name}.`,
      collaborator,
      "addCollab",
      token
    );

    res.status(200).json({
      status: "Success",
      message: `Successfully sent an email invitation to ${collaborator.firstname}`,
    });
  }
);

const acceptCollab = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await AppService.acceptCollab(req);

    res.redirect("/");
  }
);

const studentLogEntrance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const studentId = req.body;

    if (!studentId) return next(new AppError("QR code value is empty", 400));

    await AppService.studentLogEntrance(studentId, req);

    res.status(200).json({
      status: "Success",
      message: `Successfully validated`,
    });
  }
);

const studentLogExit = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const studentId = req.body;

    if (!studentId) return next(new AppError("QR code value is empty", 400));

    await AppService.studentLogExit(studentId, req);

    res.status(200).json({
      status: "Success",
      message: `Successfully validated`,
    });
  }
);

const enrolledCount = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const enrolledCount = await AppService.enrolledCount(req);

    res.status(200).json({
      status: "Success",
      data: { enrolledCount },
    });
  }
);

const validatedIdCount = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const count = await AppService.validatedIdCount(req);

    res.status(200).json({
      status: "Success",
      data: { count },
    });
  }
);

const countStudentsInSchool = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const count = await AppService.countStudentsInSchool(req);

    res.status(200).json({
      status: "Success",
      data: { count },
    });
  }
);

const getAllStudentsInSchool = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const students = AppService.getAllStudentsInSchool(req);

    res.status(200).json({
      status: "Success",
      data: { students },
    });
  }
);

//GET ALL STUDENTS (FOR INSCHOOL)

export { createSchool, validateId, addCollaborators, acceptCollab };
