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
exports.signout = exports.verifyUserAccount = exports.login = exports.signup = void 0;
var catchAsync_1 = __importDefault(require("../utils/catchAsync"));
var appError_1 = __importDefault(require("../errors/appError"));
var authService_1 = __importDefault(require("../services/authService"));
var sendEmail_1 = __importDefault(require("../utils/sendEmail"));
var signToken_1 = __importDefault(require("../utils/signToken"));
var signup = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.email)
                    return [2 /*return*/, next(new appError_1.default("Invalid empty fields", 400))];
                return [4 /*yield*/, authService_1.default.findUserByEmail(req.body.email)];
            case 1:
                _a.sent();
                return [4 /*yield*/, authService_1.default.createUser(req)];
            case 2:
                user = _a.sent();
                token = (0, signToken_1.default)({ email: user.email, id: user.id }, process.env.JWT_VERIFY_ACC_EXPIRES_IN);
                (0, sendEmail_1.default)("User Verification (AcadPulse)", user, "verifyAccount", token);
                authService_1.default.createSendToken(user, 201, res);
                return [2 /*return*/];
        }
    });
}); });
exports.signup = signup;
var login = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password)
                    return [2 /*return*/, next(new appError_1.default("Email and password fields can not be blank", 400))];
                return [4 /*yield*/, authService_1.default.findUserByEmailPassword(email, password)];
            case 1:
                user = (_b.sent());
                if (!user.isVerified)
                    return [2 /*return*/, next(new appError_1.default("Account not verified", 401))];
                authService_1.default.createSendToken(user, 200, res);
                return [2 /*return*/];
        }
    });
}); });
exports.login = login;
var verifyUserAccount = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, authService_1.default.verifyUser(String(req.params.token))];
            case 1:
                _a.sent();
                res.redirect("".concat(process.env.APP_ORIGIN, "/register-school"));
                return [2 /*return*/];
        }
    });
}); });
exports.verifyUserAccount = verifyUserAccount;
var signout = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.cookie("authToken", "", {
            expires: new Date(Date.now() + 5 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });
        res.status(200).json({ status: "Success" });
        return [2 /*return*/];
    });
}); });
exports.signout = signout;
