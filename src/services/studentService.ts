import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import AppError from "../errors/appError";

const prisma = new PrismaClient();

class StudentService {
  async getAllStudents(req: Request) {
    const page = Number(req.query.page);

    const students = await prisma.student.findMany({
      where: { schoolId: req.user.schoolId },
      skip: (page - 1) * 10,
      take: 10,
      select: {
        id: false,
        schoolId: false,
        isValidated: false,
        inSchool: false,
        createdAt: false,
        updatedAt: false,
      },
    });

    if (!students) throw new AppError("No students found", 404);

    const totalStudents = await prisma.student.count({
      where: { schoolId: req.user.schoolId },
    });

    const totalPages = Math.ceil(totalStudents / 10);

    return { students, totalStudents, totalPages };
  }
}

export default new StudentService();
