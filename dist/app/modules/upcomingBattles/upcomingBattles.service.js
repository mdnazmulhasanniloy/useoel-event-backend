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
exports.upcomingBattlesService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const upcomingBattles_models_1 = __importDefault(require("./upcomingBattles.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const createUpcomingBattles = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield upcomingBattles_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create upcomingBattles');
    }
    return result;
});
const getAllUpcomingBattles = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const upcomingBattlesModel = new QueryBuilder_1.default(upcomingBattles_models_1.default.find({ isDeleted: false }), query)
        .search([""])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield upcomingBattlesModel.modelQuery;
    const meta = yield upcomingBattlesModel.countTotal();
    return {
        data,
        meta,
    };
});
const getUpcomingBattlesById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield upcomingBattles_models_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'UpcomingBattles not found!');
    }
    return result;
});
const updateUpcomingBattles = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield upcomingBattles_models_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!result || result.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update UpcomingBattles');
    }
    return result;
});
const deleteUpcomingBattles = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield upcomingBattles_models_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete upcomingBattles');
    }
    return result;
});
exports.upcomingBattlesService = {
    createUpcomingBattles,
    getAllUpcomingBattles,
    getUpcomingBattlesById,
    updateUpcomingBattles,
    deleteUpcomingBattles,
};
