"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const events_constants_1 = require("./events.constants");
const eventsSchema = new mongoose_1.Schema({
    image: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, enum: events_constants_1.category, required: true },
    ageGroup: { type: String, required: true },
    scoringStyle: { type: String, required: true },
    roles: { type: String, required: true },
    status: {
        type: String,
        enum: ['continue', 'upcoming', 'cancelled', 'complete'],
        default: events_constants_1.EVENT_STATUS.UPCOMING,
    },
    registrationStartTime: { type: String, required: true },
    registrationEndTime: { type: String, required: true },
    maxParticipants: { type: Number, required: true },
    remainingParticipants: { type: Number },
    rounds: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
eventsSchema.pre('save', function (next) {
    if (this.isNew && this.remainingParticipants === undefined) {
        this.remainingParticipants = this.maxParticipants;
    }
    next();
});
const Events = (0, mongoose_1.model)('Events', eventsSchema);
exports.default = Events;
