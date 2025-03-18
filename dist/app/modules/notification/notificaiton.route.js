"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const notification_controller_1 = require("./notification.controller");
const user_constants_1 = require("../user/user.constants");
const router = (0, express_1.Router)();
// router.post("/",)
router.get('/', (0, auth_1.default)(user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.sub_admin, user_constants_1.USER_ROLE.super_admin, user_constants_1.USER_ROLE.coach, user_constants_1.USER_ROLE === null || user_constants_1.USER_ROLE === void 0 ? void 0 : user_constants_1.USER_ROLE.player, user_constants_1.USER_ROLE.user, user_constants_1.USER_ROLE.team), notification_controller_1.notificationControllers.getAllNotifications);
router.patch('/', (0, auth_1.default)(user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.sub_admin, user_constants_1.USER_ROLE.super_admin, user_constants_1.USER_ROLE.coach, user_constants_1.USER_ROLE === null || user_constants_1.USER_ROLE === void 0 ? void 0 : user_constants_1.USER_ROLE.player, user_constants_1.USER_ROLE.user, user_constants_1.USER_ROLE.team), notification_controller_1.notificationControllers.markAsDone);
router.delete('/', (0, auth_1.default)(user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.sub_admin, user_constants_1.USER_ROLE.super_admin, user_constants_1.USER_ROLE.coach, user_constants_1.USER_ROLE === null || user_constants_1.USER_ROLE === void 0 ? void 0 : user_constants_1.USER_ROLE.player, user_constants_1.USER_ROLE.user, user_constants_1.USER_ROLE.team), notification_controller_1.notificationControllers.deleteAllNotifications);
exports.notificationRoutes = router;
