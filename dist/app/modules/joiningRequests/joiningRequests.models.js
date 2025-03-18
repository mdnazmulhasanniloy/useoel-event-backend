"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const joiningRequestsSchema = new mongoose_1.Schema({
    player: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team', required: true },
    status: {
        type: String,
        enum: ['pending', 'accept', 'rejected'],
        default: 'pending',
    },
}, {
    timestamps: true,
});
const JoiningRequests = (0, mongoose_1.model)('JoiningRequests', joiningRequestsSchema);
exports.default = JoiningRequests;
