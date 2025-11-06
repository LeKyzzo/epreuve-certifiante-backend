import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

import env from '../config/env';
import type { Utilisateur, UtilisateurCreation } from '../models/user';
import UserService from './user.service';

export interface JetonPayload {
  id: number;
  username: string;
  role: 'utilisateur' | 'admin';
}

export default class AuthService {
  constructor(private readonly userService = new UserService()) {}

  async inscrire(payload: UtilisateurCreation): Promise<Utilisateur> {
    return this.userService.creerUtilisateur(payload);
  }

  async connecter(username: string, password: string): Promise<{ utilisateur: Utilisateur; token: string } | null> {
    const utilisateur = await this.userService.verifierIdentifiants(username, password);

    if (!utilisateur) {
      return null;
    }

    const jeton = this.genererToken({
      id: utilisateur.id,
      username: utilisateur.username,
      role: utilisateur.role
    });

    return { utilisateur, token: jeton };
  }

  private genererToken(payload: JetonPayload): string {
  const options: SignOptions = { expiresIn: env.jwt.expiresIn as StringValue };
    return jwt.sign(payload, env.jwt.secret as Secret, options);
  }
}
