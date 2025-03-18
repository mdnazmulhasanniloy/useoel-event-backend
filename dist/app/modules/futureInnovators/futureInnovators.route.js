"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.futureInnovatorsRoutes = void 0;
const express_1 = require("express");
const futureInnovators_controller_1 = require("./futureInnovators.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.coach), futureInnovators_controller_1.futureInnovatorsController.createFutureInnovators);
router.patch('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.sub_admin, user_constants_1.USER_ROLE.super_admin), futureInnovators_controller_1.futureInnovatorsController.updateFutureInnovators);
router.delete('/:id', futureInnovators_controller_1.futureInnovatorsController.deleteFutureInnovators);
router.get('/:id', futureInnovators_controller_1.futureInnovatorsController.getFutureInnovatorsById);
router.get('/', futureInnovators_controller_1.futureInnovatorsController.getAllFutureInnovators);
exports.futureInnovatorsRoutes = router;
