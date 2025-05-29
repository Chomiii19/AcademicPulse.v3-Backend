import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { PrismaClient, Type } from "@prisma/client";
import catchAsync from "../utils/catchAsync";
import AppService from "../services/appService";
import sendMail from "../utils/sendEmail";
import signToken from "../utils/signToken";
import AppError from "../errors/appError";

const prisma = new PrismaClient();

const uploadProfilePicture = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await AppService.uploadProfilePic(req);

    res.status(200).json({
      status: "Success",
      message: "Profile picture successfully set.",
    });
  }
);

const getProfilePicture = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const url = await AppService.getProfilePicture(req);

    const filePath = path.resolve(process.cwd(), url);

    console.log(filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.sendFile(filePath);
  }
);

const registerSchool = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = await AppService.registerSchool(req);

    await sendMail(
      "New School Registration",
      req.user,
      "verifySchool",
      token,
      req
    );

    res.status(201).json({
      status: "Success",
    });
  }
);

const verifySchool = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const school = AppService.verifySchool(req);

    res.status(200).json({
      status: "Success",
      message: "School successfully registered.",
      school,
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

    const token = signToken(
      {
        email: collaborator.email,
        role,
        schoolId: school?.schoolId,
      },
      process.env.JWT_COLLAB_EXPIRES_IN as string
    );

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

    res.redirect(`${process.env.APP_ORIGIN}`);
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
    const studentId = req.body.studentId;

    if (!studentId) return next(new AppError("QR code value is empty", 400));

    await AppService.studentLogEntrance(studentId, req);

    const count = await AppService.countStudentsInSchool(req);

    const io = req.io;
    io.emit("student-count-updated", { count });

    res.status(200).json({
      status: "Success",
      message: `Successfully scanned`,
    });
  }
);

const studentLogExit = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const studentId = req.body.studentId;

    if (!studentId) return next(new AppError("QR code value is empty", 400));

    await AppService.studentLogExit(studentId, req);

    const count = await AppService.countStudentsInSchool(req);

    const io = req.io;
    io.emit("student-count-updated", { count });

    res.status(200).json({
      status: "Success",
      message: `Successfully scanned`,
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
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedPerMonth = await prisma.student.groupBy({
      by: ["validatedAt"],
      where: {
        schoolId: req.user.schoolId,
        isValidated: true,
      },
      _count: {
        _all: true,
      },
      orderBy: {
        validatedAt: "asc",
      },
    });

    const monthlyCounts = validatedPerMonth.reduce<Record<string, number>>(
      (acc, record) => {
        const month = record.validatedAt
          ? new Date(record.validatedAt).toISOString().slice(0, 7)
          : "Unknown";

        acc[month] = (acc[month] || 0) + record._count._all;
        return acc;
      },
      {}
    );

    res.status(200).json({
      status: "Success",
      data: monthlyCounts,
    });
  }
);

interface LogData {
  entryTimes: number[];
  exitTimes: number[];
}

type LogTimes = { [key: string]: number }; // This defines the type of the accumulator

const getLogData = async (timeRange: { gte: Date }, schoolId: string) => {
  console.log(timeRange);
  const logs = await prisma.schoolLog.findMany({
    where: {
      schoolId,
      timestamp: timeRange,
    },
    select: {
      timestamp: true,
      type: true,
    },
  });
  console.log(logs);

  const data = logs.reduce<{ [key: string]: LogData }>((acc, log) => {
    const day = new Date(log.timestamp).toISOString().slice(0, 10); // YYYY-MM-DD
    const hour = new Date(log.timestamp).getHours();
    const minute = new Date(log.timestamp).getMinutes();
    const type = log.type === "entry" ? "entry" : "exit";

    if (!acc[day]) {
      acc[day] = { entryTimes: [], exitTimes: [] };
    }

    if (type === "entry") {
      acc[day].entryTimes.push(hour * 60 + minute);
    } else {
      acc[day].exitTimes.push(hour * 60 + minute);
    }

    return acc;
  }, {});

  return data;
};

