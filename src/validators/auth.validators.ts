import { z } from 'zod';

export const schemaInscription = z.object({
  body: z.object({
    username: z.string().min(3, 'Le nom d’utilisateur doit contenir au moins 3 caractères.'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
    role: z.enum(['utilisateur', 'admin']).optional()
  })
});

export const schemaConnexion = z.object({
  body: z.object({
    username: z.string().min(3, 'Le nom d’utilisateur est requis.'),
    password: z.string().min(1, 'Le mot de passe est requis.')
  })
});
