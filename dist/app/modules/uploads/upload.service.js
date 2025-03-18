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
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const s3_1 = require("../../utils/s3");
const multiple = (files) => __awaiter(void 0, void 0, void 0, function* () {
    let imagesArray = [];
    let videosArray = [];
    const { images, videos } = files;
    if (images) {
        const imgsArr = [];
        images === null || images === void 0 ? void 0 : images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
            imgsArr.push({
                file: image,
                path: `images/`,
            });
        }));
        imagesArray = (yield (0, s3_1.uploadManyToS3)(imgsArr)) || [];
    }
    if (videos) {
        const videosArr = [];
        videos === null || videos === void 0 ? void 0 : videos.map((video) => __awaiter(void 0, void 0, void 0, function* () {
            videosArr.push({
                file: video,
                path: `videos/`,
            });
        }));
        videosArray = yield (0, s3_1.uploadManyToS3)(videosArr);
    }
    return {
        images: imagesArray,
        videos: videosArray,
    };
});
const single = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'File is required');
    }
    const result = yield (0, s3_1.uploadToS3)({
        file,
        fileName: `images/${Math.floor(100000 + Math.random() * 900000)}`,
    });
    return result;
});
const uploadService = { multiple, single };
exports.default = uploadService;
