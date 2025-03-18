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
exports.joiningRequestsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const joiningRequests_models_1 = __importDefault(require("./joiningRequests.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const notification_service_1 = require("../notification/notification.service");
const notification_interface_1 = require("../notification/notification.interface");
const team_models_1 = __importDefault(require("../team/team.models"));
const user_models_1 = require("../user/user.models");
const mongoose_1 = require("mongoose");
const createJoiningRequests = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the player has already requested to join the team
    const team = yield team_models_1.default.findById(payload.team);
    if (!team) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Team not found');
    }
    const result = yield joiningRequests_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create joiningRequests');
    }
    notification_service_1.notificationServices.insertNotificationIntoDb({
        receiver: result.player,
        message: 'You have received a team invite!',
        description: `The team "<b>${team.name}</b>" has invited you to join them. Check your joining requests for more details.`,
        refference: result === null || result === void 0 ? void 0 : result._id,
        model_type: notification_interface_1.modeType.JoiningRequests,
    });
    return result;
});
const getAllJoiningRequests = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const joiningRequestsModel = new QueryBuilder_1.default(joiningRequests_models_1.default.find({ isDeleted: false }), query)
        .search([''])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield joiningRequestsModel.modelQuery;
    const meta = yield joiningRequestsModel.countTotal();
    return {
        data,
        meta,
    };
});
const getJoiningRequestsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield joiningRequests_models_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'JoiningRequests not found!');
    }
    return result;
});
const updateJoiningRequests = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield joiningRequests_models_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update JoiningRequests');
    }
    return result;
});
const approvedRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    const request = yield joiningRequests_models_1.default.findById(id).populate([
        'player',
        'team',
    ]);
    if (!request) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'JoiningRequests not found');
    }
    if (!(request === null || request === void 0 ? void 0 : request.player)) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Player not found');
    }
    if (((_a = request === null || request === void 0 ? void 0 : request.team) === null || _a === void 0 ? void 0 : _a.player.length) >= 3) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Team is full');
    }
    const isDuplicate = (request === null || request === void 0 ? void 0 : request.team).player.some(player => { var _a; return (player === null || player === void 0 ? void 0 : player.email) === ((_a = request === null || request === void 0 ? void 0 : request.player) === null || _a === void 0 ? void 0 : _a.email); });
    if (isDuplicate) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'you are already exists in the team');
    }
    try {
        const result = yield joiningRequests_models_1.default.findByIdAndUpdate(id, { status: 'accept' }, { new: true, session });
        if (!result) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update JoiningRequests');
        }
        const player = yield user_models_1.User.findByIdAndUpdate(result === null || result === void 0 ? void 0 : result.player, { available: true }, { new: true, upsert: false, session });
        if (!player) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Player not found');
        }
        const team = yield team_models_1.default.findByIdAndUpdate(result === null || result === void 0 ? void 0 : result.team, {
            player: {
                name: player.name,
                email: player.email,
                image: player.profile,
            },
        }, { new: true, upsert: false, session });
        if (!team) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Team not found');
        }
        notification_service_1.notificationServices.insertNotificationIntoDb({
            receiver: team === null || team === void 0 ? void 0 : team.user,
            message: 'A player has accepted your team invite!',
            description: `Player <b>${player === null || player === void 0 ? void 0 : player.name}</b> has accepted your invitation and joined your team "<b>${team === null || team === void 0 ? void 0 : team.name}</b>`,
            refference: result === null || result === void 0 ? void 0 : result._id,
            model_type: notification_interface_1.modeType.JoiningRequests,
        });
        notification_service_1.notificationServices.insertNotificationIntoDb({
            receiver: player === null || player === void 0 ? void 0 : player._id,
            message: 'You have joined a new team!',
            description: `You have successfully joined the team "<b>${team.name}</b>". Best of luck with your new journey!`,
            refference: result === null || result === void 0 ? void 0 : result._id,
            model_type: notification_interface_1.modeType.JoiningRequests,
        });
        // Commit the transaction if all operations succeed
        yield session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, error === null || error === void 0 ? void 0 : error.message);
    }
});
const canceledRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const result = yield joiningRequests_models_1.default.findByIdAndUpdate(id, { status: 'rejected' }, { new: true })
        .populate('team')
        .populate('player');
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to cancel joiningRequests');
    }
    notification_service_1.notificationServices.insertNotificationIntoDb({
        receiver: (_a = result === null || result === void 0 ? void 0 : result.team) === null || _a === void 0 ? void 0 : _a.user,
        message: 'A player has rejected your team invite!',
        description: `Player <b>${(_b = result === null || result === void 0 ? void 0 : result.player) === null || _b === void 0 ? void 0 : _b.name}</b> has declined your invitation to join the team "<b>${(_c = result === null || result === void 0 ? void 0 : result.team) === null || _c === void 0 ? void 0 : _c.name}</b>".`,
        refference: result === null || result === void 0 ? void 0 : result._id,
        model_type: notification_interface_1.modeType.JoiningRequests,
    });
    return result;
});
const deleteJoiningRequests = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield joiningRequests_models_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete joiningRequests');
    }
    return result;
});
exports.joiningRequestsService = {
    createJoiningRequests,
    getAllJoiningRequests,
    getJoiningRequestsById,
    updateJoiningRequests,
    deleteJoiningRequests,
    approvedRequest,
    canceledRequest,
};
