"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.robomissionRoutes = void 0;
const express_1 = require("express");
const robomission_controller_1 = require("./robomission.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.coach), robomission_controller_1.robomissionController.createRobomission);
router.patch('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.sub_admin, user_constants_1.USER_ROLE.super_admin), robomission_controller_1.robomissionController.updateRobomission);
router.delete('/:id', robomission_controller_1.robomissionController.deleteRobomission);
router.get('/:id', robomission_controller_1.robomissionController.getRobomissionById);
router.get('/', robomission_controller_1.robomissionController.getAllRobomission);
exports.robomissionRoutes = router;
