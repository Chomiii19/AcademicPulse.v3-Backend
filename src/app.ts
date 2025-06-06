import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import AppError from "./errors/appError";
import globalErrorHandler from "./controllers/globalErrorHandler";
import authRoute from "./routes/authRoutes";
import userRoute from "./routes/userRoutes";
import appRoute from "./routes/appRoutes";
import protect from "./middlewares/protect";
import io from "./server";
import { verifySchool } from "./controllers/appController";

const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: [`${process.env.APP_ORIGIN}`, "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", (req: Request, res, next) => {
  req.io = io;
  next();
});
app.use("/api/v1", authRoute);
app.get("/api/v1/refresh", (req, res) => {
  console.log("hello:", req.cookies);
  res.send(req.cookies);
});
app.use("/api/v1/user", protect, userRoute);
app.use("/api/v1/app", protect, appRoute);
app.use("/api/v1/app", protect, appRoute);
app.get("/api/v1/verify-school/:token", verifySchool);
app.all("*", (req: Request, res: Response, next: NextFunction) =>
  next(new AppError(`Can't find ${req.originalUrl} from the server`, 404))
);

app.use(globalErrorHandler);

export default app;
