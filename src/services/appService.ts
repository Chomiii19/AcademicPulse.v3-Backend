import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import JSZip from "jszip";
import QRCode from "qrcode";
import AppError from "../errors/appError";
import verifyToken from "../utils/verifyToken";
import IStudent from "../@types/studentInterface";
import IUser from "../@types/userInterface";
import ISchool from "../@types/schoolInterface";
import signToken from "../utils/signToken";

const prisma = new PrismaClient();

class AppService {
  async registerSchool(req: Request) {
    const { schoolId, name, address, email } = req.body;

    if (!schoolId || !name || !address || !email)
      throw new AppError("All fields are required to be filled", 400);

    const token = signToken(
      { schoolId, name, address, email, ownerEmail: req.user.email },
      process.env.JWT_SCHOOL_EXPIRES_IN as string
    );

    return token;
  }

  async verifySchool(req: Request): Promise<ISchool> {
    const token = req.params.token;

    const decoded = await verifyToken(token);

    const school = await prisma.school.create({
      data: {
        schoolId: decoded.schoolId,
        name: decoded.name,
        address: decoded.address,
        email: decoded.email,
        ownerEmail: decoded.ownerEmail,
      },
    });

    if (!school) throw new AppError("Failed to register school", 400);

    const user = await prisma.user.update({
      where: {
        email: decoded.ownerEmail,
      },
      data: {
        role: 1,
        schoolId: decoded.schoolId,
      },
    });

    if (!user) throw new AppError("Cannot find user", 404);

    return school;
  }

  async validateId(req: Request): Promise<IStudent> {
    const { studentId } = req.body;

    if (!studentId) throw new AppError("QR code value is empty", 400);

    const decoded = verifyToken(studentId);

    const student = await prisma.student.findFirst({
      where: {
        schoolId: req.user.schoolId,
        id: decoded.id,
        studentId: decoded.studentId,
      },
    });

    if (!student)
      throw new AppError("Student is not enrolled in this school", 401);

    await prisma.student.update({
      where: { id: student.id, studentId: student.studentId },
      data: { isValidated: true },
    });

    return student;
  }

  async addCollaborators(
    req: Request
  ): Promise<{ collaborator: IUser; role: IUser["role"] }> {
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

  async acceptCollab(req: Request): Promise<void> {
    const token = req.params.token;
    const decoded = await verifyToken(token);

    await prisma.user.update({
      where: { email: decoded.email },
      data: { role: decoded.role, schoolId: decoded.schoolId },
    });
  }

  async setUserRole(
    req: Request
  ): Promise<{ email: string; roleStatus: string }> {
    const { email, role } = req.body;

    const collaborator = await prisma.user.findFirst({
      where: { schoolId: req.user.schoolId, email },
    });

    if (!collaborator) throw new AppError("User does not exist", 404);

    await prisma.user.update({
      where: { email: collaborator.email },
      data: { role },
    });

    const roleStatus = role === 2 ? "admin" : "user";

    return { email: collaborator.email, roleStatus };
  }

  async getAllColaborators(req: Request): Promise<
    {
      role: number;
      surname: string;
      firstname: string;
    }[]
  > {
    const schoolId = req.body;

    const collaborators = await prisma.user.findMany({
      where: { schoolId },
      select: { surname: true, firstname: true, role: true },
      orderBy: [
        {
          role: "asc",
        },
      ],
    });

    return collaborators;
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

  async getAllStudentsInSchool(req: Request): Promise<IStudent[]> {
    const students = await prisma.student.findMany({
      where: { schoolId: req.user.schoolId, inSchool: true },
    });

    return students;
  }

  async getAllStudentsInSchoolStatus(req: Request): Promise<
    {
      surname: string;
      firstname: string;
      course: string;
      inSchool: boolean;
    }[]
  > {
    const students = await prisma.student.findMany({
      where: { schoolId: req.user.schoolId },
      orderBy: { inSchool: "desc" },
      select: { surname: true, firstname: true, course: true, inSchool: true },
    });

    return students;
  }

  async getStudentLogs(req: Request) {}

  async generateQrCode(req: Request): Promise<Buffer> {
    const students = await prisma.student.findMany({
      where: { schoolId: req.user.schoolId },
      orderBy: { id: "asc" },
      select: { id: true, studentId: true },
    });

    if (!students || students.length === 0)
      throw new AppError("No students in this school", 404);

    const zip = new JSZip();

    await Promise.all(
      students.map(async (student: { id: number; studentId: string }) => {
        const token = signToken(
          { id: student.id, studentId: student.studentId },
          process.env.JWT_ID_EXPIRES_IN as string
        );

        const qrCodeImage = await QRCode.toBuffer(token);
        zip.file(`${student.studentId}.png`, qrCodeImage);
      })
    );

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    return zipBuffer;
  }
}

export default new AppService();
