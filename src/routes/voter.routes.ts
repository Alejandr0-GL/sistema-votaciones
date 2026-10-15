// POST /voters
import { Router } from 'express';
import { createVoter, getVoters, getVoterById, deleteVoter } from '../controllers/voter.controller.js';

const router = Router();

router.post('/voters', createVoter);
router.get('/voters', getVoters);
router.get('/voters/:id', getVoterById);
router.delete('/voters/:id', deleteVoter);

export default router;