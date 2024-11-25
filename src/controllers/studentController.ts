import { NextFunction, Request, Response } from "express";
// import StudentService from "../services/studentService";
import catchAsync from "../utils/catchAsync";

const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  // const { students, totalCount, totalPages } =
  // await StudentService.getAllStudentsQuery(req);
  // res.status(200).json({
  //   status: "Success",
  //   totalStudents: totalCount,
  //   totalPages,
  //   data: students,
  // });
});

const getStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

const updateStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

const deleteStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export { getAllStudents, getStudent, updateStudent, deleteStudent };
