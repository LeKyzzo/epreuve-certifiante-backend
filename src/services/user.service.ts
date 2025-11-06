import bcrypt from 'bcrypt';

import pool from '../config/postgresClient';
import type { Utilisateur, UtilisateurCreation } from '../models/user';

const mapUtilisateur = (ligne: any): Utilisateur => ({
  id: ligne.id,
  username: ligne.username,
  password: ligne.password,
  role: ligne.role
});

export default class UserService {
  async trouverParUsername(username: string): Promise<Utilisateur | null> {
    const resultat = await pool.query(
      'SELECT id, username, password, role FROM users WHERE username = $1',
      [username]
    );

    if (resultat.rowCount === 0) {
      return null;
    }

    return mapUtilisateur(resultat.rows[0]);
  }

  async creerUtilisateur({ username, password, role = 'utilisateur' }: UtilisateurCreation): Promise<Utilisateur> {
    const hash = await bcrypt.hash(password, 10);
    const resultat = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, password, role',
      [username, hash, role]
    );

    return mapUtilisateur(resultat.rows[0]);
  }

  async verifierIdentifiants(username: string, motDePasse: string): Promise<Utilisateur | null> {
    const utilisateur = await this.trouverParUsername(username);

    if (!utilisateur) {
      return null;
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.password);
    return motDePasseValide ? utilisateur : null;
  }
}
