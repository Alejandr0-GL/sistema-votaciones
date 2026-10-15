import { Router } from 'express';
import { castVote, getVotes, getStatistics } from '../controllers/vote.controller.js';

const router = Router();

router.post('/votes', castVote);
router.get('/votes', getVotes);
router.get('/votes/statistics', getStatistics);

export default router;