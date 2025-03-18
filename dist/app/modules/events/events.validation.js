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
exports.eventValidator = void 0;
const z = __importStar(require("zod"));
const events_constants_1 = require("./events.constants");
// Define the IEvents schema
const createEventSchema = z.object({
    file: z.object({
        fieldname: z.string().min(1),
        originalname: z
            .string()
            .refine(value => /\.(jpg|jpeg|png|webp)$/i.test(value), {
            message: 'Invalid image format. Supported formats: .jpg, .jpeg, .png, .webp',
        }),
        encoding: z.string().min(1),
        mimetype: z
            .string()
            .refine(value => /^image\/(jpeg|png|webp)$/i.test(value), {
            message: 'Invalid mimetype. Supported formats: image/jpeg, image/png, image/webp',
        }),
        buffer: z.instanceof(Buffer).refine(value => value.length > 0, {
            message: 'File buffer should not be empty',
        }),
        size: z.number().max(10 * 1024 * 1024, {
            message: 'File size should not exceed 10MB',
        }), // You can change 10MB to the size you need
    }),
    body: z.object({
        name: z.string().min(1, { message: 'Event name is required.' }),
        category: z.enum([...events_constants_1.category]),
        ageGroup: z.string().min(1, { message: 'Age group is required.' }),
        scoringStyle: z.string().min(1, { message: 'Scoring style is required.' }),
        roles: z.string().min(1, { message: 'Roles are required.' }),
        status: z
            .enum(['continue', 'upcoming', 'cancelled', 'complete'])
            .default('upcoming'),
        registrationStartTime: z.string().refine(val => !isNaN(Date.parse(val)), {
            message: 'Invalid registration start time.',
        }),
        registrationEndTime: z.string().refine(val => !isNaN(Date.parse(val)), {
            message: 'Invalid registration end time.',
        }),
        maxParticipants: z
            .number()
            .int()
            .min(1, { message: 'Max participants must be greater than 0.' }),
        rounds: z
            .number()
            .int()
            .min(1, { message: 'Rounds must be a positive integer.' })
            .default(1),
    }),
});
const updateEventSchema = z.object({
    // file: z
    //   .object({
    //     fieldname: z.string().min(1),
    //     originalname: z
    //       .string()
    //       .refine(value => /\.(jpg|jpeg|png|webp)$/i.test(value), {
    //         message:
    //           'Invalid image format. Supported formats: .jpg, .jpeg, .png, .webp',
    //       }),
    //     encoding: z.string().min(1),
    //     mimetype: z
    //       .string()
    //       .refine(value => /^image\/(jpeg|png|webp)$/i.test(value), {
    //         message:
    //           'Invalid mimetype. Supported formats: image/jpeg, image/png, image/webp',
    //       }),
    //     buffer: z.instanceof(Buffer).refine(value => value.length > 0, {
    //       message: 'File buffer should not be empty',
    //     }),
    //     size: z.number().max(10 * 1024 * 1024, {
    //       message: 'File size should not exceed 10MB',
    //     }), // You can change 10MB to the size you need
    //   })
    //   .deepPartial(),
    body: z
        .object({
        name: z.string().min(1, { message: 'Event name is required.' }),
        category: z.enum([...events_constants_1.category]),
        ageGroup: z.string().min(1, { message: 'Age group is required.' }),
        scoringStyle: z
            .string()
            .min(1, { message: 'Scoring style is required.' }),
        Round: z.number().int().min(1, {
            message: 'Round must be a positive integer greater than 0.',
        }),
        roles: z.string().min(1, { message: 'Roles are required.' }),
        status: z
            .enum(['continue', 'upcoming', 'cancelled', 'complete'])
            .default('upcoming'),
        registrationStartTime: z.string().refine(val => !isNaN(Date.parse(val)), {
            message: 'Invalid registration start time.',
        }),
        registrationEndTime: z.string().refine(val => !isNaN(Date.parse(val)), {
            message: 'Invalid registration end time.',
        }),
        maxParticipants: z
            .number()
            .int()
            .min(1, { message: 'Max participants must be greater than 0.' }),
        rounds: z
            .number()
            .int()
            .min(1, { message: 'Rounds must be a positive integer.' })
            .default(1),
    })
        .deepPartial(),
});
exports.eventValidator = {
    createEventSchema,
    updateEventSchema,
};
