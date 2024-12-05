"use strict";
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
var client_1 = require("@prisma/client");
var jszip_1 = __importDefault(require("jszip"));
var qrcode_1 = __importDefault(require("qrcode"));
var appError_1 = __importDefault(require("../errors/appError"));
var verifyToken_1 = __importDefault(require("../utils/verifyToken"));
var signToken_1 = __importDefault(require("../utils/signToken"));
var prisma = new client_1.PrismaClient();
var AppService = /** @class */ (function () {
    function AppService() {
    }
    AppService.prototype.registerSchool = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, schoolId, name, address, email, token;
            return __generator(this, function (_b) {
                _a = req.body, schoolId = _a.schoolId, name = _a.name, address = _a.address, email = _a.email;
                if (!schoolId || !name || !address || !email)
                    throw new appError_1.default("All fields are required to be filled", 400);
                token = (0, signToken_1.default)({ schoolId: schoolId, name: name, address: address, email: email, ownerEmail: req.user.email }, process.env.JWT_SCHOOL_EXPIRES_IN);
                return [2 /*return*/, token];
            });
        });
    };
    AppService.prototype.verifySchool = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var token, decoded, school, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = req.params.token;
                        return [4 /*yield*/, (0, verifyToken_1.default)(token)];
                    case 1:
                        decoded = _a.sent();
                        return [4 /*yield*/, prisma.school.create({
                                data: {
                                    schoolId: decoded.schoolId,
                                    name: decoded.name,
                                    address: decoded.address,
                                    email: decoded.email,
                                    ownerEmail: decoded.ownerEmail,
                                },
                            })];
                    case 2:
                        school = _a.sent();
                        if (!school)
                            throw new appError_1.default("Failed to register school", 400);
                        return [4 /*yield*/, prisma.user.update({
                                where: {
                                    email: decoded.ownerEmail,
                                },
                                data: {
                                    role: 1,
                                    schoolId: decoded.schoolId,
                                },
                            })];
                    case 3:
                        user = _a.sent();
                        if (!user)
                            throw new appError_1.default("Cannot find user", 404);
                        return [2 /*return*/, school];
                }
            });
        });
    };
    AppService.prototype.validateId = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, decoded, student;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        studentId = req.body.studentId;
                        if (!studentId)
                            throw new appError_1.default("QR code value is empty", 400);
                        return [4 /*yield*/, (0, verifyToken_1.default)(studentId)];
                    case 1:
                        decoded = _a.sent();
                        return [4 /*yield*/, prisma.student.findFirst({
                                where: {
                                    schoolId: req.user.schoolId,
                                    id: decoded.id,
                                    studentId: decoded.studentId,
                                },
                            })];
                    case 2:
                        student = _a.sent();
                        if (!student)
                            throw new appError_1.default("Student is not enrolled in this school", 401);
                        return [4 /*yield*/, prisma.student.update({
                                where: { id: student.id, studentId: student.studentId },
                                data: { isValidated: true },
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, student];
                }
            });
        });
    };
    AppService.prototype.addCollaborators = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, role, collaborator;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, email = _a.email, role = _a.role;
                        return [4 /*yield*/, prisma.user.findFirst({ where: email })];
                    case 1:
                        collaborator = _b.sent();
                        if (!collaborator)
                            throw new appError_1.default("User does not exist", 404);
                        if (collaborator.schoolId)
                            throw new appError_1.default("This user is already a member of another school", 400);
                        return [2 /*return*/, { collaborator: collaborator, role: role }];
                }
            });
        });
    };
    AppService.prototype.acceptCollab = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var token, decoded;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = req.params.token;
                        return [4 /*yield*/, (0, verifyToken_1.default)(token)];
                    case 1:
                        decoded = _a.sent();
                        return [4 /*yield*/, prisma.user.update({
                                where: { email: decoded.email },
                                data: { role: decoded.role, schoolId: decoded.schoolId },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AppService.prototype.setUserRole = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, role, collaborator, roleStatus;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, email = _a.email, role = _a.role;
                        return [4 /*yield*/, prisma.user.findFirst({
                                where: { schoolId: req.user.schoolId, email: email },
                            })];
                    case 1:
                        collaborator = _b.sent();
                        if (!collaborator)
                            throw new appError_1.default("User does not exist", 404);
                        return [4 /*yield*/, prisma.user.update({
                                where: { email: collaborator.email },
                                data: { role: role },
                            })];
                    case 2:
                        _b.sent();
                        roleStatus = role === 2 ? "admin" : "user";
                        return [2 /*return*/, { email: collaborator.email, roleStatus: roleStatus }];
                }
            });
        });
    };
    AppService.prototype.getAllColaborators = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var schoolId, collaborators;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schoolId = req.body;
                        return [4 /*yield*/, prisma.user.findMany({
                                where: { schoolId: schoolId },
                                select: { surname: true, firstname: true, role: true },
                                orderBy: [
                                    {
                                        role: "asc",
                                    },
                                ],
                            })];
                    case 1:
                        collaborators = _a.sent();
                        return [2 /*return*/, collaborators];
                }
            });
        });
    };
    AppService.prototype.studentLogEntrance = function (studentId, req) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded, student;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, verifyToken_1.default)(studentId)];
                    case 1:
                        decoded = _a.sent();
                        return [4 /*yield*/, prisma.student.findFirst({
                                where: { id: decoded.id, schoolId: req.user.schoolId },
                            })];
                    case 2:
                        student = _a.sent();
                        if (!student)
                            throw new appError_1.default("Student is not enrolled in this school", 401);
                        if (!student.isValidated)
                            throw new appError_1.default("Student is not yet validated", 401);
                        if (student.inSchool)
                            throw new appError_1.default("Student was not validated at exit", 401);
                        return [4 /*yield*/, prisma.student.update({
                                where: { studentId: studentId },
                                data: { inSchool: true },
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, prisma.schoolLog.create({
                                data: { schoolId: student.schoolId, studentId: studentId, type: "entry" },
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AppService.prototype.studentLogExit = function (studentId, req) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded, student;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, verifyToken_1.default)(studentId)];
                    case 1:
                        decoded = _a.sent();
                        return [4 /*yield*/, prisma.student.findFirst({
                                where: { id: decoded.id, schoolId: req.user.schoolId },
                            })];
                    case 2:
                        student = _a.sent();
                        if (!student)
                            throw new appError_1.default("Student is not enrolled in this school", 401);
                        if (!student.isValidated)
                            throw new appError_1.default("Student is not yet validated", 401);
                        if (!student.inSchool)
                            throw new appError_1.default("Student was not validated at entrance", 401);
                        return [4 /*yield*/, prisma.student.update({
                                where: { studentId: studentId },
                                data: { inSchool: false },
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, prisma.schoolLog.create({
                                data: { schoolId: student.schoolId, studentId: studentId, type: "exit" },
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AppService.prototype.enrolledCount = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var enrolledCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.student.count({
                            where: { schoolId: req.user.schoolId },
                        })];
                    case 1:
                        enrolledCount = _a.sent();
                        return [2 /*return*/, enrolledCount];
                }
            });
        });
    };
    AppService.prototype.validatedIdCount = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var validatedIdCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.student.count({
                            where: { schoolId: req.user.schoolId, isValidated: true },
                        })];
                    case 1:
                        validatedIdCount = _a.sent();
                        return [2 /*return*/, validatedIdCount];
                }
            });
        });
    };
    AppService.prototype.countStudentsInSchool = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var countStudentsInSchool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.student.count({
                            where: { schoolId: req.user.schoolId, inSchool: true },
                        })];
                    case 1:
                        countStudentsInSchool = _a.sent();
                        return [2 /*return*/, countStudentsInSchool];
                }
            });
        });
    };
    AppService.prototype.getAllStudentsInSchool = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var students;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.student.findMany({
                            where: { schoolId: req.user.schoolId, inSchool: true },
                        })];
                    case 1:
                        students = _a.sent();
                        return [2 /*return*/, students];
                }
            });
        });
    };
    AppService.prototype.getAllStudentsInSchoolStatus = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var students;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.student.findMany({
                            where: { schoolId: req.user.schoolId },
                            orderBy: { inSchool: "desc" },
                            select: { surname: true, firstname: true, course: true, inSchool: true },
                        })];
                    case 1:
                        students = _a.sent();
                        return [2 /*return*/, students];
                }
            });
        });
    };
    AppService.prototype.getStudentLogs = function (req) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    AppService.prototype.generateQrCode = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var students, zip, zipBuffer;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.student.findMany({
                            where: { schoolId: req.user.schoolId },
                            orderBy: { id: "asc" },
                            select: { id: true, studentId: true },
                        })];
                    case 1:
                        students = _a.sent();
                        if (!students || students.length === 0)
                            throw new appError_1.default("No students in this school", 404);
                        zip = new jszip_1.default();
                        return [4 /*yield*/, Promise.all(students.map(function (student) { return __awaiter(_this, void 0, void 0, function () {
                                var token, qrCodeImage;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            token = (0, signToken_1.default)({ id: student.id, studentId: student.studentId }, process.env.JWT_ID_EXPIRES_IN);
                                            return [4 /*yield*/, qrcode_1.default.toBuffer(token, { width: 300 })];
                                        case 1:
                                            qrCodeImage = _a.sent();
                                            zip.file("".concat(student.studentId, ".png"), qrCodeImage);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, zip.generateAsync({
                                type: "nodebuffer",
                                compression: "DEFLATE",
                            })];
                    case 3:
                        zipBuffer = _a.sent();
                        return [2 /*return*/, zipBuffer];
                }
            });
        });
    };
    return AppService;
}());
exports.default = new AppService();
