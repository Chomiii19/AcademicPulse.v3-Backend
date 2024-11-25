"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userController_1 = require("../controllers/userController");
var router = express_1.default.Router();
router.route("/app/user").get(userController_1.getUser).patch(userController_1.updateUser).delete(userController_1.deleteUser);
router.route("/app/hello").get(function (req, res) {
    res.status(200).send("hello");
});
exports.default = router;
