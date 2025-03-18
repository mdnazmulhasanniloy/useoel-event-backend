"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const eventRegisterSchema = new mongoose_1.Schema({
    event: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Events',
        required: true,
    },
    teamName: {
        type: String,
        required: true,
    },
    coach: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    player: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['pending', 'accept', 'rejected'],
        default: 'pending',
    },
}, {
    timestamps: true,
});
const EventRegister = (0, mongoose_1.model)('EventRegister', eventRegisterSchema);
exports.default = EventRegister;
