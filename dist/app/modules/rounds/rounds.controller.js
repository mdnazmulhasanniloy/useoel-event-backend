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
exports.roundsController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const rounds_service_1 = require("./rounds.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createRounds = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rounds_service_1.roundsService.createRounds(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Rounds created successfully',
        data: result,
    });
}));
const getAllRounds = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rounds_service_1.roundsService.getAllRounds(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All rounds fetched successfully',
        data: result,
    });
}));
const getRoundsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rounds_service_1.roundsService.getRoundsById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Rounds fetched successfully',
        data: result,
    });
}));
const updateRounds = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rounds_service_1.roundsService.updateRounds(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Rounds updated successfully',
        data: result,
    });
}));
const roundReviewScore = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rounds_service_1.roundsService.updateRounds(req.params.id, {
        reviewScore: req.body.reviewScore,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Score updated successfully',
        data: result,
    });
}));
const deleteRounds = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rounds_service_1.roundsService.deleteRounds(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Rounds deleted successfully',
        data: result,
    });
}));
exports.roundsController = {
    createRounds,
    getAllRounds,
    getRoundsById,
    updateRounds,
    deleteRounds,
    roundReviewScore,
};
