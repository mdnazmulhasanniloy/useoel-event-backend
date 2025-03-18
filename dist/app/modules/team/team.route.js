"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamRoutes = void 0;
const express_1 = require("express");
const team_controller_1 = require("./team.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const team_validation_1 = require("./team.validation");
const multer_1 = __importStar(require("multer"));
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const router = (0, express_1.Router)();
const storage = (0, multer_1.memoryStorage)();
const upload = (0, multer_1.default)({ storage });
router.post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.team), upload.single('logo'), (0, parseData_1.default)(), (0, validateRequest_1.default)(team_validation_1.teamValidationSchema.createTeamSchema), team_controller_1.teamController.createTeam);
router.patch('/add-player', (0, auth_1.default)(user_constants_1.USER_ROLE.team), (0, validateRequest_1.default)(team_validation_1.teamValidationSchema.addPlayerSchema), team_controller_1.teamController.addPlayerInTeam);
router.patch('/remove-player', (0, auth_1.default)(user_constants_1.USER_ROLE.team), (0, validateRequest_1.default)(team_validation_1.teamValidationSchema.removePlayerSchema), team_controller_1.teamController.removePlayerFromTeam);
router.patch('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.team), upload.single('logo'), (0, parseData_1.default)(), (0, validateRequest_1.default)(team_validation_1.teamValidationSchema.updateTeamSchema), team_controller_1.teamController.updateTeam);
router.delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.team), team_controller_1.teamController.deleteTeam);
router.get('/:id', team_controller_1.teamController.getTeamById);
router.get('/', team_controller_1.teamController.getAllTeam);
exports.teamRoutes = router;
