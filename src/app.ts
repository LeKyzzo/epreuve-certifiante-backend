import cors from 'cors';
import express, { type Request, type Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import routes from './routes';
import swaggerSpec from './config/swagger';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ statut: 'ok' });
});

app.use('/api', routes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
});

export default app;
