import express from 'express';
import cors from 'cors';
import voterRoutes from './routes/voter.routes.js';
import candidateRoutes from './routes/candidate.routes.js';
import voteRoutes from './routes/vote.routes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { basicAuth } from './middlewares/auth.middleware.js';

const app = express();

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve('src/docs/swagger.json'), 'utf-8')
);

app.get('/', (_req, res) => {
  res.redirect('/api-docs');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());

app.use('/', basicAuth, voterRoutes);
app.use('/', basicAuth, candidateRoutes);
app.use('/', basicAuth, voteRoutes);

export default app;