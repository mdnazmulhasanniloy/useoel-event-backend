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
exports.eventsRoutes = void 0;
const express_1 = require("express");
const events_controller_1 = require("./events.controller");
const multer_1 = __importStar(require("multer"));
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const events_validation_1 = require("./events.validation");
const router = (0, express_1.Router)();
const storage = (0, multer_1.memoryStorage)();
const upload = (0, multer_1.default)({ storage });
router.post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.sub_admin, user_constants_1.USER_ROLE.super_admin), upload.single('image'), (0, parseData_1.default)(), (0, validateRequest_1.default)(events_validation_1.eventValidator.createEventSchema), events_controller_1.eventsController.createEvents);
router.patch('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.sub_admin, user_constants_1.USER_ROLE.super_admin), upload.single('image'), (0, parseData_1.default)(), (0, validateRequest_1.default)(events_validation_1.eventValidator.updateEventSchema), events_controller_1.eventsController.updateEvents);
router.delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.admin, user_constants_1.USER_ROLE.sub_admin, user_constants_1.USER_ROLE.super_admin), events_controller_1.eventsController.deleteEvents);
router.get('/:id', events_controller_1.eventsController.getEventsById);
router.get('/', events_controller_1.eventsController.getAllEvents);
exports.eventsRoutes = router;
