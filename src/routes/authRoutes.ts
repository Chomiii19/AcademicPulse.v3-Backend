import express from "express";
import {
  login,
  signup,
  verifyUserAccount,
  signout,
} from "../controllers/userAuthentication";

const router = express.Router();

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/verify/:token").get(verifyUserAccount);
router.route("/signout").post(signout);

export default router;
