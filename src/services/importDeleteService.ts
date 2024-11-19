import { Request, NextFunction } from "express";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import AppError from "../errors/appError";

const prisma = new PrismaClient();

class importDeleteService {
  async importAllData(req: Request, next: NextFunction) {
    if (!req.file) return next(new AppError("No file uploaded.", 400));

    const filepath = req.file.path;
    const studentsData = JSON.parse(fs.readFileSync(filepath, "utf-8"));

    await prisma.student.createMany(studentsData);

    fs.unlink(filepath, (err) => {
      if (err)
        return next(
          new AppError("File uploaded but failed to delete file", 500)
        );
    });
  }

  async deleteAllData() {
    await prisma.student.deleteMany();
  }
}

export default new importDeleteService();
