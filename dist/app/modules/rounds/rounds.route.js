"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundsRoutes = void 0;
const express_1 = require("express");
const rounds_controller_1 = require("./rounds.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const zod_1 = __importDefault(require("zod"));
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.coach, user_constants_1.USER_ROLE.player), rounds_controller_1.roundsController.createRounds);
router.patch('/review/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.sub_admin, user_constants_1.USER_ROLE.super_admin), (0, validateRequest_1.default)(zod_1.default.object({
    body: zod_1.default.object({
        reviewScore: zod_1.default.number({ required_error: 'reviewScore is required' }),
    }),
})), rounds_controller_1.roundsController.updateRounds);
router.patch('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.coach, user_constants_1.USER_ROLE.player, user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.sub_admin, user_constants_1.USER_ROLE.super_admin), rounds_controller_1.roundsController.updateRounds);
router.delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.coach, user_constants_1.USER_ROLE.player, user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.sub_admin, user_constants_1.USER_ROLE.super_admin), rounds_controller_1.roundsController.deleteRounds);
router.get('/:id', rounds_controller_1.roundsController.getRoundsById);
router.get('/', rounds_controller_1.roundsController.getAllRounds);
exports.roundsRoutes = router;
