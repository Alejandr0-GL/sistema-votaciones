import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

// POST /candidates
export const createCandidate = async (req: Request, res: Response) => {

  try {

    const { name, party } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre del candidato es obligatorio' });
    }

    //Validación: Un candidato no puede estar registrado como votante
    const existingVoter = await prisma.voter.findFirst({ where: { name } });
    if (existingVoter) {
      return res.status(400).json({ error: 'Un votante no puede ser candidato' });
    }

    const candidate = await prisma.candidate.create({ data: { name, party } });
    return res.status(201).json(candidate);
  } 
  catch (error) {
    return res.status(500).json({ error: 'Error al registrar el candidato' });
  }
};

// GET /candidates
export const getCandidates = async (_req: Request, res: Response) => {

  const candidates = await prisma.candidate.findMany();
  return res.json(candidates);
};

// GET /candidates/{id}
export const getCandidateById = async (req: Request<{ id: string }>, res: Response) => {

  const { id } = req.params;
  const candidate = await prisma.candidate.findUnique({ where: { id } });

  if (!candidate) { 
    return res.status(404).json({ error: 'Candidato no encontrado' });
  }

  return res.json(candidate);
};

//  DELETE /candidates/{id}
export const deleteCandidate = async (req: Request<{ id: string }>, res: Response) => {

  const { id } = req.params;
  try {
    await prisma.candidate.delete({ where: { id } });
    return res.json({ message: 'Candidato eliminado correctamente' });
  } 
  catch {
    return res.status(404).json({ error: 'Candidato no encontrado' });
  }
};