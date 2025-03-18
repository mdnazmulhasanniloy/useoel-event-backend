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
exports.matchHighlightsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const matchHighlights_models_1 = __importDefault(require("./matchHighlights.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const createMatchHighlights = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield matchHighlights_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create matchHighlights');
    }
    return result;
});
const getAllMatchHighlights = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const matchHighlightsModel = new QueryBuilder_1.default(matchHighlights_models_1.default.find({ isDeleted: false }), query)
        .search(["title", "ageGroup"])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield matchHighlightsModel.modelQuery;
    const meta = yield matchHighlightsModel.countTotal();
    return {
        data,
        meta,
    };
});
const getMatchHighlightsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield matchHighlights_models_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'MatchHighlights not found!');
    }
    yield matchHighlights_models_1.default.findByIdAndUpdate(result === null || result === void 0 ? void 0 : result._id, { $inc: { plays: 1 } });
    return result;
});
const updateMatchHighlights = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield matchHighlights_models_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!result || result.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update MatchHighlights');
    }
    return result;
});
const deleteMatchHighlights = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield matchHighlights_models_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete matchHighlights');
    }
    return result;
});
exports.matchHighlightsService = {
    createMatchHighlights,
    getAllMatchHighlights,
    getMatchHighlightsById,
    updateMatchHighlights,
    deleteMatchHighlights,
};
