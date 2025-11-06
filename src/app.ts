import cors from 'cors';
import express, { type Request, type Response } from 'express';

import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ statut: 'ok' });
});

app.use('/api', routes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
});

export default app;
