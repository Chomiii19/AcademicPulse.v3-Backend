"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var checkoutController_1 = __importDefault(require("../controllers/checkoutController"));
var appController = __importStar(require("../controllers/appController"));
var rateLimiter = __importStar(require("../utils/rateLimit"));
var uploadConfig_1 = __importDefault(require("../middlewares/uploadConfig"));
var importDeleteController_1 = require("../controllers/importDeleteController");
var studentController = __importStar(require("../controllers/studentController"));
var protetedPage_1 = __importDefault(require("../middlewares/protetedPage"));
var router = express_1.default.Router();
router.route("/protected-page").get(protetedPage_1.default);
router
    .route("/id-validation/submit")
    .post(rateLimiter.validateIdLimiter, appController.validateId);
router.route("/sponsor").get(checkoutController_1.default);
router.route("/upload-record/submit").post(uploadConfig_1.default, importDeleteController_1.importData);
router.route("/delete-record").delete(importDeleteController_1.deleteData);
router
    .route("/register-school/submit")
    .post(uploadConfig_1.default, appController.registerSchool);
router.route("/verify-school/:token").get(appController.verifySchool);
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
router.route("/school-logs-data").get(appController.schoolLogGraphData);
router.route("/validated-ids-data").get(appController.validatedIdGraphData);
exports.default = router;
