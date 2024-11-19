import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import AppError from "../errors/appError";
import verifyToken from "../utils/verifyToken";

const prisma = new PrismaClient();

class AppService {
  async createSchool(req: Request) {
    const { schoolId, name, address, email } = req.body;

    const school = await prisma.school.create({
      data: { schoolId, name, address, email, ownerEmail: req.user.email },
    });

    await prisma.user.update({
      where: {
        email: req.user.email,
      },
      data: {
        role: "owner",
        schoolId: school.schoolId,
      },
    });

    return school;
  }

  async validateId(req: Request) {
    const { studentId } = req.body;

    if (!studentId) throw new AppError("QR code value is empty", 400);

    const decoded = verifyToken(studentId);

    const student = await prisma.student.findFirst({
      where: { studentId: decoded.studentId, schoolId: req.user.schoolId },
    });

    if (!student)
      throw new AppError("Student is not enrolled in this school", 401);

    await prisma.student.update({
      where: { studentId: student.studentId },
      data: { isValidated: true },
    });

    return student;
  }

  async addCollaborators(req: Request) {
    const { email, role } = req.body;

    const collaborator = await prisma.user.findFirst({ where: email });

    if (!collaborator) throw new AppError("User does not exist", 404);

    if (collaborator.schoolId)
      throw new AppError(
        "This user is already a member of another school",
        400
      );

    return { collaborator, role };
  }

  async acceptCollab(req: Request) {
    const token = req.params.token;
    const decoded = await verifyToken(token);

    await prisma.user.update({
      where: { email: decoded.email },
      data: { role: decoded.role, schoolId: decoded.schoolId },
    });
  }

  async studentLogEntrance(studentId: string, req: Request): Promise<void> {
    const decoded = verifyToken(studentId);

    const student = await prisma.student.findFirst({
      where: { id: decoded.id, schoolId: req.user.schoolId },
    });

    if (!student)
      throw new AppError("Student is not enrolled in this school", 401);

    if (!student.isValidated)
      throw new AppError("Student is not yet validated", 401);

    if (student.inSchool)
      throw new AppError("Student was not validated at exit", 401);

    await prisma.student.update({
      where: { studentId },
      data: { inSchool: true },
    });

    await prisma.schoolLog.create({
      data: { schoolId: student.schoolId, studentId, type: "entry" },
    });
  }

  async studentLogExit(studentId: string, req: Request): Promise<void> {
    const decoded = verifyToken(studentId);

    const student = await prisma.student.findFirst({
      where: { id: decoded.id, schoolId: req.user.schoolId },
    });

    if (!student)
      throw new AppError("Student is not enrolled in this school", 401);

    if (!student.isValidated)
      throw new AppError("Student is not yet validated", 401);

    if (!student.inSchool)
      throw new AppError("Student was not validated at entrance", 401);

    await prisma.student.update({
      where: { studentId },
      data: { inSchool: false },
    });

    await prisma.schoolLog.create({
      data: { schoolId: student.schoolId, studentId, type: "exit" },
    });
  }

  async enrolledCount(req: Request): Promise<number> {
    const enrolledCount = await prisma.student.count({
      where: { schoolId: req.user.schoolId },
    });

    return enrolledCount;
  }

  async validatedIdCount(req: Request): Promise<number> {
    const validatedIdCount = await prisma.student.count({
      where: { schoolId: req.user.schoolId, isValidated: true },
    });

    return validatedIdCount;
  }

  async countStudentsInSchool(req: Request): Promise<number> {
    const countStudentsInSchool = await prisma.student.count({
      where: { schoolId: req.user.schoolId, inSchool: true },
    });

    return countStudentsInSchool;
  }

  async getAllStudentsInSchool(req: Request): Promise<any> {
    const students = await prisma.student.findMany({
      where: { schoolId: req.user.schoolId, inSchool: true },
    });

    return students;
  }
}

export default new AppService();
