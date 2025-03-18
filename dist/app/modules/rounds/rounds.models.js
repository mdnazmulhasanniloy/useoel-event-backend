"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const rounds_interface_1 = require("./rounds.interface");
const roundsSchema = new mongoose_1.Schema({
    roundName: {
        type: String,
        required: true,
    },
    gameType: {
        type: String,
        enum: Object.values(rounds_interface_1.gameType),
    },
    game: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'gameType',
        required: [true, 'Receiver id is required'],
    },
    gettingScore: {
        type: Number,
        required: true,
    },
    reviewScore: {
        type: Number,
        required: false,
    },
    videos: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const Rounds = (0, mongoose_1.model)('Rounds', roundsSchema);
exports.default = Rounds;
