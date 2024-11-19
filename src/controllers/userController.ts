import { PrismaClient } from "@prisma/client";
import catchAsync from "../utils/catchAsync";

const prisma = new PrismaClient();

const getUser = catchAsync(async (req, res, next) => {});

const updateUser = catchAsync(async (req, res, next) => {});

const deleteUser = catchAsync(async (req, res, next) => {});

export { getUser, updateUser, deleteUser };
