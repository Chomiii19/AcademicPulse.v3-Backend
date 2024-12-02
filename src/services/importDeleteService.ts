import { Request, NextFunction } from "express";
import fs from "fs";
import xlsx from "xlsx";
import { PrismaClient } from "@prisma/client";
import AppError from "../errors/appError";
import IStudent from "../@types/studentInterface";

const prisma = new PrismaClient();

class importDeleteService {
  excelToJson(filepath: string, req: Request): IStudent[] {
    const workbook = xlsx.readFile(filepath);

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rawData = xlsx.utils.sheet_to_json<IStudent>(worksheet);

    return rawData.map((data: any, i: number) => {
      const studentId = `${req.user.schoolId}-${new Date()
        .getFullYear()
        .toString()
        .slice(-2)}-${i + 1}`;

      return {
        studentId,
        schoolId: req.user.schoolId,
        surname: data["surname"],
        firstname: data["firstname"],
        middlename: data["middlename"] || null,
        extension: data["extension"] || null,
        course: data["course"],
        yearLevel: data["yearLevel"],
        email: data["email"] || null,
      };
    });
  }

  async importAllData(req: Request, next: NextFunction) {
    if (!req.file) return next(new AppError("No file uploaded.", 400));

    const filepath = req.file.path;
    const studentsData = this.excelToJson(filepath, req);

    if (!studentsData) throw new AppError("Invalid file entry", 400);

    await prisma.student.createMany({ data: studentsData });

    fs.unlink(filepath, (err) => {
      if (err)
        throw new AppError("File uploaded but failed to delete file", 500);
    });
  }

  async deleteAllData() {
    await prisma.student.deleteMany();
  }
}

export default new importDeleteService();
