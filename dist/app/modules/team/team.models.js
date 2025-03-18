"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TeamPlayerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, trim: true },
    image: { type: String, required: true },
});
const teamSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    teamCategory: { type: String, required: true },
    ageGroup: { type: String, required: true },
    logo: { type: String, required: true },
    player: { type: [TeamPlayerSchema], required: false },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
const Team = (0, mongoose_1.model)('Team', teamSchema);
exports.default = Team;
