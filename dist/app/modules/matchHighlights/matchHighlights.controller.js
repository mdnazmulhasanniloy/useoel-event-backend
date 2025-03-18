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
exports.matchHighlightsController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const matchHighlights_service_1 = require("./matchHighlights.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const s3_1 = require("../../utils/s3");
const createMatchHighlights = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        req.body.video = yield (0, s3_1.uploadToS3)({
            file: req.file,
            fileName: `videos/highlight_match/${Math.floor(100000 + Math.random() * 900000)}`,
        });
    }
    const result = yield matchHighlights_service_1.matchHighlightsService.createMatchHighlights(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'MatchHighlights created successfully',
        data: result,
    });
}));
const getAllMatchHighlights = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield matchHighlights_service_1.matchHighlightsService.getAllMatchHighlights(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All matchHighlights fetched successfully',
        data: result,
    });
}));
const getMatchHighlightsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield matchHighlights_service_1.matchHighlightsService.getMatchHighlightsById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'MatchHighlights fetched successfully',
        data: result,
    });
}));
const updateMatchHighlights = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        req.body.video = yield (0, s3_1.uploadToS3)({
            file: req.file,
            fileName: `videos/highlight_match/${Math.floor(100000 + Math.random() * 900000)}`,
        });
    }
    const result = yield matchHighlights_service_1.matchHighlightsService.updateMatchHighlights(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'MatchHighlights updated successfully',
        data: result,
    });
}));
const deleteMatchHighlights = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield matchHighlights_service_1.matchHighlightsService.deleteMatchHighlights(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'MatchHighlights deleted successfully',
        data: result,
    });
}));
exports.matchHighlightsController = {
    createMatchHighlights,
    getAllMatchHighlights,
    getMatchHighlightsById,
    updateMatchHighlights,
    deleteMatchHighlights,
};