const schoolLogGraphDataWeekly = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const data = await getLogData({ gte: sevenDaysAgo }, req.user.schoolId);

    const averages = Object.keys(data).map((day) => {
      const entryAvg =
        data[day].entryTimes.reduce((sum, time) => sum + time, 0) /
        data[day].entryTimes.length;
      const exitAvg =
        data[day].exitTimes.reduce((sum, time) => sum + time, 0) /
        data[day].exitTimes.length;

      return {
        day,
        entryAvg: {
          hour: Math.floor(entryAvg / 60),
          minute: entryAvg % 60,
        },
        exitAvg: {
          hour: Math.floor(exitAvg / 60),
          minute: exitAvg % 60,
        },
      };
    });

    const entryTimes: LogTimes = averages.reduce((acc, { day, entryAvg }) => {
      acc[day] = entryAvg.hour;
      return acc;
    }, {} as LogTimes);

    const exitTimes: LogTimes = averages.reduce((acc, { day, exitAvg }) => {
      acc[day] = exitAvg.hour;
      return acc;
    }, {} as LogTimes);

    res.status(200).json({
      entryTimes,
      exitTimes,
    });
  }
);

// Monthly endpoint
const schoolLogGraphDataMonthly = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const data = await getLogData({ gte: firstDayOfMonth }, req.user.schoolId);

    const averages = Object.keys(data).map((day) => {
      const entryAvg =
        data[day].entryTimes.reduce((sum, time) => sum + time, 0) /
        data[day].entryTimes.length;
      const exitAvg =
        data[day].exitTimes.reduce((sum, time) => sum + time, 0) /
        data[day].exitTimes.length;

      return {
        day,
        entryAvg: {
          hour: Math.floor(entryAvg / 60),
          minute: entryAvg % 60,
        },
        exitAvg: {
          hour: Math.floor(exitAvg / 60),
          minute: exitAvg % 60,
        },
      };
    });

    const entryTimes: LogTimes = averages.reduce((acc, { day, entryAvg }) => {
      const month = day.slice(5, 7); // Get the month portion (MM)
      acc[month] = entryAvg.hour;
      return acc;
    }, {} as LogTimes);

    const exitTimes: LogTimes = averages.reduce((acc, { day, exitAvg }) => {
      const month = day.slice(5, 7); // Get the month portion (MM)
      acc[month] = exitAvg.hour;
      return acc;
    }, {} as LogTimes);

    res.status(200).json({
      entryTimes,
      exitTimes,
    });
  }
);

// Yearly endpoint
const schoolLogGraphDataYearly = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const data = await getLogData({ gte: startOfYear }, req.user.schoolId);

    const averages = Object.keys(data).map((day) => {
      const entryAvg =
        data[day].entryTimes.reduce((sum, time) => sum + time, 0) /
        data[day].entryTimes.length;
      const exitAvg =
        data[day].exitTimes.reduce((sum, time) => sum + time, 0) /
        data[day].exitTimes.length;

      return {
        day,
        entryAvg: {
          hour: Math.floor(entryAvg / 60),
          minute: entryAvg % 60,
        },
        exitAvg: {
          hour: Math.floor(exitAvg / 60),
          minute: exitAvg % 60,
        },
      };
    });

    const entryTimes: LogTimes = averages.reduce((acc, { day, entryAvg }) => {
      const year = day.slice(0, 4); // Get the year portion (YYYY)
      acc[year] = entryAvg.hour;
      return acc;
    }, {} as LogTimes);

    const exitTimes: LogTimes = averages.reduce((acc, { day, exitAvg }) => {
      const year = day.slice(0, 4); // Get the year portion (YYYY)
      acc[year] = exitAvg.hour;
      return acc;
    }, {} as LogTimes);

    res.status(200).json({
      entryTimes,
      exitTimes,
    });
  }
);

