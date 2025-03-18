"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const futureInnovatorsSchema = new mongoose_1.Schema({
    event: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Events', required: true },
    teamName: { type: String, required: true },
    coach: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: mongoose_1.Schema.Types.Boolean, default: false },
}, { timestamps: true });
const FutureInnovators = (0, mongoose_1.model)('FutureInnovators', futureInnovatorsSchema);
exports.default = FutureInnovators;
