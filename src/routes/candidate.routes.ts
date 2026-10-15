import { Router } from 'express';
import { createCandidate, getCandidates, getCandidateById, deleteCandidate } from '../controllers/candidate.controller.js';

const router = Router();

router.post('/candidates', createCandidate);
router.get('/candidates', getCandidates);
router.get('/candidates/:id', getCandidateById);
router.delete('/candidates/:id', deleteCandidate);

export default router;