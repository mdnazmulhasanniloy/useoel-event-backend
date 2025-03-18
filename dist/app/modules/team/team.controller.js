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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const team_service_1 = require("./team.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const s3_1 = require("../../utils/s3");
const createTeam = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        req.body.logo = yield (0, s3_1.uploadToS3)({
            file: req.file,
            fileName: `images/team/logo/${Math.floor(100000 + Math.random() * 900000)}`,
        });
    }
    req.body.user = req.user.userId;
    const result = yield team_service_1.teamService.createTeam(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Team created successfully',
        data: result,
    });
}));
const getAllTeam = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield team_service_1.teamService.getAllTeam(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All team fetched successfully',
        data: result,
    });
}));
const getTeamById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield team_service_1.teamService.getTeamById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Team fetched successfully',
        data: result,
    });
}));
const updateTeam = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        req.body.logo = yield (0, s3_1.uploadToS3)({
            file: req.file,
            fileName: `images/team/logo/${Math.floor(100000 + Math.random() * 900000)}`,
        });
    }
    const result = yield team_service_1.teamService.updateTeam(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Team updated successfully',
        data: result,
    });
}));
const addPlayerInTeam = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield team_service_1.teamService.addPlayerInTeam((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId, req === null || req === void 0 ? void 0 : req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Add player in team successfully',
        data: result,
    });
}));
const removePlayerFromTeam = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield team_service_1.teamService.removePlayerFromTeam((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId, (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Add player in team successfully',
        data: result,
    });
}));
const deleteTeam = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield team_service_1.teamService.deleteTeam(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Team deleted successfully',
        data: result,
    });
}));
exports.teamController = {
    createTeam,
    getAllTeam,
    getTeamById,
    updateTeam,
    deleteTeam,
    addPlayerInTeam,
    removePlayerFromTeam,
};
