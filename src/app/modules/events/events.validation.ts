import * as z from 'zod';
import { category } from './events.constants';

// Define the IEvents schema
const createEventSchema = z.object({
  file: z.object({
    fieldname: z.string().min(1),
    originalname: z
      .string()
      .refine(value => /\.(jpg|jpeg|png|webp)$/i.test(value), {
        message:
          'Invalid image format. Supported formats: .jpg, .jpeg, .png, .webp',
      }),
    encoding: z.string().min(1),
    mimetype: z
      .string()
      .refine(value => /^image\/(jpeg|png|webp)$/i.test(value), {
        message:
          'Invalid mimetype. Supported formats: image/jpeg, image/png, image/webp',
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
    category: z.enum([...category] as [string, ...string[]]),
    ageGroup: z.string().min(1, { message: 'Age group is required.' }),
    scoringStyle: z
      .string()
      .min(1, { message: 'Scoring style is required.' })
      .optional(),
    rules: z.string().min(1, { message: 'Rules are required.' }),
    status: z
      .enum(['continue', 'upcoming', 'cancelled', 'complete'] as [
        string,
        ...string[],
      ])
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
      category: z.enum([...category] as [string, ...string[]]),
      ageGroup: z.string().min(1, { message: 'Age group is required.' }),
      scoringStyle: z
        .string()
        .min(1, { message: 'Scoring style is required.' })
        .optional(),
      rules: z.string().min(1, { message: 'Rules are required.' }),
      status: z
        .enum(['continue', 'upcoming', 'cancelled', 'complete'] as [
          string,
          ...string[],
        ])
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

export const eventValidator = {
  createEventSchema,
  updateEventSchema,
};
