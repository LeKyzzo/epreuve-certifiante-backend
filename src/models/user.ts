export interface Utilisateur {
  id: number;
  username: string;
  password: string;
  role: 'utilisateur' | 'admin';
}

export interface UtilisateurCreation {
  username: string;
  password: string;
  role?: 'utilisateur' | 'admin';
}
