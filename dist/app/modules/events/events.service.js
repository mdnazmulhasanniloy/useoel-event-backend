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
exports.eventsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const events_models_1 = __importDefault(require("./events.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const createEvents = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield events_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create events');
    }
    return result;
});
const getAllEvents = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const eventsModel = new QueryBuilder_1.default(events_models_1.default.find({ isDeleted: false }), query)
        .search(["name status category"])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield eventsModel.modelQuery;
    const meta = yield eventsModel.countTotal();
    return {
        data,
        meta,
    };
});
const getEventsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield events_models_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Events not found!');
    }
    return result;
});
const updateEvents = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield events_models_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!result || result.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update Events');
    }
    return result;
});
const deleteEvents = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield events_models_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete events');
    }
    return result;
});
exports.eventsService = {
    createEvents,
    getAllEvents,
    getEventsById,
    updateEvents,
    deleteEvents,
};
