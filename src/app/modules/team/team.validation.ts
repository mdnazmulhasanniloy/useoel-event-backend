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

export const createTeamSchema = z.object({
  body: z.object({
    user: z
      .string({ required_error: 'User ID is required' })
      .regex(/^[a-f\d]{24}$/i, {
        message: 'Invalid User ID format',
      }), 
      

    name: z.string({ required_error: 'Team name is required' }),
    city: z.string({ required_error: 'City is required' }),
    state: z.string({ required_error: 'State is required' }),
    country: z.string({ required_error: 'Country is required' }),
    teamCategory: z.string({ required_error: 'Team category is required' }),
    ageGroup: z.string({ required_error: 'Age group is required' }), 
    logo: z
      .string({ required_error: 'Team logo URL is required' })
      .url({ message: 'Invalid logo URL format' }),
    player: z.array(TeamPlayerSchema).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

