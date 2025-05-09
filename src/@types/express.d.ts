import IUser from "./userInterfaces";
import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      file?: Multer.File;
      io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    }
  }
}
