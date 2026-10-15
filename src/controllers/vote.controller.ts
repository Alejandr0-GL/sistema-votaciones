import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

//  POST /votes
export const castVote = async (req: Request, res: Response) => {

  try {

    const { voter_id, candidate_id } = req.body;

    if (!voter_id || !candidate_id) {
      return res.status(400).json({ error: 'voter_id y candidate_id son obligatorios' });
    }

    //Valida que el votante existe
    const voter = await prisma.voter.findUnique({ where: { id: voter_id } });
    if (!voter) {
      return res.status(404).json({ error: 'Votante no encontrado' });
    }

    //Comprueba que no haya votado previamente
    if (voter.has_voted) {
      return res.status(400).json({ error: 'Este votante ya ha votado' });
    }

    //Valida que el candidato existe
    const candidate = await prisma.candidate.findUnique({ where: { id: candidate_id } });
    if (!candidate) {
      return res.status(404).json({ error: 'Candidato no encontrado' });
    }

    //Transacción: Crea voto, actualiza status de votante, incrementa conteo del candidato
    const result = await prisma.$transaction(async (tx) => {
      const vote = await tx.vote.create({
        data: { voter_id, candidate_id }
      });

      await tx.voter.update({
        where: { id: voter_id },
        data: { has_voted: true }
      });

      await tx.candidate.update({
        where: { id: candidate_id },
        data: { votes: { increment: 1 } }
      });

      return vote;
    });

    return res.status(201).json({ message: 'Voto registrado exitosamente', vote: result });
  } 
  catch (error) {
    return res.status(500).json({ error: 'Error al emitir el voto' });
  }
};

// GET /votes
export const getVotes = async (_req: Request, res: Response) => {
  const votes = await prisma.vote.findMany({
    include: {
      voter: { select: { id: true, name: true, email: true } },
      candidate: { select: { id: true, name: true, party: true } }
    }
  });
  return res.json(votes);
};

// GET /votes/statistics
export const getStatistics = async (_req: Request, res: Response) => {

  try {

    //Total de votantes que han votado
    const totalVotes = await prisma.vote.count();

    const candidates = await prisma.candidate.findMany({
      select: { id: true, name: true, party: true, votes: true }
    });

    // Total de votos por candidato y porcentaje de votos por candidato
    const candidatesStats = candidates.map((c) => ({
      id: c.id,
      name: c.name,
      party: c.party,
      total_votes: c.votes,
      percentage: totalVotes > 0 ? Number(((c.votes / totalVotes) * 100).toFixed(2)) : 0
    }));

    return res.json({
      total_voters_who_voted: totalVotes,
      candidates_statistics: candidatesStats
    });
  } 
  catch (error) {
    return res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};