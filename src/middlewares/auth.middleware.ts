import { Request, Response, NextFunction } from 'express';

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Si no envía el encabezado de autorización
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Acceso Protegido"');
    return res.status(401).json({ error: 'Acceso no autorizado. Se requieren credenciales.' });
  }

  // Decodificar credenciales de Base64 ("usuario:contraseña")
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  const USER = process.env.ADMIN_USER || 'admin';
  const PASS = process.env.ADMIN_PASS || 'admin123';

  if (username !== USER || password !== PASS) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Acceso Protegido"');
    return res.status(401).json({ error: 'Acceso no autorizado. Credenciales incorrectas.' });
  }

  return next();
};