import { Router } from 'express';
import { db } from '../db/db.js';
import { matches } from '../db/schema.js';
import { createMatchSchema, listMatchesQuerySchema } from '../validation/matches.js';
import { getMatchStatus } from '../utils/match-status.js';
import { desc } from 'drizzle-orm';

const matchRouter = Router();
const MAX_LIMIT = 100; // Maximum limit for listing matches
matchRouter.get('/', async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query parameters", details: JSON.stringify(parsed.error) });
  }
  const limit = Math.min(parsed.data.limit || 20, MAX_LIMIT); // Default limit to 20 if not provided, max 100

  try {
    const matchesList = await db.select().from(matches).orderBy(desc(matches.createdAt)).limit(limit);
    res.status(200).json({ matchesList });
  } catch (error) {
    console.log("Error fetching matches:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

matchRouter.post('/', async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);
  
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request data", details: JSON.stringify(parsed.error) });
  }
  
  try {
    const matchData = parsed.data;
    const { startTime, endTime, homeScore, awayScore } = matchData;
    
    const [newMatch] = await db.insert(matches).values(
      {
        ...matchData,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status: getMatchStatus(startTime, endTime),
      }
    ).returning();
    res.status(201).json({ data: newMatch });
  } catch (error) {
    console.log("Error creating match:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default matchRouter;