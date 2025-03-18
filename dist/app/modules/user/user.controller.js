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
exports.userController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const s3_1 = require("../../utils/s3");
const otp_service_1 = require("../otp/otp.service");
const user_models_1 = require("./user.models");
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        req.body.profile = yield (0, s3_1.uploadToS3)({
            file: req.file,
            fileName: `images/user/profile/${Math.floor(100000 + Math.random() * 900000)}`,
        });
    }
    const result = yield user_service_1.userService.createUser(req.body);
    const sendOtp = yield otp_service_1.otpServices.resendOtp(result === null || result === void 0 ? void 0 : result.email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User created successfully',
        data: { user: result, otpToken: sendOtp },
    });
}));
const getAllUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.getAllUser(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users fetched successfully',
        data: result,
    });
}));
const getUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.geUserById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User fetched successfully',
        data: result,
    });
}));
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield user_service_1.userService.geUserById((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'profile fetched successfully',
        data: result,
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_models_1.User.findById(req.params.id);
    if (req === null || req === void 0 ? void 0 : req.file) {
        req.body.profile = yield (0, s3_1.uploadToS3)({
            file: req.file,
            fileName: `images/user/profile/${Math.floor(100000 + Math.random() * 900000)}`,
        });
    }
    const result = yield user_service_1.userService.updateUser(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User updated successfully',
        data: result,
    });
}));
const updateMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield user_models_1.User.findById(req.user.userId);
    if (req === null || req === void 0 ? void 0 : req.files) {
        const { profile, videos } = req.files;
        if (profile && (profile === null || profile === void 0 ? void 0 : profile.length) > 0) {
            req.body.profile = yield (0, s3_1.uploadToS3)({
                file: profile[0],
                fileName: `images/user/profile/${Math.floor(100000 + Math.random() * 900000)}`,
            });
        }
        if (videos && videos.length > 0) {
            // Use Promise.all to handle async operations in parallel
            const uploads = yield Promise.all(videos.map((video) => __awaiter(void 0, void 0, void 0, function* () {
                const upload = yield (0, s3_1.uploadToS3)({
                    file: video,
                    fileName: `videos/profile-video/${Math.floor(100000 + Math.random() * 900000)}`,
                });
                return upload; // Collect the upload results
            })));
            req.body.videos = uploads; // Assign the uploaded video URLs to req.body.videos
        }
    }
    const result = yield user_service_1.userService.updateUser((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'profile updated successfully',
        data: result,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.deleteUser(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User deleted successfully',
        data: result,
    });
}));
const removeVideo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield user_service_1.userService.removeVideo((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'video deleted successfully',
        data: result,
    });
}));
const deleteMYAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield user_service_1.userService.deleteUser((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User deleted successfully',
        data: result,
    });
}));
exports.userController = {
    createUser,
    getAllUser,
    getUserById,
    getMyProfile,
    updateUser,
    updateMyProfile,
    deleteUser,
    deleteMYAccount,
    removeVideo,
};
