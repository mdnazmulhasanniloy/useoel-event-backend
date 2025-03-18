"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.futureEngineersRoutes = void 0;
const express_1 = require("express");
const futureEngineers_controller_1 = require("./futureEngineers.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.coach), futureEngineers_controller_1.futureEngineersController.createFutureEngineers);
router.patch('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.sub_admin, user_constants_1.USER_ROLE.super_admin), futureEngineers_controller_1.futureEngineersController.updateFutureEngineers);
router.delete('/:id', futureEngineers_controller_1.futureEngineersController.deleteFutureEngineers);
router.get('/:id', futureEngineers_controller_1.futureEngineersController.getFutureEngineersById);
router.get('/', futureEngineers_controller_1.futureEngineersController.getAllFutureEngineers);
exports.futureEngineersRoutes = router;
