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
exports.joiningRequestsController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const joiningRequests_service_1 = require("./joiningRequests.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createJoiningRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield joiningRequests_service_1.joiningRequestsService.createJoiningRequests(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'JoiningRequests created successfully',
        data: result,
    });
}));
const getAllJoiningRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield joiningRequests_service_1.joiningRequestsService.getAllJoiningRequests(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All joiningRequests fetched successfully',
        data: result,
    });
}));
const getMyTeamJoiningRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.query['player'] = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield joiningRequests_service_1.joiningRequestsService.getAllJoiningRequests(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'All joiningRequests fetched successfully',
        data: result,
    });
}));
const getJoiningRequestsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield joiningRequests_service_1.joiningRequestsService.getJoiningRequestsById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'JoiningRequests fetched successfully',
        data: result,
    });
}));
const approvedRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield joiningRequests_service_1.joiningRequestsService.approvedRequest(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'JoiningRequests approved successfully',
        data: result,
    });
}));
const canceledRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield joiningRequests_service_1.joiningRequestsService.canceledRequest(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'JoiningRequests canceled successfully',
        data: result,
    });
}));
const updateJoiningRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield joiningRequests_service_1.joiningRequestsService.updateJoiningRequests(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'JoiningRequests updated successfully',
        data: result,
    });
}));
const deleteJoiningRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield joiningRequests_service_1.joiningRequestsService.deleteJoiningRequests(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'JoiningRequests deleted successfully',
        data: result,
    });
}));
exports.joiningRequestsController = {
    createJoiningRequests,
    getAllJoiningRequests,
    getJoiningRequestsById,
    updateJoiningRequests,
    deleteJoiningRequests,
    getMyTeamJoiningRequests,
    approvedRequest,
    canceledRequest,
};
