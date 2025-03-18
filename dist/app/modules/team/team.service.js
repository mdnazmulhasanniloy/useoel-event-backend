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
exports.teamService = exports.createTeam = void 0;
const http_status_1 = __importDefault(require("http-status"));
const team_models_1 = __importDefault(require("./team.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_models_1 = require("../user/user.models");
const mongoose_1 = require("mongoose");
const createTeam = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        // Step 1: Create the team
        const result = yield team_models_1.default.create([payload], { session });
        if (!result || result.length === 0) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create team');
        }
        // Step 2: Update the user
        const team = result[0];
        const userUpdate = yield user_models_1.User.findByIdAndUpdate(team === null || team === void 0 ? void 0 : team.user, { team: team === null || team === void 0 ? void 0 : team._id }, { session, new: true });
        if (!userUpdate) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update user');
        }
        // Step 3: Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        return team;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default === null || http_status_1.default === void 0 ? void 0 : http_status_1.default.BAD_REQUEST, error === null || error === void 0 ? void 0 : error.message); // Rethrow the error for the caller to handle
    }
});
exports.createTeam = createTeam;
const getAllTeam = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const teamModel = new QueryBuilder_1.default(team_models_1.default.find({ isDeleted: false }).populate({
        path: 'user',
        select: '-password -verification',
    }), query)
        .search(['name'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield teamModel.modelQuery;
    const meta = yield teamModel.countTotal();
    return {
        data,
        meta,
    };
});
const getTeamById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield team_models_1.default.findById(id).populate('user');
    if (!result || (result === null || result === void 0 ? void 0 : result.isDeleted)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Team not found!');
    }
    return result;
});
const addPlayerInTeam = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const team = yield team_models_1.default.findOne({ user: userId });
    if (!team) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found for the team');
    }
    if (team.player.length >= 3) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Team is full');
    }
    const isDuplicate = team.player.some(player => player.email === payload.email);
    if (isDuplicate) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Player with this email already exists in the team');
    }
    const result = yield team_models_1.default.findByIdAndUpdate(team === null || team === void 0 ? void 0 : team._id, {
        $push: { player: payload },
    }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to add player in team');
    }
    return result;
});
const removePlayerFromTeam = (userId, playerEmail) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Find the team by userId and validate if it exists
    const team = yield team_models_1.default.findOne({ user: userId });
    if (!team) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Team not found for the user');
    }
    // Step 2: Check if the player exists in the team
    const playerExists = team.player.some(player => player.email === playerEmail);
    if (!playerExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Player not found in the team');
    }
    // Step 3: Remove the player from the team using $pull
    const result = yield team_models_1.default.findByIdAndUpdate(team._id, { $pull: { player: { email: playerEmail } } }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to remove player from the team');
    }
    return result; // Return the updated team
});
const updateTeam = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield team_models_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!result || result.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update Team');
    }
    return result;
});
const deleteTeam = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield team_models_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete team');
    }
    return result;
});
exports.teamService = {
    createTeam: exports.createTeam,
    getAllTeam,
    getTeamById,
    updateTeam,
    deleteTeam,
    addPlayerInTeam,
    removePlayerFromTeam,
};