const getLogDaily = async (
  timeRange: { gte: Date; lte: Date },
  schoolId: string
) => {
  console.log(timeRange);

  const logs = await prisma.schoolLog.findMany({
    where: {
      schoolId, // School ID filter
      timestamp: {
        gte: timeRange.gte, // Start date
        lte: timeRange.lte, // End date
      },
    },
    select: {
      timestamp: true, // Timestamp field
      type: true, // Type field (entry or exit)
    },
  });

  console.log(logs);

  // Process logs into the desired structure
  const data = logs.reduce<{ [key: string]: LogData }>((acc, log) => {
    const day = new Date(log.timestamp).toISOString().slice(0, 10); // Format date as YYYY-MM-DD
    const hour = new Date(log.timestamp).getHours(); // Extract hour
    const minute = new Date(log.timestamp).getMinutes(); // Extract minute
    const type = log.type === "entry" ? "entry" : "exit"; // Determine entry or exit

    // Initialize day data if not yet added
    if (!acc[day]) {
      acc[day] = { entryTimes: [], exitTimes: [] };
    }

    // Push entry or exit time to respective arrays
    if (type === "entry") {
      acc[day].entryTimes.push(hour * 60 + minute); // Store time in minutes
    } else {
      acc[day].exitTimes.push(hour * 60 + minute); // Store time in minutes
    }

    return acc;
  }, {});

  return data;
};

// Daily endpoint
const schoolLogGraphDataDaily = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get the current date
    const today = new Date();

    // Get the first day of the current month (set to 00:00:00)
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get the last day of the current month (set to 23:59:59)
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    // Fetch data for the current month, starting from the first day of the month
    const data = await getLogDaily(
      { gte: firstDayOfMonth, lte: lastDayOfMonth },
      req.user.schoolId
    );

    // Calculate averages for each day
    const averages = Object.keys(data).map((day) => {
      const entryAvg =
        data[day].entryTimes.reduce((sum, time) => sum + time, 0) /
        data[day].entryTimes.length;
      const exitAvg =
        data[day].exitTimes.reduce((sum, time) => sum + time, 0) /
        data[day].exitTimes.length;

      return {
        day,
        entryAvg: {
          hour: Math.floor(entryAvg / 60),
          minute: entryAvg % 60,
        },
        exitAvg: {
          hour: Math.floor(exitAvg / 60),
          minute: exitAvg % 60,
        },
      };
    });

    // Prepare the entry and exit times for the response
    const entryTimes = averages.reduce((acc, { day, entryAvg }) => {
      acc[day] = entryAvg.hour;
      return acc;
    }, {} as { [key: string]: number });

    const exitTimes = averages.reduce((acc, { day, exitAvg }) => {
      acc[day] = exitAvg.hour;
      return acc;
    }, {} as { [key: string]: number });

    // Send the response with the calculated entry and exit times
    res.status(200).json({
      entryTimes,
      exitTimes,
    });
  }
);

const generateQrCode = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const zipBuffer = await AppService.generateQrCode(req);

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="student_qrcodes.zip"'
    );
    res.setHeader("Content-Type", "application/zip");
    res.status(200).send(zipBuffer);
  }
);

const getStudentLogsGroupedByDate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentId } = req.params;

    try {
      // Fetch logs for the given student, ordered by timestamp ascending
      const logs = await prisma.schoolLog.findMany({
        where: { id: Number(studentId) },
        orderBy: { timestamp: "asc" },
        select: {
          timestamp: true,
          type: true,
        },
      });

      if (!logs.length) {
        return res
          .status(404)
          .json({ message: "No logs found for this student" });
      }

      // Group logs by date string (YYYY-MM-DD)
      const groupedLogs: Record<
        string,
        { entryTimes: string[]; exitTimes: string[] }
      > = {};

      logs.forEach(({ timestamp, type }) => {
        const date = timestamp.toISOString().split("T")[0]; // extract date part only
        const time = timestamp.toISOString().split("T")[1].slice(0, 8); // get HH:mm:ss

        if (!groupedLogs[date]) {
          groupedLogs[date] = { entryTimes: [], exitTimes: [] };
        }

        if (type === Type.entry) {
          groupedLogs[date].entryTimes.push(time);
        } else if (type === Type.exit) {
          groupedLogs[date].exitTimes.push(time);
        }
      });

      return res.json(groupedLogs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export {
  uploadProfilePicture,
  getProfilePicture,
  registerSchool,
  verifySchool,
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
  schoolLogGraphDataYearly, //Linegraph
  schoolLogGraphDataMonthly, //Linegraph
  schoolLogGraphDataDaily, //Linegraph
  schoolLogGraphDataWeekly, //Linegraph
  generateQrCode,
  getStudentLogsGroupedByDate,
};
