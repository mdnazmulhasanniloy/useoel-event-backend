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
exports.futureInnovatorsController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const futureInnovators_service_1 = require("./futureInnovators.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createFutureInnovators = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.coach = req.user.userId;
    const result = yield futureInnovators_service_1.futureInnovatorsService.createFutureInnovators(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'FutureInnovators created successfully',
        data: result,
    });
}));
const getAllFutureInnovators = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield futureInnovators_service_1.futureInnovatorsService.getAllFutureInnovators(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All futureInnovators fetched successfully',
        data: result,
    });
}));
const getFutureInnovatorsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield futureInnovators_service_1.futureInnovatorsService.getFutureInnovatorsById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'FutureInnovators fetched successfully',
        data: result,
    });
}));
const updateFutureInnovators = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield futureInnovators_service_1.futureInnovatorsService.updateFutureInnovators(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'FutureInnovators updated successfully',
        data: result,
    });
}));
const deleteFutureInnovators = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield futureInnovators_service_1.futureInnovatorsService.deleteFutureInnovators(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'FutureInnovators deleted successfully',
        data: result,
    });
}));
exports.futureInnovatorsController = {
    createFutureInnovators,
    getAllFutureInnovators,
    getFutureInnovatorsById,
    updateFutureInnovators,
    deleteFutureInnovators,
};
