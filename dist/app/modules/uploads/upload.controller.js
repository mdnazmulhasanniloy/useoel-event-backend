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
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const upload_service_1 = __importDefault(require("./upload.service"));
const multiple = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield upload_service_1.default.multiple(req.files);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'multiple uploaded successfully',
        data: result,
    });
}));
const single = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield upload_service_1.default.single(req.file);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'single uploaded successfully',
        data: result,
    });
}));
const uploadController = {
    multiple,
    single,
};
exports.default = uploadController;
