import express, { Request, Response } from "express";
import { deleteUser, getUser, updateUser } from "../controllers/userController";

const router = express.Router();

router.route("/app/user").get(getUser).patch(updateUser).delete(deleteUser);
router.route("/app/hello").get((req: Request, res: Response) => {
  res.status(200).send("hello");
});

export default router;
