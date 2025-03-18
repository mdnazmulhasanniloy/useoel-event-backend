"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const events_constants_1 = require("../events/events.constants");
const matchHighlightsSchema = new mongoose_1.Schema({
    video: {
        type: String,
        default: null
    },
    videoUrl: {
        type: String,
        default: null
    },
    title: {
        type: String,
        required: true,
        default: null
    },
    teamA: {
        type: mongoose_1.Types.ObjectId,
        ref: "Team",
        default: null,
        required: true,
    },
    teamB: {
        type: mongoose_1.Types.ObjectId,
        ref: "Team",
        required: true,
        default: null
    },
    ageGroup: {
        type: String,
        default: null
    },
    category: {
        type: String,
        enum: events_constants_1.category,
        default: null,
        required: true,
    },
    plays: {
        type: Number,
        default: 0,
    },
    isDeleted: { type: 'boolean', default: false },
}, {
    timestamps: true,
});
const MatchHighlights = (0, mongoose_1.model)('MatchHighlights', matchHighlightsSchema);
exports.default = MatchHighlights;
