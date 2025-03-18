"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRobomissionSchema = exports.createRobomissionSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = __importDefault(require("zod"));
const RoundsSchema = zod_1.default.object({
    roundName: zod_1.default.string({ required_error: 'Round name is required' }),
    gettingScore: zod_1.default.number({ required_error: 'Getting score is required' }),
    reviewScore: zod_1.default.number({ required_error: 'Review score is required' }),
    videoUrl: zod_1.default
        .string({ required_error: 'Video URL is required' })
        .url('Invalid URL format'),
});
exports.createRobomissionSchema = zod_1.default.object({
    body: zod_1.default.object({
        event: zod_1.default.instanceof(mongoose_1.Types.ObjectId, { message: 'Invalid event ID' }),
        teamName: zod_1.default.string({ required_error: 'Team name is required' }),
        coach: zod_1.default.instanceof(mongoose_1.Types.ObjectId, { message: 'Invalid coach ID' }),
        rounds: zod_1.default.array(RoundsSchema, {
            required_error: 'At least one round is required',
        }),
    }),
});
exports.updateRobomissionSchema = zod_1.default.object({
    body: zod_1.default
        .object({
        event: zod_1.default.instanceof(mongoose_1.Types.ObjectId, { message: 'Invalid event ID' }),
        teamName: zod_1.default.string({ required_error: 'Team name is required' }),
        coach: zod_1.default.instanceof(mongoose_1.Types.ObjectId, { message: 'Invalid coach ID' }),
        rounds: zod_1.default
            .array(RoundsSchema)
    })
        .deepPartial(),
});
