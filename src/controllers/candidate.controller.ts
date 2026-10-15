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
export const getCandidates = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { party: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.candidate.count({ where }),
    ]);

    return res.json({
      data: candidates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los candidatos.' });
  }
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