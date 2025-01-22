import * as z from 'zod';

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

export const teamValidationSchema = {
  createTeamSchema,
  updateTeamSchema,
  addPlayerSchema,
  removePlayerSchema,
};
