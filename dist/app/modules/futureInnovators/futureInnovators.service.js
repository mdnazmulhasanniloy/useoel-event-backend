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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.futureInnovatorsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const futureInnovators_models_1 = __importDefault(require("./futureInnovators.models"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const eventRegister_models_1 = __importDefault(require("../eventRegister/eventRegister.models"));
const rounds_interface_1 = require("../rounds/rounds.interface");
const events_models_1 = __importDefault(require("../events/events.models"));
const rounds_models_1 = __importDefault(require("../rounds/rounds.models"));
const pickQuery_1 = __importDefault(require("../../utils/pickQuery"));
const pagination_helpers_1 = require("../../helpers/pagination.helpers");
const events_constants_1 = require("../events/events.constants");
const mongoose_1 = require("mongoose");
// const createFutureInnovators = async (payload: IFutureInnovators) => {
//   const registration = await EventRegister.findOne({
//     event: payload?.event,
//     coach: payload?.coach,
//     status: 'accept',
//   });
//   if (!registration) {
//     throw new AppError(
//       httpStatus.FORBIDDEN,
//       'You are not registered for this event',
//     );
//   }
//   payload.teamName = registration?.teamName;
//   const roundsArr: IRounds[] = [];
//   const { rounds, ...gameData } = payload;
//   // Find the event
//   const event = await Events.findById(gameData?.event, null);
//   if (!event) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Event not found');
//   }
//   if (event?.category !== CATEGORY_NAME.futureInnovators) {
//     throw new AppError(
//       httpStatus.FORBIDDEN,
//       'This event is not a Future Innovators event',
//     );
//   }
//   // Create FutureInnovators
//   const result = await FutureInnovators.create(gameData);
//   if (!result) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       'Failed to create Future Innovators',
//     );
//   }
//   // Prepare rounds data
//   rounds?.map(round =>
//     roundsArr.push({
//       ...round,
//       gameType: gameType.FutureInnovators,
//       //@ts-ignore
//       game: result?._id,
//     }),
//   );
//   // Create rounds
//   await Rounds.create(roundsArr);
//   return result;
// };
const createFutureInnovators = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        const registration = yield eventRegister_models_1.default.findOne({ event: payload === null || payload === void 0 ? void 0 : payload.event, coach: payload === null || payload === void 0 ? void 0 : payload.coach, status: 'accept' }, null, { session });
        if (!registration) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are not registered for this event');
        }
        payload.teamName = registration.teamName;
        const { rounds } = payload, gameData = __rest(payload, ["rounds"]);
        // Find the event
        const event = yield events_models_1.default.findById(gameData === null || gameData === void 0 ? void 0 : gameData.event, null, { session });
        if (!event) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Event not found');
        }
        if (event.category !== events_constants_1.CATEGORY_NAME.futureInnovators) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This event is not a Future Innovators event');
        }
        // Create FutureInnovators
        const result = yield futureInnovators_models_1.default.create([gameData], { session });
        if (!result || result.length === 0) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Future Innovators');
        }
        // Prepare rounds data
        //@ts-ignore
        const roundsArr = rounds
            ? yield Promise.all(rounds.map((round) => __awaiter(void 0, void 0, void 0, function* () {
                return (Object.assign(Object.assign({}, round), { gameType: rounds_interface_1.gameType.FutureInnovators, 
                    //@ts-ignore
                    game: result[0]._id }));
            })))
            : [];
        // Create rounds if available
        if (roundsArr.length > 0) {
            yield rounds_models_1.default.create(roundsArr, { session });
        }
        // Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return result[0];
    }
    catch (error) {
        console.log('🚀 ~ error:', error);
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, error.message);
    }
});
const getAllFutureInnovators = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { filters, pagination } = yield (0, pickQuery_1.default)(query);
    const { searchTerm, latitude, longitude } = filters, filtersData = __rest(filters, ["searchTerm", "latitude", "longitude"]);
    if (filtersData === null || filtersData === void 0 ? void 0 : filtersData.author) {
        filtersData['event'] = new mongoose_1.Types.ObjectId(filtersData === null || filtersData === void 0 ? void 0 : filtersData.event);
    }
    if (filtersData === null || filtersData === void 0 ? void 0 : filtersData.facility) {
        filtersData['coach'] = new mongoose_1.Types.ObjectId(filtersData === null || filtersData === void 0 ? void 0 : filtersData.coach);
    }
    // Initialize the aggregation pipeline
    const pipeline = [];
    pipeline.push({
        $match: Object.assign({ isDeleted: false }, filtersData),
    });
    if (searchTerm) {
        pipeline.push({
            $match: {
                $or: ['name', 'Other'].map(field => ({
                    [field]: {
                        $regex: searchTerm,
                        $options: 'i',
                    },
                })),
            },
        });
    }
    // Add custom filters (filtersData) to the aggregation pipeline
    if (Object.entries(filtersData).length) {
        Object.entries(filtersData).map(([field, value]) => {
            if (/^\[.*?\]$/.test(value)) {
                const match = value.match(/\[(.*?)\]/);
                const queryValue = match ? match[1] : value;
                pipeline.push({
                    $match: {
                        [field]: { $in: [new mongoose_1.Types.ObjectId(queryValue)] },
                    },
                });
                delete filtersData[field];
            }
        });
        if (Object.entries(filtersData).length) {
            pipeline.push({
                $match: {
                    $and: Object.entries(filtersData).map(([field, value]) => ({
                        isDeleted: false,
                        [field]: value,
                    })),
                },
            });
        }
    }
    // Sorting condition
    const { page, limit, skip, sort } = pagination_helpers_1.paginationHelper.calculatePagination(pagination);
    if (sort) {
        const sortArray = sort.split(',').map(field => {
            const trimmedField = field.trim();
            if (trimmedField.startsWith('-')) {
                return { [trimmedField.slice(1)]: -1 };
            }
            return { [trimmedField]: 1 };
        });
        pipeline.push({ $sort: Object.assign({}, ...sortArray) });
    }
    pipeline.push({
        $facet: {
            totalData: [{ $count: 'total' }],
            paginatedData: [
                { $skip: skip },
                { $limit: limit },
                // Lookups
                {
                    $lookup: {
                        from: 'rounds',
                        let: { futureInnovators: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$game', '$$futureInnovators'] },
                                            { $eq: ['$gameType', rounds_interface_1.gameType.FutureInnovators] },
                                        ],
                                    },
                                },
                            },
                            { $sort: { createdAt: -1 } },
                        ],
                        as: 'rounds',
                    },
                },
                {
                    $lookup: {
                        from: 'events',
                        localField: 'event',
                        foreignField: '_id',
                        as: 'event',
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'coach',
                        foreignField: '_id',
                        as: 'coach',
                        pipeline: [
                            {
                                $project: {
                                    name: 1,
                                    email: 1,
                                    phoneNumber: 1,
                                    profile: 1,
                                    image: 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $addFields: {
                        coach: { $arrayElemAt: ['$coach', 0] },
                        event: { $arrayElemAt: ['$event', 0] },
                    },
                },
                {
                    $project: {
                        teamName: 1,
                        event: 1,
                        coach: 1,
                        isDeleted: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        rounds: 1,
                    },
                },
            ],
        },
    });
    const [result] = yield futureInnovators_models_1.default.aggregate(pipeline);
    const total = ((_b = (_a = result === null || result === void 0 ? void 0 : result.totalData) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
    const data = (result === null || result === void 0 ? void 0 : result.paginatedData) || [];
    return {
        meta: { page, limit, total },
        data,
    };
});
const getFutureInnovatorsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [result] = yield futureInnovators_models_1.default.aggregate([
        {
            $match: { _id: new mongoose_1.Types.ObjectId(id), isDeleted: false },
        },
        {
            $lookup: {
                from: 'rounds',
                let: { futureInnovators: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$game', '$$futureInnovators'] },
                                    { $eq: ['$gameType', rounds_interface_1.gameType.FutureInnovators] },
                                ],
                            },
                        },
                    },
                    { $sort: { createdAt: -1 } },
                ],
                as: 'rounds',
            },
        },
        {
            $lookup: {
                from: 'events',
                localField: 'event',
                foreignField: '_id',
                as: 'event',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'coach',
                foreignField: '_id',
                as: 'coach',
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            email: 1,
                            phoneNumber: 1,
                            profile: 1,
                            image: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                coach: { $arrayElemAt: ['$coach', 0] },
                event: { $arrayElemAt: ['$event', 0] },
            },
        },
        {
            $project: {
                teamName: 1,
                event: 1,
                coach: 1,
                isDeleted: 1,
                createdAt: 1,
                updatedAt: 1,
                rounds: 1,
            },
        },
    ]);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Future innovators not found!');
    }
    return result;
});
const updateFutureInnovators = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield futureInnovators_models_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!result || result.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update FutureInnovators');
    }
    return result;
});
const deleteFutureInnovators = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield futureInnovators_models_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete futureInnovators');
    }
    return result;
});
exports.futureInnovatorsService = {
    createFutureInnovators,
    getAllFutureInnovators,
    getFutureInnovatorsById,
    updateFutureInnovators,
    deleteFutureInnovators,
};
