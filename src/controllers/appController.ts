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
    if (req.user.role !== 1)
      return next(
        new AppError("Only the owner of this school can set permission.", 401)
      );

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

const setUserRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== 1)
      return next(
        new AppError("Only the owner of this school can set permission.", 401)
      );

    const { email, roleStatus } = await AppService.setUserRole(req);

    res.status(200).json({
      status: "Success",
      message: `Collaborator: ${email}'s role is now set to ${roleStatus}`,
    });
  }
);

const getAllCollaborators = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const collaborators = AppService.getAllColaborators(req);

    res.status(200).json({
      status: "Success",
      data: { collaborators },
    });
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

const getAllStudentsInSchoolStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const students = await AppService.getAllStudentsInSchoolStatus(req);

    res.status(200).json({
      status: "Success",
      data: { students },
    });
  }
);

const getStudentLogs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId, userTimeZone, startDate, endDate } = req.body;

    const records = await prisma.$queryRaw`
  SELECT * 
  FROM your_table
  WHERE 
    schoolId = ${req.user.schoolId} AND 
    studentId = ${studentId} AND 
    createdAt AT TIME ZONE 'UTC' AT TIME ZONE ${userTimeZone} 
    BETWEEN ${startDate} AND ${endDate};
`;

    res.status(200).json({
      status: "Success",
      data: { records },
    });
  }
);

const validatedIdGraphData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

const schoolLogGraphData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export {
  createSchool,
  validateId,
  addCollaborators,
  acceptCollab,
  setUserRole,
  getAllCollaborators,
  enrolledCount,
  validatedIdCount,
  validatedIdGraphData, //Bargraph
  countStudentsInSchool,
  getAllStudentsInSchool,
  getAllStudentsInSchoolStatus,
  getStudentLogs,
  studentLogEntrance,
  studentLogExit,
  schoolLogGraphData, //Linegraph
};
