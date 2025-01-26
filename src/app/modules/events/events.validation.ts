import * as z from "zod"



const RoundSchema = z.object({
  roundName: z.string().min(1, 'Round name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  totalTime: z.string().min(1, 'Total time is required'),
});

// Define the IEvents schema
const createEventSchema =z.object(
    {
        body: z.object({ 
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  ageGroup: z.string().min(1, 'Age group is required'),
  scoringStyle: z.string().min(1, 'Scoring style is required'),
  Round: z.number().nonnegative('Round must be a non-negative number'),
  roles: z.string().min(1, 'Roles are required'),
  registration: z.object({
    startTime: z.string().min(1, 'Registration start time is required'),
    endTime: z.string().min(1, 'Registration end time is required'),
    maxParticipants: z
      .number()
      .int('Max participants must be an integer')
      .positive('Max participants must be greater than zero'),
  }),
  rounds: z.array(RoundSchema).min(1, 'At least one round is required'), 
})
}
);
const updateEventSchema =z.object(
    {
        body: z.object({ 
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  ageGroup: z.string().min(1, 'Age group is required'),
  scoringStyle: z.string().min(1, 'Scoring style is required'),
  Round: z.number().nonnegative('Round must be a non-negative number'),
  roles: z.string().min(1, 'Roles are required'),
  registration: z.object({
    startTime: z.string().min(1, 'Registration start time is required'),
    endTime: z.string().min(1, 'Registration end time is required'),
    maxParticipants: z
      .number()
      .int('Max participants must be an integer')
      .positive('Max participants must be greater than zero'),
  }),
  rounds: z.array(RoundSchema).min(1, 'At least one round is required'), 
}).deepPartial()
}
);


export const eventValidator = {
  createEventSchema,
  updateEventSchema,
};