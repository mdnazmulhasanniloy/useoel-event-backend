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
exports.eventsController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const events_service_1 = require("./events.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const s3_1 = require("../../utils/s3");
const createEvents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        req.body.image = yield (0, s3_1.uploadToS3)({
            file: req.file,
            fileName: `images/events/${Math.floor(100000 + Math.random() * 900000)}`,
        });
    }
    const result = yield events_service_1.eventsService.createEvents(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Events created successfully',
        data: result,
    });
}));
const getAllEvents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield events_service_1.eventsService.getAllEvents(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All events fetched successfully',
        data: result,
    });
}));
const getEventsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield events_service_1.eventsService.getEventsById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Events fetched successfully',
        data: result,
    });
}));
const updateEvents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        req.body.image = yield (0, s3_1.uploadToS3)({
            file: req.file,
            fileName: `images/events/${Math.floor(100000 + Math.random() * 900000)}`,
        });
    }
    const result = yield events_service_1.eventsService.updateEvents(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Events updated successfully',
        data: result,
    });
}));
const deleteEvents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield events_service_1.eventsService.deleteEvents(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Events deleted successfully',
        data: result,
    });
}));
exports.eventsController = {
    createEvents,
    getAllEvents,
    getEventsById,
    updateEvents,
    deleteEvents,
};
