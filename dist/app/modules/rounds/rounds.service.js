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
exports.roundsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const rounds_models_1 = __importDefault(require("./rounds.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const createRounds = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rounds_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create rounds');
    }
    return result;
});
const getAllRounds = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const roundsModel = new QueryBuilder_1.default(rounds_models_1.default.find().populate([{ path: 'game' }]), query)
        .search(['roundName', 'gameType'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield roundsModel.modelQuery;
    const meta = yield roundsModel.countTotal();
    return {
        data,
        meta,
    };
});
const getRoundsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rounds_models_1.default.findById(id).populate([{ path: 'game' }]);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Rounds not found!');
    }
    return result;
});
const updateRounds = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rounds_models_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update Rounds');
    }
    return result;
});
const deleteRounds = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rounds_models_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete rounds');
    }
    return result;
});
exports.roundsService = {
    createRounds,
    getAllRounds,
    getRoundsById,
    updateRounds,
    deleteRounds,
};
