"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const upcomingBattlesSchema = new mongoose_1.Schema({
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    teamName: { type: String, required: true },
    teamMember: {
        type: Number,
        required: true,
    },
    ageGroup: { type: String, required: true },
    coachEmail: { type: String, required: true },
    score: { type: String, required: true },
    video: [{ type: String, default: '' }],
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});
const UpcomingBattles = (0, mongoose_1.model)('UpcomingBattles', upcomingBattlesSchema);
exports.default = UpcomingBattles;
