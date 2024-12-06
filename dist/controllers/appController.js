"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQrCode = exports.schoolLogGraphData = exports.studentLogExit = exports.studentLogEntrance = exports.getStudentLogs = exports.getAllStudentsInSchoolStatus = exports.getAllStudentsInSchool = exports.countStudentsInSchool = exports.validatedIdGraphData = exports.validatedIdCount = exports.enrolledCount = exports.getAllCollaborators = exports.setUserRole = exports.acceptCollab = exports.addCollaborators = exports.validateId = exports.verifySchool = exports.registerSchool = void 0;
var client_1 = require("@prisma/client");
var catchAsync_1 = __importDefault(require("../utils/catchAsync"));
var appService_1 = __importDefault(require("../services/appService"));
var sendEmail_1 = __importDefault(require("../utils/sendEmail"));
var signToken_1 = __importDefault(require("../utils/signToken"));
var appError_1 = __importDefault(require("../errors/appError"));
var prisma = new client_1.PrismaClient();
var registerSchool = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, appService_1.default.registerSchool(req)];
            case 1:
                token = _a.sent();
                return [4 /*yield*/, (0, sendEmail_1.default)("New School Registration", req.user, "verifySchool", token, req)];
            case 2:
                _a.sent();
                res.status(201).json({
                    status: "Success",
                });
                return [2 /*return*/];
        }
    });
}); });
exports.registerSchool = registerSchool;
var verifySchool = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var school;
    return __generator(this, function (_a) {
        school = appService_1.default.verifySchool(req);
        res.status(200).json({
            status: "Success",
            message: "School successfully registered.",
        });
        return [2 /*return*/];
    });
}); });
exports.verifySchool = verifySchool;
var validateId = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var student;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, appService_1.default.validateId(req)];
            case 1:
                student = _a.sent();
                res.status(200).json({
                    status: "Success",
                    message: "Student ".concat(student.studentId, " is successfully validated"),
                });
                return [2 /*return*/];
        }
    });
}); });
exports.validateId = validateId;
var addCollaborators = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, collaborator, role, school, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (req.user.role !== 1)
                    return [2 /*return*/, next(new appError_1.default("Only the owner of this school can set permission.", 401))];
                return [4 /*yield*/, appService_1.default.addCollaborators(req)];
            case 1:
                _a = _b.sent(), collaborator = _a.collaborator, role = _a.role;
                return [4 /*yield*/, prisma.school.findFirst({
                        where: { schoolId: req.user.schoolId },
                    })];
            case 2:
                school = _b.sent();
                if (!school)
                    return [2 /*return*/, next(new appError_1.default("You are not an owner of any school", 400))];
                token = (0, signToken_1.default)({
                    email: collaborator.email,
                    role: role,
                    schoolId: school === null || school === void 0 ? void 0 : school.schoolId,
                }, process.env.JWT_COLLAB_EXPIRES_IN);
                return [4 /*yield*/, (0, sendEmail_1.default)("".concat(req.user.name, " has invited you as collaborator at ").concat(school === null || school === void 0 ? void 0 : school.name, "."), collaborator, "addCollab", token)];
            case 3:
                _b.sent();
                res.status(200).json({
                    status: "Success",
                    message: "Successfully sent an email invitation to ".concat(collaborator.firstname),
                });
                return [2 /*return*/];
        }
    });
}); });
exports.addCollaborators = addCollaborators;
var acceptCollab = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, appService_1.default.acceptCollab(req)];
            case 1:
                _a.sent();
                res.redirect("".concat(process.env.APP_ORIGIN));
                return [2 /*return*/];
        }
    });
}); });
exports.acceptCollab = acceptCollab;
var setUserRole = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, roleStatus;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (req.user.role !== 1)
                    return [2 /*return*/, next(new appError_1.default("Only the owner of this school can set permission.", 401))];
                return [4 /*yield*/, appService_1.default.setUserRole(req)];
            case 1:
                _a = _b.sent(), email = _a.email, roleStatus = _a.roleStatus;
                res.status(200).json({
                    status: "Success",
                    message: "Collaborator: ".concat(email, "'s role is now set to ").concat(roleStatus),
                });
                return [2 /*return*/];
        }
    });
}); });
exports.setUserRole = setUserRole;
var getAllCollaborators = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var collaborators;
    return __generator(this, function (_a) {
        collaborators = appService_1.default.getAllColaborators(req);
        res.status(200).json({
            status: "Success",
            data: { collaborators: collaborators },
        });
        return [2 /*return*/];
    });
}); });
exports.getAllCollaborators = getAllCollaborators;
var studentLogEntrance = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, count, io;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                studentId = req.body.studentId;
                if (!studentId)
                    return [2 /*return*/, next(new appError_1.default("QR code value is empty", 400))];
                return [4 /*yield*/, appService_1.default.studentLogEntrance(studentId, req)];
            case 1:
                _a.sent();
                return [4 /*yield*/, appService_1.default.countStudentsInSchool(req)];
            case 2:
                count = _a.sent();
                io = req.io;
                io.emit("student-count-updated", { count: count });
                res.status(200).json({
                    status: "Success",
                    message: "Successfully scanned",
                });
                return [2 /*return*/];
        }
    });
}); });
exports.studentLogEntrance = studentLogEntrance;
var studentLogExit = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, count, io;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                studentId = req.body.studentId;
                if (!studentId)
                    return [2 /*return*/, next(new appError_1.default("QR code value is empty", 400))];
                return [4 /*yield*/, appService_1.default.studentLogExit(studentId, req)];
            case 1:
                _a.sent();
                return [4 /*yield*/, appService_1.default.countStudentsInSchool(req)];
            case 2:
                count = _a.sent();
                io = req.io;
                io.emit("student-count-updated", { count: count });
                res.status(200).json({
                    status: "Success",
                    message: "Successfully scanned",
                });
                return [2 /*return*/];
        }
    });
}); });
exports.studentLogExit = studentLogExit;
var enrolledCount = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var enrolledCount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, appService_1.default.enrolledCount(req)];
            case 1:
                enrolledCount = _a.sent();
                res.status(200).json({
                    status: "Success",
                    data: { enrolledCount: enrolledCount },
                });
                return [2 /*return*/];
        }
    });
}); });
exports.enrolledCount = enrolledCount;
var validatedIdCount = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var count;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, appService_1.default.validatedIdCount(req)];
            case 1:
                count = _a.sent();
                res.status(200).json({
                    status: "Success",
                    data: { count: count },
                });
                return [2 /*return*/];
        }
    });
}); });
exports.validatedIdCount = validatedIdCount;
var countStudentsInSchool = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var count;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, appService_1.default.countStudentsInSchool(req)];
            case 1:
                count = _a.sent();
                res.status(200).json({
                    status: "Success",
                    data: { count: count },
                });
                return [2 /*return*/];
        }
    });
}); });
exports.countStudentsInSchool = countStudentsInSchool;
var getAllStudentsInSchool = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var students;
    return __generator(this, function (_a) {
        students = appService_1.default.getAllStudentsInSchool(req);
        res.status(200).json({
            status: "Success",
            data: { students: students },
        });
        return [2 /*return*/];
    });
}); });
exports.getAllStudentsInSchool = getAllStudentsInSchool;
var getAllStudentsInSchoolStatus = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var students;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, appService_1.default.getAllStudentsInSchoolStatus(req)];
            case 1:
                students = _a.sent();
                res.status(200).json({
                    status: "Success",
                    data: { students: students },
                });
                return [2 /*return*/];
        }
    });
}); });
exports.getAllStudentsInSchoolStatus = getAllStudentsInSchoolStatus;
var getStudentLogs = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, studentId, userTimeZone, startDate, endDate, records;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, studentId = _a.studentId, userTimeZone = _a.userTimeZone, startDate = _a.startDate, endDate = _a.endDate;
                return [4 /*yield*/, prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  SELECT * \n  FROM your_table\n  WHERE \n    schoolId = ", " AND \n    studentId = ", " AND \n    createdAt AT TIME ZONE 'UTC' AT TIME ZONE ", " \n    BETWEEN ", " AND ", ";\n"], ["\n  SELECT * \n  FROM your_table\n  WHERE \n    schoolId = ", " AND \n    studentId = ", " AND \n    createdAt AT TIME ZONE 'UTC' AT TIME ZONE ", " \n    BETWEEN ", " AND ", ";\n"])), req.user.schoolId, studentId, userTimeZone, startDate, endDate)];
            case 1:
                records = _b.sent();
                res.status(200).json({
                    status: "Success",
                    data: { records: records },
                });
                return [2 /*return*/];
        }
    });
}); });
exports.getStudentLogs = getStudentLogs;
var validatedIdGraphData = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
exports.validatedIdGraphData = validatedIdGraphData;
var schoolLogGraphData = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
exports.schoolLogGraphData = schoolLogGraphData;
var generateQrCode = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var zipBuffer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, appService_1.default.generateQrCode(req)];
            case 1:
                zipBuffer = _a.sent();
                res.setHeader("Content-Disposition", 'attachment; filename="student_qrcodes.zip"');
                res.setHeader("Content-Type", "application/zip");
                res.status(200).send(zipBuffer);
                return [2 /*return*/];
        }
    });
}); });
exports.generateQrCode = generateQrCode;
var templateObject_1;
