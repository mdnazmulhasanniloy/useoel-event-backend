"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRegisterRoutes = void 0;
const express_1 = require("express");
const eventRegister_controller_1 = require("./eventRegister.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.coach, user_constants_1.USER_ROLE.player), eventRegister_controller_1.eventRegisterController.createEventRegister);
router.patch('/accept/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), eventRegister_controller_1.eventRegisterController.acceptEventRegister);
router.patch('/reject/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin), eventRegister_controller_1.eventRegisterController.rejectEventRegister);
router.patch('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.coach, user_constants_1.USER_ROLE.player), eventRegister_controller_1.eventRegisterController.updateEventRegister);
router.delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.coach, user_constants_1.USER_ROLE.player, user_constants_1.USER_ROLE.admin), eventRegister_controller_1.eventRegisterController.deleteEventRegister);
router.get('/:id', eventRegister_controller_1.eventRegisterController.getEventRegisterById);
router.get('/', eventRegister_controller_1.eventRegisterController.getAllEventRegister);
exports.eventRegisterRoutes = router;
