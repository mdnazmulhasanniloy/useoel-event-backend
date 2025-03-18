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
exports.robomissionController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const robomission_service_1 = require("./robomission.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createRobomission = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.coach = req.user.userId;
    const result = yield robomission_service_1.robomissionService.createRobomission(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Robomission created successfully',
        data: result,
    });
}));
const getAllRobomission = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield robomission_service_1.robomissionService.getAllRobomission(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All robomission fetched successfully',
        data: result,
    });
}));
const getRobomissionById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield robomission_service_1.robomissionService.getRobomissionById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Robomission fetched successfully',
        data: result,
    });
}));
const updateRobomission = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield robomission_service_1.robomissionService.updateRobomission(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Robomission updated successfully',
        data: result,
    });
}));
const deleteRobomission = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield robomission_service_1.robomissionService.deleteRobomission(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Robomission deleted successfully',
        data: result,
    });
}));
exports.robomissionController = {
    createRobomission,
    getAllRobomission,
    getRobomissionById,
    updateRobomission,
    deleteRobomission,
};
