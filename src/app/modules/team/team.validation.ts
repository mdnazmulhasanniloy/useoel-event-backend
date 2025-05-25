import * as z from 'zod';

 

const createTeamSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Team name is required' }),
    city: z.string({ required_error: 'City is required' }),
    state: z.string({ required_error: 'State is required' }),
    country: z.string({ required_error: 'Country is required' }),
    teamCategory: z.string({ required_error: 'Team category is required' }),
    ageGroup: z.string({ required_error: 'Age group is required' }), 
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
    })
    .deepPartial(),
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
  removePlayerSchema,
};
