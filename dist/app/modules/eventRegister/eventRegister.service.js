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
exports.eventRegisterService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const eventRegister_models_1 = __importDefault(require("./eventRegister.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const events_models_1 = __importDefault(require("../events/events.models"));
const events_constants_1 = require("../events/events.constants");
const moment_1 = __importDefault(require("moment"));
const createEventRegister = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield events_models_1.default.findById(payload.event);
    if (!event) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Event not found!');
    }
    const currentTime = (0, moment_1.default)().utc();
    //@ts-ignore
    const registrationEndTime = (0, moment_1.default)(event.registrationEndTime).utc();
    const registrationStartTime = (0, moment_1.default)(event.registrationStartTime).utc();
    if (currentTime.isBefore(registrationStartTime)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Registration has not started yet.');
    }
    if (currentTime.isAfter(registrationEndTime)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Registration period has ended.');
    }
    if ((event === null || event === void 0 ? void 0 : event.category) === (events_constants_1.CATEGORY_NAME === null || events_constants_1.CATEGORY_NAME === void 0 ? void 0 : events_constants_1.CATEGORY_NAME.robosporst) ||
        (event === null || event === void 0 ? void 0 : event.category) === events_constants_1.CATEGORY_NAME.sumboBots) {
        //@ts-ignore
        payload.player = userId;
    }
    else {
        //@ts-ignore
        payload.coach = userId;
    }
    if ((event === null || event === void 0 ? void 0 : event.category) === (events_constants_1.CATEGORY_NAME === null || events_constants_1.CATEGORY_NAME === void 0 ? void 0 : events_constants_1.CATEGORY_NAME.robosporst) ||
        events_constants_1.CATEGORY_NAME.sumboBots) {
        //@ts-ignore
        payload.player = userId;
    }
    else {
        //@ts-ignore
        payload.coach = userId;
    }
    const result = yield eventRegister_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create eventRegister');
    }
    return result;
});
const getAllEventRegister = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const eventRegisterModel = new QueryBuilder_1.default(eventRegister_models_1.default.find({}).populate([
        { path: 'event' },
        {
            path: 'coach',
            select: '-verification -password -isDeleted -role -gender -status',
        },
        {
            path: 'player',
            select: '-verification -password -isDeleted -role -gender -status',
        },
    ]), query)
        .search(['teamName'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield eventRegisterModel.modelQuery;
    const meta = yield eventRegisterModel.countTotal();
    return {
        data,
        meta,
    };
});
const getEventRegisterById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield eventRegister_models_1.default.findById(id).populate([
        { path: 'event' },
        {
            path: 'coach',
            select: '-verification -password -isDeleted -role -gender -status',
        },
        {
            path: 'player',
            select: '-verification -password -isDeleted -role -gender -status',
        },
    ]);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'EventRegister not found!');
    }
    return result;
});
const updateEventRegister = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield eventRegister_models_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update EventRegister');
    }
    return result;
});
const deleteEventRegister = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield eventRegister_models_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete eventRegister');
    }
    return result;
});
exports.eventRegisterService = {
    createEventRegister,
    getAllEventRegister,
    getEventRegisterById,
    updateEventRegister,
    deleteEventRegister,
};
