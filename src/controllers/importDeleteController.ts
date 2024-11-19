import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import importDeleteService from "../services/importDeleteService";

const importData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    importDeleteService.importAllData(req, next);

    res.status(201).json({
      status: "Success",
      message: "Student record successfully created.",
    });
  }
);

const deleteData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await importDeleteService.deleteAllData();

    res.status(200).json({
      status: "Success",
      message: "Student record successfully deleted.",
    });
  }
);

export { importData, deleteData };
