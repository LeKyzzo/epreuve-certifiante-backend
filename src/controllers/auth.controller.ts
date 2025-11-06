import { type Request, type Response } from 'express';

import AuthService from '../services/auth.service';
import type { Utilisateur } from '../models/user';

export default class AuthController {
  constructor(private readonly service = new AuthService()) {}

  inscrire = async (req: Request, res: Response): Promise<void> => {
    const { username, password, role } = req.body as { username: string; password: string; role?: 'utilisateur' | 'admin' };

    try {
      const utilisateur = await this.service.inscrire({ username, password, role });
      res.status(201).json({ utilisateur: this.nettoyer(utilisateur) });
    } catch (erreur: any) {
      if (erreur?.code === '23505') {
        res.status(409).json({ message: 'Ce nom d’utilisateur est déjà utilisé.' });
        return;
      }
      res.status(500).json({ message: 'Inscription impossible.' });
    }
  };

  connecter = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body as { username: string; password: string };

    try {
      const resultat = await this.service.connecter(username, password);

      if (!resultat) {
        res.status(401).json({ message: 'Identifiants invalides.' });
        return;
      }

      res.json({ utilisateur: this.nettoyer(resultat.utilisateur), token: resultat.token });
    } catch (_erreur) {
      res.status(500).json({ message: 'Connexion impossible.' });
    }
  };

  private nettoyer(utilisateur: Utilisateur): Pick<Utilisateur, 'id' | 'username' | 'role'> {
    const { id, username, role } = utilisateur;
    return { id, username, role };
  }
}
