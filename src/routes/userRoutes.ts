import express from "express";
import { deleteUser, getUser, updateUser } from "../controllers/userController";

const router = express.Router();

router.route("/app/user").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
