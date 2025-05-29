import express from "express";
import checkoutSession from "../controllers/checkoutController";
import * as appController from "../controllers/appController";
import * as rateLimiter from "../utils/rateLimit";
import uploadConfig from "../middlewares/uploadConfig";
import { importData, deleteData } from "../controllers/importDeleteController";
import * as studentController from "../controllers/studentController";
import protectedPage from "../middlewares/protetedPage";
import uploadPhoto from "../middlewares/uploadPhoto";

const router = express.Router();

router.route("/protected-page").get(protectedPage);
router.route("/pictures").get(appController.getProfilePicture);

router
  .route("/upload-photo/submit")
  .post(uploadPhoto, appController.uploadProfilePicture);
router
  .route("/id-validation/submit")
  .post(rateLimiter.validateIdLimiter, appController.validateId);

router.route("/sponsor").get(checkoutSession);
router.route("/upload-record/submit").post(uploadConfig, importData);
router.route("/delete-record").delete(deleteData);

router
  .route("/register-school/submit")
  .post(uploadConfig, appController.registerSchool);
router.route("/add-colaborators").post(appController.addCollaborators);
router.route("/accept-collab/:token").get(appController.acceptCollab);
router.route("/get-collaborators").get(appController.getAllCollaborators);
router.route("/set-role").post(appController.setUserRole);

router.route("/enrolled-students").get(appController.enrolledCount);
router.route("/validated-id-count").get(appController.validatedIdCount);

router
  .route("/students-inschool-count")
  .get(appController.countStudentsInSchool);
router.route("/students-inschool").get(appController.countStudentsInSchool);
router
  .route("/students-inschool-status")
  .get(appController.getAllStudentsInSchoolStatus);
router.route("/student-logs").post(appController.getStudentLogs);

router
  .route("/student-log/entrance/submit")
  .post(appController.studentLogEntrance);
router.route("/student-log/exit/submit").post(appController.studentLogExit);

router.route("/get-students").get(studentController.getAllStudents);
router.route("/generate-qrcode").get(appController.generateQrCode);
router.route("/get-student").get(studentController.getStudent);
router.route("/update-tudents").get(studentController.updateStudent);
router.route("/delete-tudents").get(studentController.deleteStudent);

//Graphs
router.route("/school-logs/yearly").get(appController.schoolLogGraphDataYearly);
router
  .route("/school-logs/monthly")
  .get(appController.schoolLogGraphDataMonthly);
router.route("/school-logs/daily").get(appController.schoolLogGraphDataDaily);
router.route("/school-logs/weekly").get(appController.schoolLogGraphDataWeekly);
router.route("/validated-ids-data").get(appController.validatedIdGraphData);
router.route("/student/logs").get(appController.getStudentLogsGroupedByDate);

export default router;
