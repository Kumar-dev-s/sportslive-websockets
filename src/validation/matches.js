import { z } from 'zod';

// Match status constants
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

// Schema for listing matches with optional limit query parameter
export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

// Schema for validating match ID from URL parameters
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Schema for creating a new match
export const createMatchSchema = z
  .object({
    sport: z.string().min(1, 'Sport is required and cannot be empty'),
    homeTeam: z.string().min(1, 'Home team is required and cannot be empty'),
    awayTeam: z.string().min(1, 'Away team is required and cannot be empty'),
    startTime: z
      .string()
      .refine(
        (val) => !isNaN(Date.parse(val)),
        'startTime must be a valid ISO date string'
      ),
    endTime: z
      .string()
      .refine(
        (val) => !isNaN(Date.parse(val)),
        'endTime must be a valid ISO date string'
      ),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    const startTimeDate = new Date(data.startTime);
    const endTimeDate = new Date(data.endTime);

    if (endTimeDate <= startTimeDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'endTime must be chronologically after startTime',
      });
    }
  });

// Schema for updating match scores
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
