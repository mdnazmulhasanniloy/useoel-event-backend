import { Types } from 'mongoose';
import z from 'zod';

const RoundsSchema = z.object({
  roundName: z.string({ required_error: 'Round name is required' }),
  gettingScore: z.number({ required_error: 'Getting score is required' }),
  reviewScore: z.number({ required_error: 'Review score is required' }),
  videoUrl: z
    .string({ required_error: 'Video URL is required' })
    .url('Invalid URL format'),
});

export const createRobomissionSchema = z.object({
  body: z.object({
    event: z.instanceof(Types.ObjectId, { message: 'Invalid event ID' }),
    teamName: z.string({ required_error: 'Team name is required' }),
    coach: z.instanceof(Types.ObjectId, { message: 'Invalid coach ID' }),
    rounds: z.array(RoundsSchema, {
      required_error: 'At least one round is required',
    }),
  }),
});

export const updateRobomissionSchema = z.object({
  body: z
    .object({
      event: z.instanceof(Types.ObjectId, { message: 'Invalid event ID' }),
      teamName: z.string({ required_error: 'Team name is required' }),
      coach: z.instanceof(Types.ObjectId, { message: 'Invalid coach ID' }),
      rounds: z
        .array(RoundsSchema)
    })
    .deepPartial(),
});
 
