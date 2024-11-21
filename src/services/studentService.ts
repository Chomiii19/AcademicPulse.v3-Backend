import { Request } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class StudentService {
  async getAllStudentsQuery(req: Request) {
    const queryObj = { ...req.query };

    if (queryObj.page) delete queryObj.page;

    let studentsQuery = prisma.student.findMany({ where: { queryObj } });

    if (req.query.page) {
      const page = Number(req.query.page) * 1;
      const skip = (page - 1) * 10;

      studentsQuery = studentsQuery.skip(skip).limit(10);
    }

    const students = await studentsQuery;

    const totalCount = await Student.countDocuments(queryObj);
    const totalPages = Math.ceil(totalCount / 10);

    return { students, totalCount, totalPages };
  }
}

export default new StudentService();
