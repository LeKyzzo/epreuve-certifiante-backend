import type { JetonPayload } from '../../services/auth.service';

declare global {
  namespace Express {
    interface Request {
      utilisateur?: JetonPayload;
    }
  }
}

export {};
