import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

// POST /voters
export const createVoter = async (req: Request, res: Response) => {

  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'El nombre y el email son obligatorios' });
    }

    // Validación: Un votante no puede estar registrado como candidato
    const existingCandidate = await prisma.candidate.findFirst({ where: { name } });
    if (existingCandidate) {
      return res.status(400).json({ error: 'Un candidato no puede ser votante' });
    }

    const existingVoter = await prisma.voter.findUnique({ where: { email } });
    if (existingVoter) {
      return res.status(400).json({ error: 'Este correo electrónico ya está registrado' });
    }

    const voter = await prisma.voter.create({ data: { name, email } });
    return res.status(201).json(voter);
  } 
  catch (error) {
        return res.status(500).json({ error: 'Error al registrar el votante' });
  }
};

// GET /voters
export const getVoters = async (req: Request, res: Response) => {
  try {
    // Extraer parámetros de la URL (?page=1&limit=10&search=juan)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';

    // Calcular desplazamiento (offset)
    const skip = (page - 1) * limit;

    // Construir filtro de búsqueda opcional por nombre o email
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    // Consultar datos paginados y total de registros en paralelo
    const [voters, total] = await Promise.all([
      prisma.voter.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.voter.count({ where }),
    ]);

    // Retornar respuesta estructurada con metadata de paginación
    return res.json({
      data: voters,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los votantes.' });
  }
};

// GET /voters/{id}
export const getVoterById = async (req: Request<{ id: string }>, res: Response) => {

  const { id } = req.params;
  const voter = await prisma.voter.findUnique({ where: { id } });

  if (!voter) {
    return res.status(404).json({ error: 'Votante no encontrado' });
  }

  return res.json(voter);

};

// DELETE /voters/{id}
export const deleteVoter = async (req: Request<{ id: string }>, res: Response) => {

  const { id } = req.params;
  try {
    await prisma.voter.delete({ where: { id } });
    return res.json({ message: 'Votante eliminado correctamente' });
  } 
  catch {
    return res.status(404).json({ error: 'Votante no encontrado' });
  }
};