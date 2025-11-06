import { z } from 'zod';

export const schemaCreationEntrepot = z.object({
  body: z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
    location: z.string().min(2, 'La localisation doit contenir au moins 2 caractères.')
  })
});

export const schemaPlanEntrepot = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Identifiant invalide.')
  }),
  body: z.object({
    code: z.string().min(1, 'Le code est obligatoire.'),
    layout: z.array(z.any()).default([]),
    metadata: z.record(z.any()).optional()
  })
});

export const schemaMiseAJourPlanEntrepot = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Identifiant invalide.')
  }),
  body: z
    .object({
      code: z.string().optional(),
      layout: z.array(z.any()).optional(),
      metadata: z.record(z.any()).optional()
    })
    .refine((data: Record<string, unknown>) => Object.keys(data).length > 0, {
      message: 'Au moins un champ doit être fourni.'
    })
});
