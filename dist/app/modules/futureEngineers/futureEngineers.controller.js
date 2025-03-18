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
exports.futureEngineersController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const futureEngineers_service_1 = require("./futureEngineers.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createFutureEngineers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.coach = req.user.userId;
    const result = yield futureEngineers_service_1.futureEngineersService.createFutureEngineers(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'FutureEngineers created successfully',
        data: result,
    });
}));
const getAllFutureEngineers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield futureEngineers_service_1.futureEngineersService.getAllFutureEngineers(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All futureEngineers fetched successfully',
        data: result,
    });
}));
const getFutureEngineersById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield futureEngineers_service_1.futureEngineersService.getFutureEngineersById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'FutureEngineers fetched successfully',
        data: result,
    });
}));
const updateFutureEngineers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield futureEngineers_service_1.futureEngineersService.updateFutureEngineers(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'FutureEngineers updated successfully',
        data: result,
    });
}));
const deleteFutureEngineers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield futureEngineers_service_1.futureEngineersService.deleteFutureEngineers(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'FutureEngineers deleted successfully',
        data: result,
    });
}));
exports.futureEngineersController = {
    createFutureEngineers,
    getAllFutureEngineers,
    getFutureEngineersById,
    updateFutureEngineers,
    deleteFutureEngineers,
};
