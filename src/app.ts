import cors, { type CorsOptions } from 'cors';
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import routes from './routes';
import swaggerSpec from './config/swagger';

const app = express();

const corsOptions: CorsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);
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
