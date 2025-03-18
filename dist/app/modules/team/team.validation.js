"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamValidationSchema = void 0;
const z = __importStar(require("zod"));
const TeamPlayerSchema = z.object({
    name: z.string({ required_error: 'Player name is required' }),
    email: z
        .string({ required_error: 'Player email is required' })
        .email({ message: 'Invalid email format' }),
    image: z
        .string({ required_error: 'Player image URL is required' })
        .url({ message: 'Invalid image URL format' }),
});
const createTeamSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Team name is required' }),
        city: z.string({ required_error: 'City is required' }),
        state: z.string({ required_error: 'State is required' }),
        country: z.string({ required_error: 'Country is required' }),
        teamCategory: z.string({ required_error: 'Team category is required' }),
        ageGroup: z.string({ required_error: 'Age group is required' }),
        player: z.array(TeamPlayerSchema).optional(),
    }),
});
const updateTeamSchema = z.object({
    body: z
        .object({
        name: z.string({ required_error: 'Team name is required' }),
        city: z.string({ required_error: 'City is required' }),
        state: z.string({ required_error: 'State is required' }),
        country: z.string({ required_error: 'Country is required' }),
        teamCategory: z.string({ required_error: 'Team category is required' }),
        ageGroup: z.string({ required_error: 'Age group is required' }),
        player: z.array(TeamPlayerSchema).optional(),
    })
        .deepPartial(),
});
const addPlayerSchema = z.object({
    body: TeamPlayerSchema,
});
const removePlayerSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: 'Email is required' })
            .email({ message: 'please provide a valid email' }),
    }),
});
exports.teamValidationSchema = {
    createTeamSchema,
    updateTeamSchema,
    addPlayerSchema,
    removePlayerSchema,
};
